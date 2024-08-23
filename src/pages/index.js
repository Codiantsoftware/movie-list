import Head from "next/head";

import MovieList from "@/components/MovieList";

const Home = () => {
  return (
    <>
      <Head>
        <title>My movies</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <MovieList />
    </>
  );
};

export default Home;
