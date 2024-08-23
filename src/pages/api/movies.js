import { ValidationError } from "yup";

import Movie from "../../../models/Movie";
import sequelize from "../../../lib/db";
import { movieSchema } from "../../../lib/validationSchemas";
import upload from "../../../lib/upload";
import { authMiddleware } from "../../../lib/authMiddleware";
import logger from "@/utils/logger";

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

const uploadMiddleware = upload.single("poster");

/**
 * API handler for movie operations, including listing movies with pagination
 * and creating a new movie with file upload support.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
async function handleUploadMovie(req, res) {
  await sequelize.sync();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const movies = await Movie.findAndCountAll({
          limit: parseInt(limit),
          offset: parseInt(offset),
        });

        res.status(200).json({
          success: true,
          data: movies.rows,
          pagination: {
            total: movies.count,
            page: parseInt(page),
            pages: Math.ceil(movies.count / limit),
          },
        });
      } catch (error) {
        logger("Error fetching movies:", error);
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;

    case "POST":
      uploadMiddleware(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        try {
          const { title, year } = req.body;
          const file = req.file;

          // Validate form fields and file
          await movieSchema.validate({ title, year, poster: file });

          // Create movie entry with file information
          const movie = await Movie.create({
            title,
            year,
            poster: file.path, // Save the file path in the database
          });

          res.status(201).json({ success: true, data: movie });
        } catch (error) {
          if (error instanceof ValidationError) {
            return res
              .status(422)
              .json({ success: false, message: error.message });
          } else {
            logger("Error creating movie:", error);
            return res
              .status(500)
              .json({ success: false, message: "Server error" });
          }
        }
      });
      break;

    default:
      res
        .status(405)
        .json({ success: false, message: `Method ${method} not allowed` });
      break;
  }
}

export default function handler(req, res) {
  authMiddleware(req, res, () => handleUploadMovie(req, res));
}
