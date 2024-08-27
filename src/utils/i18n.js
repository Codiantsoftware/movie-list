import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticPropsWithTranslations = async (
  locale,
  namespaces = ["common"],
) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, namespaces)),
    },
  };
};
