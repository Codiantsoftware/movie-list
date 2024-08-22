import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/scss/main.scss";

import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";

import AuthGuard from "@/utils/AuthGuard";

export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthGuard>
        <NextNProgress color="#20c997" options={{ showSpinner: false }} />
        <Component {...pageProps} />
        <Toaster />
      </AuthGuard>
    </>
  );
}
