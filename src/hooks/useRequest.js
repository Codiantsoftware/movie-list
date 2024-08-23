import { useState, useCallback } from "react";
import { useSelector } from "react-redux";

/**
 * A custom React hook for handling API requests.
 *
 * @return {object} An object containing error, isLoading, and requestHandler.
 */
const useRequest = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state?.account?.userDetails?.token);

  const requestHandler = useCallback(async (configData, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(configData.url, {
        method: configData.method,
        body: configData.body ? configData.body : null,
        headers: configData.header
          ? configData.header
          : token && {
              Authorization: `Bearer ${token}`,
            },
      });

      if (!response.ok) {
        throw new Error("Something went Wrong");
      }

      const result = await response.json();
      applyData({ ...result, success: true });
    } catch (error) {
      applyData({ success: false, message: error.message });
      setError(error?.message);
    }
    setIsLoading(false);
  }, []);

  return {
    error: error,
    isLoading: isLoading,
    requestHandler: requestHandler,
  };
};

export default useRequest;
