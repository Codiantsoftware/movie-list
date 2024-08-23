import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/scss/main.scss";

import { Toaster } from "react-hot-toast";
import NextNProgress from "nextjs-progressbar";

import AuthGuard from "@/utils/AuthGuard";
import ReduxProvider from "@/store/redux-provider";
import { store } from "@/store";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ReduxProvider store={store}>
        <AuthGuard>
          <NextNProgress color="#20c997" options={{ showSpinner: false }} />
          <Component {...pageProps} />
        </AuthGuard>
      </ReduxProvider>
      <Toaster />
    </>
  );
}
