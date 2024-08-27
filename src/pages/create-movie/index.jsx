import React from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";

import CreateAndEdit from "@/components/CreateEdit";

import { getStaticPropsWithTranslations } from "@/utils/i18n";

/**
 * A React functional component that renders the CreateAndEdit component.
 *
 * @return {JSX.Element} The JSX element representing the CreateAndEdit component.
 */

const Create = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("createNewMovie")}</title>
      </Head>
      <CreateAndEdit />;
    </>
  );
};

export async function getStaticProps({ locale }) {
  return getStaticPropsWithTranslations(locale);
}

export default Create;
