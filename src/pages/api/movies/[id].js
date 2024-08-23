import Movie from "../../../../models/Movie";
import sequelize from "../../../../lib/db";
import upload from "../../../../lib/upload";

import logger from "@/utils/logger";
import { movieUpdateSchema } from "../../../../lib/validationSchemas";
import { ValidationError } from "sequelize";
import { authMiddleware } from "../../../../lib/authMiddleware";
/**
 * API route handler for managing individual movies by ID.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadMiddleware = upload.single("poster");
export default async function handler(req, res) {
  await sequelize.sync();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      return authMiddleware(req, res, () => handleGetMovieById(req, res, id));
    case "PUT":
      return authMiddleware(req, res, () =>
        handleUpdateMovieById(req, res, id),
      );
    case "DELETE":
      return authMiddleware(req, res, () =>
        handleDeleteMovieById(req, res, id),
      );
    default:
      return res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`,
      });
  }
}

/**
 * Handles the GET request to retrieve a movie by its ID.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 * @param {string | number} id - The movie ID.
 */
async function handleGetMovieById(req, res, id) {
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
        success: false,
        data: {},
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
        success: false,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    logger("Error fetching movie:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the movie",
      error: error.message || "Internal Server Error",
    });
  }
}

/**
 * Handles the PUT request to update a movie by its ID.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 * @param {string | number} id - The movie ID.
 */
async function handleUpdateMovieById(req, res, id) {
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
        success: false,
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Only proceed with file upload if the movie exists
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const { title, year } = req.body;
        const file = req.file;

        await movieUpdateSchema.validate({ title, year, poster: file });

        // Update movie entry with new data
        await movie.update({
          title,
          year,
          poster: file ? file.path : movie.poster, // Update poster only if a new file is uploaded
        });

        return res.status(200).json({
          success: true,
          data: movie,
        });
      } catch (error) {
        if (error.name === "ValidationError") {
          return res
            .status(400)
            .json({ success: false, message: error.errors.join(", ") });
        } else {
          logger("Error updating movie:", error);

          return res.status(500).json({
            success: false,
            message: "An error occurred while updating the movie",
            // error: error.message || "Internal Server Error",
          });
        }
      }
    });
  } catch (error) {
    logger("Error updating movie:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the movie",
      error: error.message || "Internal Server Error",
    });
  }
}

/**
 * Handles the DELETE request to remove a movie by its ID.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 * @param {string | number} id - The movie ID.
 */
async function handleDeleteMovieById(req, res, id) {
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "Invalid movie ID",
        success: false,
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    await movie.destroy();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    loggerr("Error deleting movie:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the movie",
      error: error.message || "Internal Server Error",
    });
  }
}
