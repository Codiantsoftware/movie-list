"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

import { Container, Form, Spinner } from "react-bootstrap";
import Button from "@/components/Button";

import { setIsRememberMe, setUserDetails } from "@/store/accountSlice";
import { useDispatch, useSelector } from "react-redux";

/**
 * Handles user sign-in functionality, including form validation,
 * API request to authenticate user, and storing user credentials
 * in local storage based on the 'remember me' option.
 *
 * @return {JSX.Element} The sign-in form component
 */
const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isRememberDetails = useSelector(
    (state) => state?.account?.isRememberMe,
  );

  // Secret key for encryption
  const secretKey = process.env.NEXT_PUBLIC_REMEMBER_SECRET;

  /**
   * Handles the form submission for user sign-in.
   *
   * @param {Object} formValues - The form values submitted by the user.
   * @param {Object} formProps - Additional form properties.
   * @return {Promise<void>} A promise that resolves when the sign-in process is complete.
   */
  const handleSubmit = async (formValues) => {
    try {
      const authDetails = { ...formValues };
      delete authDetails.isRemember;
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authDetails),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Sign in successfully");
      dispatch(setUserDetails({ ...data?.user, token: data?.token }));

      // Store token based on remember me option
      if (formValues.isRemember) {
        const encryptedPassword = CryptoJS.AES.encrypt(
          formValues.password,
          secretKey,
        ).toString();
        dispatch(
          setIsRememberMe({
            email: formValues.email,
            password: encryptedPassword,
          }),
        );
      } else {
        dispatch(setIsRememberMe(null));
      }

      router.push("/");
    } catch (error) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      isRemember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email format is invalid")
        .required("Email is a required field"),
      password: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum."),
      isRemember: Yup.boolean(),
    }),
    onSubmit: (formValues, formProps) => handleSubmit(formValues, formProps),
  });

  // Load saved credentials on component mount
  useEffect(() => {
    if (isRememberDetails) {
      // Decrypt the password
      const bytes = CryptoJS.AES.decrypt(
        isRememberDetails?.password,
        secretKey,
      );
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

      formik.setValues({
        email: isRememberDetails?.email,
        password: decryptedPassword,
        isRemember: true,
      });
    }
  }, []);

  return (
    <div className="authMain position-relative">
      <Container>
        <div className="authMain_innerbox">
          <h1>Sign in</h1>
          <form onSubmit={formik.handleSubmit}>
            <Form.Group className="form-group">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="error text-danger tracking-[0.2]">
                  {formik.errors.email}
                </span>
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="error text-danger tracking-[0.2]">
                  {formik.errors.password}
                </span>
              )}
            </Form.Group>

            <Form.Group className="form-group text-center d-flex align-items-center justify-content-center">
              <input
                type="checkbox"
                id="isRemember"
                name="isRemember"
                checked={formik.values.isRemember}
                onChange={formik.handleChange}
                className="form-check-input"
              />
              <label htmlFor="isRemember">Remember me</label>
            </Form.Group>
            <Button
              className="w-100 ripple-effect-dark"
              variant="primary"
              type="submit"
            >
              {formik.isSubmitting ? <Spinner /> : "Login"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
