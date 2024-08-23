import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import { Spinner } from "react-bootstrap";

import { setResetUserDetails } from "@/store/accountSlice";

/**
 * AuthGuard component that protects routes based on authentication status.
 * Redirects unauthenticated users to the sign-in page.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The component's children that should be rendered if authenticated.
 * @returns {React.ReactNode} The rendered component or a loading spinner.
 */
const AuthGuard = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.account?.userDetails?.token);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const isExpireToken = decoded.exp < currentTime;
      if (isExpireToken) {
        dispatch(setResetUserDetails());
        router.push("/auth/signin");
      } else {
        if (router.pathname === "/auth/signin") {
          router.push("/");
        } else {
          setIsLoading(false);
        }
      }
    } else {
      if (
        router.pathname !== "/auth/signin" &&
        router.pathname !== "/api-doc"
      ) {
        router.push("/auth/signin");
      } else {
        setIsLoading(false);
      }
    }
  }, [router, token]);

  if (isLoading) {
    return (
      <div className="loaderCenter">
        <Spinner animation="border" />
      </div>
    );
  }

  return children;
};

export default AuthGuard;
