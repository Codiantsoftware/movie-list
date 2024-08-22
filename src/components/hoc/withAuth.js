import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * A higher-order component (HOC) that wraps the provided component with authentication functionality.
 * It checks for the presence of a token in local storage and redirects to the login page if it's not found.
 *
 * @param {React.Component} WrappedComponent - The component to be wrapped with authentication functionality
 * @return {React.Component} The wrapped component with authentication functionality
 */
const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const [isValid, setIsValid] = useState(false);
    const router = useRouter();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
      if (!token) {
        // Redirect to login page if no token is found
        router.push("/auth/signin");
      } else {
        router.push("/");
      }
      setIsValid(true);
    }, [token]);

    if (!isValid) {
      // Optionally return null or a loading spinner while redirecting
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set the displayName for better debugging
  AuthHOC.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthHOC;
};

export default withAuth;
