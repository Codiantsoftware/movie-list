import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

function ApiDoc({ spec }) {
  const { pathname } = useRouter();
  useEffect(() => {
    if (pathname === "/api-doc") {
      document.body.classList.add("apidoc");
    } else {
      document.body.classList.remove("apidoc"); // Optional: remove the class if not on /api-doc
    }
  }, [pathname]); // Dependency array to run the effect whenever pathname changes

  return <SwaggerUI spec={spec} />;
}

export async function getStaticProps() {
  const spec = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
        description: "API documentation for the Next.js application",
      },
      servers: [
        {
          url: `${process.env.SWAGER_URL}/api`,
          description: "Development server",
        },
      ],
      paths: {
        "/movies": {
          get: {
            summary: "Retrieve a list of movies with pagination",
            parameters: [
              {
                name: "limit",
                in: "query",
                required: false,
                schema: {
                  type: "integer",
                  default: 10,
                  description: "Number of movies to return per page",
                },
              },
              {
                name: "offset",
                in: "query",
                required: false,
                schema: {
                  type: "integer",
                  default: 0,
                  description:
                    "Number of movies to skip before starting to collect the result set",
                },
              },
            ],
            responses: {
              200: {
                description: "A paginated list of movies",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        total: {
                          type: "integer",
                          description: "Total number of movies available",
                        },
                        movies: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Movie",
                          },
                        },
                      },
                      required: ["total", "movies"],
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Create a new movie with a poster",
            description:
              "Creates a new movie record with an optional poster file upload.",
            requestBody: {
              required: true,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "Title of the movie",
                      },
                      year: {
                        type: "integer",
                        description: "Release year of the movie",
                      },
                      poster: {
                        type: "string",
                        format: "binary",
                        description: "Poster image of the movie",
                      },
                    },
                    required: ["title", "year"],
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Movie created successfully",
              },
              400: {
                description: "Invalid input",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/movies/{id}": {
          get: {
            summary: "Retrieve a specific movie",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
              },
            ],
            responses: {
              200: {
                description: "Movie details",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Movie",
                    },
                  },
                },
              },
            },
          },
          put: {
            summary: "Update a specific movie with an optional poster file",
            description:
              "Updates an existing movie record. You can also upload a new poster image.",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
              },
            ],
            requestBody: {
              required: false,
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      year: { type: "integer" },
                      poster: {
                        type: "string",
                        format: "binary",
                        description: "Poster image of the movie",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Movie updated successfully",
              },
              400: {
                description: "Invalid input",
              },
              404: {
                description: "Movie not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete a specific movie",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "integer",
                },
              },
            ],
            responses: {
              204: {
                description: "Movie deleted successfully",
              },
              404: {
                description: "Movie not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/auth/login": {
          post: {
            summary: "User sign-in",
            description:
              'Authenticates a user and returns a JWT token. Stores user credentials in local storage if "Remember me" is checked.',
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: {
                        type: "string",
                        format: "email",
                        example: "user@example.com",
                      },
                      password: {
                        type: "string",
                        format: "password",
                        example: "password123",
                      },
                    },
                    required: ["email", "password"],
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Successful sign-in",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: {
                          type: "boolean",
                        },
                        token: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Invalid request or credentials",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: {
                          type: "boolean",
                        },
                        message: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Server error",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: {
                          type: "boolean",
                        },
                        message: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Movie: {
            type: "object",
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              year: { type: "integer" },
              poster: { type: "string", format: "uri" },
            },
          },
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              email: { type: "string", format: "email" },
              password: { type: "string", format: "password" },
            },
            required: ["email", "password"],
          },
        },
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
}

export default ApiDoc;
