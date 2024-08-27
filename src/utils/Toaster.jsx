import { useEffect } from "react";
import toast, { Toaster as ReactToast, useToasterStore } from "react-hot-toast";

const Toaster = () => {
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 1;

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  return <ReactToast maxCount={1} />;
};

export default Toaster;
