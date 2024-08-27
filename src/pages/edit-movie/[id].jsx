import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { Spinner } from "react-bootstrap";

import useRequest from "@/hooks/useRequest";
import CreateAndEdit from "@/components/CreateEdit";

import { getStaticPropsWithTranslations } from "@/utils/i18n";

export async function getServerSideProps(context) {
  return getStaticPropsWithTranslations(context.locale);
}

/**
 * A functional component for editing a movie.
 *
 * @param {object} props - The component props.
 * @return {JSX.Element} The JSX element representing the edit movie page.
 */
const EditMovie = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const { isLoading, requestHandler } = useRequest();
  const [editDetails, setEditDetails] = useState({});

  /**
   * Retrieves movie details from the API based on the provided ID.
   *
   * @return {Promise<void>} A promise that resolves when the movie details are fetched and updated in the component state.
   */
  const getMovieDetails = async () => {
    try {
      const configData = {
        url: `/api/movies/${router.query.id}`,
        method: "GET",
      };

      await requestHandler(configData, (data) => {
        if (!data?.success) {
          throw new Error(data?.message);
        }
        setEditDetails(data?.data);
      });
    } catch (error) {
      router.push("/");
      toast.error(error?.messsage ?? t("somethingWengWrong"));
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, []);

  return (
    <>
      {isLoading && !Object.keys(editDetails)?.length ? (
        <div className="loaderCenter">
          <Spinner />
        </div>
      ) : !isLoading ? (
        <>
          <Head>
            <title>{t("movieEdit")}</title>
          </Head>
          <CreateAndEdit editDetails={editDetails} />
        </>
      ) : null}
    </>
  );
};

export default EditMovie;
