import React from "react";
import toast from "react-hot-toast";

import CreateAndEdit from "@/components/CreateEdit";

export async function getServerSideProps(context) {
  try {
    const url = process.env.NEXTAUTH_URL;
    const { id } = context.query;
    const response = await fetch(`${url}/api/movies/${id}`);
    const data = await response.json();
    if (!data?.success) {
      toast.error("Movies details not found");
      return {
        redirect: {
          destination: "/",
          permanent: true,
        },
      };
    } else {
      return {
        props: {
          details: data?.data,
        },
      };
    }
  } catch (error) {
    toast.error(error?.message ?? "Something went wrong");
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
}
/**
 * A functional component for editing a movie.
 *
 * @param {object} props - The component props.
 * @return {JSX.Element} The JSX element representing the edit movie page.
 */
const EditMovie = ({ details }) => {
  return (
    <>
      <CreateAndEdit editDetails={details} />
    </>
  );
};

export default EditMovie;
