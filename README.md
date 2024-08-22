## Movie List Web App

### Overview

This project is a web application built using Next.js, and MySQL. The application allows users to manage a movie database by adding, editing, and listing movies. It includes user authentication with NextAuth, pagination for movie listings, and a responsive design.

### Features

- **User Authentication**: Sign in with credentials using NextAuth.
- **Movie Management**: Add, edit, and list movies with fields for title, publishing year, and poster image.
- **Pagination**: Paginated movie listings.
- **Responsive Design**: Optimized for various screen sizes.
- **API Documentation**: RESTful API for interacting with movies.

### Getting Started

#### Prerequisites

- Node.js (>= 18.x)
- MySQL (>= 8.x)

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Codiantsoftware/movie-list.git
   cd movie-list

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Create a .env file in the root of the project and configure the following environment variables:

   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=
   MYSQL_DATABASE=moviesdb

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   JWT_SECRET=your-jwt-secret
   NEXT_PUBLIC_REMEMBER_SECRET="MoViEs_Secret"

4. Create the database using phpMyAdmin, update the connection details in .env, and seed the database with initial data:

   npm run seed

5. Run the development server:

   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.
