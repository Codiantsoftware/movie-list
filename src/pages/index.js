import Head from "next/head";
import { useTranslation } from "react-i18next";

import MovieList from "@/components/MovieList";
import { getStaticPropsWithTranslations } from "@/utils/i18n";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("myMovies")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MovieList />
    </>
  );
};

export async function getStaticProps({ locale }) {
  return getStaticPropsWithTranslations(locale);
}

export default Home;
