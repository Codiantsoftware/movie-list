import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { i18n } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import User from "../../../../models/User";
import sequelize from "../../../../lib/db";
import { userSchema } from "../../../../lib/validationSchemas";
import logger from "@/utils/logger";

/**
 * API route handler for user authentication.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  await sequelize.sync();

  const lang = req.headers["accept-language"];

  await serverSideTranslations(lang || "en", ["common"]);

  const { method } = req;

  switch (method) {
    case "POST":
      return handleUserLogin(req, res);
    default:
      return res.status(405).json({
        success: false,
        message: `${method} ${i18n.t("backend.methodNotSupported")}`,
      });
  }
}

/**
 * Handles the POST request for user login.
 *
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
async function handleUserLogin(req, res) {
  try {
    // Validate the request body using Yup schema
    await userSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: i18n.t("backend.userNotFound") });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: i18n.t("backend.incorrectPassword") });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Update the user with the token
    await User.update({ token }, { where: { id: user.id } });

    return res.status(200).json({
      success: true,
      message: i18n.t("signInSuccess"),
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handle Yup validation errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({
          success: false,
          message: error?.errors?.join?.(", ") ?? i18n.t("serverError"),
        });
    }

    // Handle other errors
    logger("Server error:", error); // Changed from logger to console.error for consistency
    return res.status(500).json({
      success: false,
      message: i18n.t("serverError"),
    });
  }
}
