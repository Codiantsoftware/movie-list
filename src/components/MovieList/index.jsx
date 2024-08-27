"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";

import { setResetUserDetails } from "@/store/accountSlice";
import useRequest from "@/hooks/useRequest";
import { langOptions } from "@/utils/static";

const PAGE_LIMIT = 8;

/**
 * A functional component that displays a list of movies,
 * allowing users to view, edit, and paginate through the list.
 *
 * @return {JSX.Element} The JSX element representing the movie list
 */
const MovieList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [state, setState] = useState({
    isLoading: true,
    lists: [],
    currentPage: 1,
    pagination: {},
  });
  const { requestHandler } = useRequest();

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

      const configData = {
        url: `/api/movies?page=${page}&limit=${PAGE_LIMIT}`,
        method: "GET",
      };

      await requestHandler(configData, (data) => {
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
      });
    } catch (error) {
      setState({ ...state, isLoading: false });
      toast.error(error?.messsage ?? t("somethingWengWrong"));
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
    toast.success(t("logoutSuccess"));
    dispatch(setResetUserDetails());
    router.push("/auth/signin");
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  useEffect(() => {
    getMovieLists();
  }, []);

  return (
    <div className="moviePage">
      {!state.isLoading && !state.lists?.length ? (
        <>
          <main className="py-120">
            <div className="emptyPage text-center">
              <Container>
                <div className="pageHeader d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center ms-auto">
                    <Dropdown className="languageDropdown">
                      <Dropdown.Toggle
                        as="span"
                        variant="success"
                        id="dropdown-basic"
                      >
                        {t("language")}
                      </Dropdown.Toggle>

                      <Dropdown.Menu align={"end"}>
                        {langOptions.map((lang, idx) => (
                          <Dropdown.Item
                            key={idx}
                            onClick={() => handleChangeLanguage(lang?.lang)}
                          >
                            <Link key={idx} href="/" locale={lang?.lang}>
                              {t(lang.fullName.toLowerCase())}
                            </Link>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <span className="logoutLink ms-3" onClick={handleLogout}>
                      <span>{t("logout")}</span>
                      <em className="icon-logout" />
                    </span>
                  </div>
                </div>
                <div className="emptyPageContent">
                  <h1 className="title">{t("movieListEmpty")}</h1>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/create-movie")}
                  >
                    {t("addMovie")}
                  </Button>
                </div>
              </Container>
            </div>
          </main>
        </>
      ) : !state.isLoading && state.lists.length > 0 ? (
        <main className="py-120">
          <Container>
            <div className="pageHeader d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h1 className="title mb-0">{t("myMovies")}</h1>
                <Link href="/create-movie">
                  <em className="addMovies icon-add-circle"></em>
                </Link>
              </div>
              <div className="d-flex align-items-center ms-auto">
                <Dropdown className="languageDropdown">
                  <Dropdown.Toggle
                    as="span"
                    variant="success"
                    id="dropdown-basic"
                  >
                    {t("language")}
                  </Dropdown.Toggle>

                  <Dropdown.Menu align={"end"}>
                    {langOptions.map((lang, idx) => (
                      <Dropdown.Item
                        key={idx}
                        onClick={() => handleChangeLanguage(lang?.lang)}
                      >
                        <Link key={idx} href="/" locale={lang?.lang}>
                          {t(lang.fullName.toLowerCase())}
                        </Link>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <span className="logoutLink ms-3" onClick={handleLogout}>
                  <span>{t("logout")}</span>
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
                  {t("prev")}
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
                  {t("next")}
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

export default MovieList;
