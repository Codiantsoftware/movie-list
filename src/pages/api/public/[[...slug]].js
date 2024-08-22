import fs from "fs";
import path from "path";

/**
 * Handles HTTP requests for serving files from the public directory.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @return {void}
 */
export default function handler(req, res) {
  if (req.query.slug && Array.isArray(req.query.slug)) {
    const publicDir = path.join(process.cwd(), "public");
    const fileUrl = req.query.slug.join("/");
    const filePath = path.join(publicDir, fileUrl);

    fs.readFile(filePath, (error, data) => {
      if (error) {
        return res.status(404).send(null);
      }
      return res.status(200).send(data);
    });
  } else {
    res.status(404).send(null);
  }
}
