import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";

import { Container, Form, Image, Spinner } from "react-bootstrap";
import Button from "../Button";

import useRequest from "@/hooks/useRequest";

const acceptFileExt = ["image/png", "image/jpg", "image/jpeg"];

/**
 * A React functional component for creating and editing movies.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.editDetails - The details of the movie to be edited.
 * @return {JSX.Element} The JSX element representing the component.
 */
const CreateAndEdit = (props) => {
  const { editDetails } = props;
  const router = useRouter();
  const { t } = useTranslation();

  const { requestHandler } = useRequest();

  /**
   * Handles form submission by sending a request to the API to create or update a movie.
   *
   * @param {Object} formValues - An object containing the title, year, and poster of the movie.
   * @return {Promise<void>} A promise that resolves when the request is complete.
   */
  const handleSubmit = async (formValues) => {
    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("year", formValues.year);
      formData.append("poster", formValues.poster);

      const apiUrl = editDetails
        ? `/api/movies/${router.query.id}`
        : "/api/movies";

      const configData = {
        url: apiUrl,
        method: editDetails ? "PUT" : "POST",
        body: formData,
      };

      await requestHandler(configData, (data) => {
        if (data?.success) {
          toast.success(t(editDetails ? "updatedSuccess" : "createdSuccess"));
          router.push("/");
        } else {
          throw new Error(data?.message);
        }
      });
    } catch (error) {
      toast.error(error.message ?? t("somethingWengWrong"));
    }
  };

  const formik = useFormik({
    initialValues: {
      title: editDetails?.title ?? "",
      year: editDetails?.year ?? "",
      poster: editDetails?.poster ?? null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(t("createMovie.validation.titleRequired")),
      year: Yup.string()
        .required(t("createMovie.validation.yearRequired"))
        .length(4, t("createMovie.validation.yearLength"))
        .matches(/^\d{4}$/, t("createMovie.validation.yearValid")),
      poster: Yup.mixed()
        .required(t("createMovie.validation.fileRequired"))
        .test(
          "fileSize",
          t("createMovie.validation.fileUnsupportFormat"),
          function (value) {
            if (!editDetails || typeof value !== "string") {
              return value && ["image/jpeg", "image/png"].includes(value.type);
            }
            return true;
          },
        )
        .test("fileSize", t("createMovie.validation.fileTooLarge"), (value) => {
          if (!editDetails || typeof value !== "string") {
            return value && value.size <= 2 * 1024 * 1024; // 2 MB
          }
          return true;
        }),
    }),
    onSubmit: (formValues, formProps) => handleSubmit(formValues, formProps),
  });

  /**
   * Handles the drop event for the file input field.
   *
   * @param {Array<File>} acceptedFiles - The list of accepted files.
   * @return {void} This function does not return anything.
   */
  const handleFildDrop = (acceptedFiles) => {
    if (acceptFileExt.includes(acceptedFiles[0]?.type)) {
      formik.setFieldValue("poster", acceptedFiles[0]);
    } else {
      toast.error(t("uploadFileValidation"));
    }
  };

  return (
    <main className="py-120">
      <Container>
        <div className="pageHeader d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <h1 className="title mb-0">
              {t(editDetails ? "edit" : "createNewMovie")}
            </h1>
          </div>
        </div>
        <div className="createMovie py-120">
          <form onSubmit={formik.handleSubmit}>
            <div className="createForm">
              <div className="createForm_left">
                <Dropzone
                  onDrop={handleFildDrop}
                  accept={{
                    "image/jpg": [],
                    "image/jpeg": [],
                    "image/png": [],
                  }}
                  maxFiles={1}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      {!formik.values.poster ? (
                        <>
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <em className="icon-download"></em>
                            <p>{t("dropImage")}</p>
                          </div>
                        </>
                      ) : (
                        <div className="dropzone cursor-default">
                          <div className="dropzone_uploaded">
                            <Image
                              variant="top"
                              src={
                                editDetails &&
                                typeof formik.values.poster === "string"
                                  ? `/api/${editDetails?.poster}`
                                  : URL.createObjectURL(formik.values.poster)
                              }
                              alt="movie-img"
                            />
                            <span
                              onClick={() =>
                                formik.setFieldValue("poster", null)
                              }
                            >
                              X
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Dropzone>
                {formik.touched.poster && formik.errors.poster && (
                  <span className="error text-danger tracking-[0.2]">
                    {formik.errors.poster}
                  </span>
                )}
              </div>
              <div className="createForm_right">
                <Form.Group className="form-group">
                  <Form.Control
                    type="text"
                    name="title"
                    id="title"
                    placeholder={t("title")}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <span className="error text-danger tracking-[0.2]">
                      {formik.errors.title}
                    </span>
                  )}
                </Form.Group>
                <Form.Group className="form-group form-group-small">
                  <Form.Control
                    type="number"
                    name="year"
                    id="year"
                    placeholder={t("publishingYear")}
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.year && formik.errors.year && (
                    <span className="error text-danger tracking-[0.2]">
                      {formik.errors.year}
                    </span>
                  )}
                </Form.Group>
                <div className="d-none d-md-flex mt-64 gap-3">
                  <Button
                    className="w-50 ripple-effect-dark"
                    variant="outline-light"
                    onClick={() => router.push("/")}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    disabled={formik.isSubmitting}
                    className="w-50 ripple-effect-dark"
                    variant="primary"
                    type="submit"
                  >
                    {formik.isSubmitting ? (
                      <Spinner />
                    ) : (
                      <span>{t(editDetails ? "update" : "submit")}</span>
                    )}
                  </Button>
                </div>
              </div>
              <div className="w-100 d-flex d-md-none mt-5 gap-3">
                <Button
                  className="w-50 ripple-effect-dark"
                  variant="outline-light"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </Button>
                <Button
                  disabled={formik.isSubmitting}
                  className="w-50 ripple-effect-dark"
                  variant="primary"
                  type="submit"
                >
                  {formik.isSubmitting ? (
                    <Spinner />
                  ) : (
                    <span>{t(editDetails ? "update" : "submit")}</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
};

export default CreateAndEdit;
