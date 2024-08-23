import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { Card, Container, Form, Image, Spinner } from "react-bootstrap";
import Dropzone from "react-dropzone";
import Button from "../Button";
// import Image from "next/image";

const acceptFileExt = ["image/png", "image/jpg", "image/jpeg"];

/**
 * A React functional component for creating and editing movies.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.editDetails - The details of the movie to be edited.
 * @return {JSX.Element} The JSX element representing the component.
 */
const CreateAndEdit = (props) => {
  const router = useRouter();
  const { editDetails } = props;

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

      const response = await fetch(apiUrl, {
        method: editDetails ? "PUT" : "POST",
        body: formData,
      });
      const data = await response.json();
      if (!data?.success) throw new Error(data.message);
      toast.success(`${editDetails ? "Updated" : "Created"} successfully`);
      router.push("/");
    } catch (error) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      title: editDetails?.title ?? "",
      year: editDetails?.year ?? "",
      poster: editDetails?.poster ?? null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is a required field"),
      year: Yup.string()
        .required("Year is a required field")
        .length(4, "Year must be exactly 4 digits")
        .matches(/^\d{4}$/, "Year must be a valid 4-digit number"),
      poster: Yup.mixed()
        .required("A file is required")

        .test("fileSize", "Unsupported File Format", function (value) {
          if (!editDetails || typeof value !== "string") {
            return value && ["image/jpeg", "image/png"].includes(value.type);
          }
          return true;
        })
        .test("fileSize", "File too large", (value) => {
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
      toast.error("Please upload a JPG, JPEG, PNG file format.");
    }
  };

  return (
    <main className="py-120">
      <Container>
        <div className="pageHeader d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <h1 className="title mb-0">
              {editDetails ? "Edit" : "Create a new movie"}
            </h1>
          </div>
        </div>
        <div className="createMovie py-120">
          <form onSubmit={formik.handleSubmit}>
            <div className="createForm">
              <div className="createForm_left">
                <Dropzone
                  onDrop={handleFildDrop}
                  accept={acceptFileExt}
                  maxFiles={1}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      {!formik.values.poster ? (
                        <>
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <em className="icon-download"></em>
                            <p>Drop an image here</p>
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
                            {/* <Image
                              src={
                                editDetails &&
                                typeof formik.values.poster === "string"
                                  ? `/api/${editDetails?.poster}`
                                  : URL.createObjectURL(formik.values.poster)
                              }
                              alt="movie-img"
                              width={100}
                              height={100}
                            /> */}
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
                    placeholder="Title"
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
                    type="text"
                    name="year"
                    id="year"
                    placeholder="Publishing year"
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
                      <span>{editDetails ? "Update" : "Submit"}</span>
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
                    <span>{editDetails ? "Update" : "Submit"}</span>
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
