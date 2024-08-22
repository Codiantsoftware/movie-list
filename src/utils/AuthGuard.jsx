import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

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
  const [isLoading, setIsLoading] = useState(true); // Use isLoading instead of isValid

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      // User is authenticated
      if (router.pathname === "/auth/signin") {
        router.push("/");
      } else {
        setIsLoading(false); // Authentication check complete
      }
    } else {
      // User is not authenticated
      if (router.pathname !== "/auth/signin") {
        router.push("/auth/signin");
      } else {
        setIsLoading(false); // Already on sign-in page
      }
    }
  }, [router]);

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