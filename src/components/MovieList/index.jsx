"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  Col,
  Container,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";

import withAuth from "../hoc/withAuth";

const PAGE_LIMIT = 8;

/**
 * A functional component that displays a list of movies,
 * allowing users to view, edit, and paginate through the list.
 *
 * @return {JSX.Element} The JSX element representing the movie list
 */
const MovieList = () => {
  const router = useRouter();
  const [state, setState] = useState({
    isLoading: true,
    lists: [],
    currentPage: 1,
    pagination: {},
  });

  /**
   * Retrieves a list of movies from the API, handling pagination and loading state.
   *
   * @param {object} options - Options for the API request
   * @param {number} options.page - The page number to retrieve
   * @param {boolean} options.isPagination - Whether to update the pagination state
   * @return {Promise<void>} A promise that resolves when the movie list has been updated
   */
  const getMovieLists = async (
    { page, isPagination } = { page: 1, isPagination: false },
  ) => {
    try {
      if (isPagination) {
        setState((prevState) => ({ ...prevState, isLoading: true }));
      }
      const response = await fetch(
        `/api/movies?page=${page}&limit=${PAGE_LIMIT}`,
      );
      const data = await response.json();
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        lists: data?.data ?? [],
        currentPage: isPagination ? page : prevState.currentPage,
        pagination: {
          ...data?.pagination,
          totalPages: Math.ceil(data?.pagination?.total / PAGE_LIMIT),
        },
      }));
    } catch (error) {
      setState({ ...state, isLoading: false });
      toast.error(error?.messsage ?? "Something went wrong");
    }
  };

  /**
   * Handles pagination by retrieving the movie list for the specified page.
   *
   * @param {number} page - The page number to retrieve
   * @return {void} No return value, updates the movie list state
   */
  const handlePagination = (page) => {
    getMovieLists({ page, isPagination: true });
  };

  /**
   * Handles user logout by removing the token from local storage and redirecting to the signin page.
   *
   * @return {void} No return value, redirects to signin page
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  useEffect(() => {
    getMovieLists();
  }, []);

  return (
    <div className="moviePage">
      {!state.isLoading && !state.lists?.length ? (
        <>
          <div className="emptyPage text-center">
            <Container>
              <h1 className="title">Your movie list is empty</h1>
              <Button
                variant="primary"
                onClick={() => router.push("/create-movie")}
              >
                Add a new movie
              </Button>
            </Container>
          </div>
        </>
      ) : !state.isLoading && state.lists.length > 0 ? (
        <main className="py-120">
          <Container>
            <div className="pageHeader d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h1 className="title mb-0">My movies</h1>
                <Link href="/create-movie">
                  <em className="addMovies icon-add-circle"></em>
                </Link>
              </div>
              <div>
                <span className="logoutLink" onClick={handleLogout}>
                  <span>Logout</span>
                  <em className="icon-logout" />
                </span>
              </div>
            </div>

            <div className="movieList py-120">
              <Row className="g-4">
                {state.lists?.map((listItem, idx) => (
                  <Col key={idx} xl={3} md={4} xs={6}>
                    <Card>
                      <div className="card-image">
                        <Card.Img
                          variant="top"
                          src={`/api/${listItem?.poster}`}
                        />
                      </div>
                      <Card.Body>
                        <div className="d-flex align-items-center justify-content-between">
                          <Card.Title className="text-truncate" as="h5">
                            {listItem?.title}
                          </Card.Title>
                          <Link
                            className="editMovie"
                            href={`/edit-movie/${listItem.id}`}
                          >
                            <em className="icon-edit"></em>
                          </Link>
                        </div>
                        <Card.Text>{listItem?.year}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            <div>
              <Pagination className="justify-content-center">
                <Pagination.Prev
                  disabled={state.currentPage <= 1}
                  className="page-item-link"
                  onClick={() => handlePagination(state.currentPage - 1)}
                >
                  Prev
                </Pagination.Prev>
                {Array(state.pagination.totalPages)
                  .fill({})
                  .map((_, idx) => (
                    <Pagination.Item
                      disabled={idx + 1 === state.currentPage}
                      key={idx}
                      active={idx + 1 === state.currentPage}
                      onClick={() => handlePagination(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                <Pagination.Next
                  disabled={state.currentPage === state.pagination.totalPages}
                  className="page-item-link"
                  onClick={() => handlePagination(state.currentPage + 1)}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </div>
          </Container>
        </main>
      ) : (
        <div className="loaderCenter">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default withAuth(MovieList);
