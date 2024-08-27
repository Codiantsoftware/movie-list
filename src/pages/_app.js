import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/scss/main.scss";

import NextNProgress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";

import AuthGuard from "@/utils/AuthGuard";
import ReduxProvider from "@/store/redux-provider";
import { store } from "@/store";

import nextI18NextConfig from "../../next-i18next.config";
import Toaster from "@/utils/Toaster";

const emptyInitialI18NextConfig = {
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
  },
};

function App({ Component, pageProps }) {
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

export default appWithTranslation(App, emptyInitialI18NextConfig);
