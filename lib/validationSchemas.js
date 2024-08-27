import * as yup from "yup";
import { i18n } from "next-i18next";

const currentYear = new Date().getFullYear();

export const movieSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, i18n.t("backend.schemaValidation.movieCreate.titleMin"))
    .max(100, i18n.t("backend.schemaValidation.movieCreate.titleMax"))
    .required(i18n.t("backend.schemaValidation.movieCreate.titleRequired")),

  year: yup
    .number()
    .required(i18n.t("backend.schemaValidation.movieCreate.yearRequired"))
    .positive(i18n.t("backend.schemaValidation.movieCreate.yearPositiveNo"))
    .integer(i18n.t("backend.schemaValidation.movieCreate.yearInteger")),

  poster: yup
    .mixed()
    .required(i18n.t("backend.schemaValidation.movieCreate.posterValid"))
    .test(
      "fileType",
      i18n.t("backend.schemaValidation.movieCreate.posterValid"),
      (value) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return value && allowedTypes.includes(value.mimetype); // Validate file type
      },
    ),
});

export const userSchema = yup.object().shape({
  email: yup
    .string()
    .email(i18n.t("backend.schemaValidation.userLogin.emailInvalid"))
    .required(i18n.t("backend.schemaValidation.userLogin.emailRequired")),

  password: yup
    .string()
    .min(6, i18n.t("backend.schemaValidation.userLogin.passwordMin"))
    .max(50, i18n.t("backend.schemaValidation.userLogin.passwordMax"))
    .required(i18n.t("backend.schemaValidation.userLogin.passwordRequired")),
});

export const movieUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, i18n.t("backend.schemaValidation.movieUpdate.titleMin"))
    .max(100, i18n.t("backend.schemaValidation.movieUpdate.titleMax")),

  year: yup
    .number()
    .positive(i18n.t("backend.schemaValidation.movieCreate.yearPositiveNo"))
    .integer(i18n.t("backend.schemaValidation.movieCreate.yearInteger"))
    .min(1900, i18n.t("backend.schemaValidation.movieUpdate.yearMin"))
    .max(currentYear, i18n.t("backend.schemaValidation.movieUpdate.yearMax")),

  poster: yup
    .mixed()
    .test(
      "fileType",
      i18n.t("backend.schemaValidation.movieCreate.posterValid"),
      (value) => {
        if (value) {
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
          return allowedTypes.includes(value.mimetype); // Validate file type
        }
        return true; // If no file is provided, skip validation
      },
    ),
});
