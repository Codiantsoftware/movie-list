import * as yup from "yup";

const currentYear = new Date().getFullYear();

export const movieSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, "Title must be at least 1 character long")
    .max(100, "Title cannot be longer than 100 characters")
    .required("Title is required"),

  year: yup
    .number()
    .required("Release year is required")
    .positive("Release year must be a positive number")
    .integer("Release year must be an integer"),

  poster: yup
    .mixed()
    .required("Poster is required")
    .test("fileType", "Poster must be an image (jpeg, jpg, png)", (value) => {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      return value && allowedTypes.includes(value.mimetype); // Validate file type
    }),
});

export const userSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot be longer than 50 characters")
    .required("Password is required"),
});

export const movieUpdateSchema = yup.object().shape({
  title: yup
    .string()
    .min(1, "Title must be at least 1 character long")
    .max(100, "Title cannot be longer than 100 characters"),

  year: yup
    .number()
    .positive("Release year must be a positive number")
    .integer("Release year must be an integer")
    .min(1900, "Release year must be between 1900 and the current year")
    .max(currentYear, "Release year cannot be in the future"),

  poster: yup
    .mixed()
    .test("fileType", "Poster must be an image (jpeg, jpg, png)", (value) => {
      if (value) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return allowedTypes.includes(value.mimetype); // Validate file type
      }
      return true; // If no file is provided, skip validation
    }),
});
