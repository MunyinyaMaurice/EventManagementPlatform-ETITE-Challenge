# Event Booking System API
This repository contains the backend API for an Event Booking System. The API allows users to create events, manage bookings, and perform user authentication.

# Technologies Used
> Node.js

> Express.js

> MongoDB (with Mongoose ODM)

> JWT (JSON Web Tokens) for authentication

> Multer for handling file uploads

> bcrypt for password hashing

> asyncHandler for handling asynchronous functions

# Project Structure

## The project is structured into the following main components:

> Models: Defines the database schemas using Mongoose for User, Event, Booking, Category, and Image.

> Controllers: Contains the route handlers (controllers) for different API endpoints related to users, events, bookings, categories, and images.

> Routes: Defines the API endpoints and links them to corresponding controller functions.

> Middleware: Includes custom middleware like asyncHandler for handling asynchronous functions and checkRole for role-based authorization.

> Config: Contains database connection configuration using dotenv for environment variables.

> Middleware: Error handling middleware (errorHandler) to centralize error handling and improve code readability.

# Installation
## To run this project locally, follow these steps:

## Clone the repository:
> git clone https://github.com/MunyinyaMaurice/EventManagementPlatform-ETITE-Challenge.git new-directory

> Navigate to the project directory:

> cd new-directory
## Install dependencies:

> npm install

> Set up environment variables:Create a .env file in the root directory and define the following variables:

> PORT=5000

> MONGODB_URI=<your_mongodb_uri>

> ACCESS_TOKEN_SECRET=<your_access_token_secret>
## Start the server:

> npm run dev

> Access the API:Once the server is running, you can access the API endpoints using tools like Postman or curl.

# API Endpoints

> POST /api/users/register: Register a new user.

> POST /api/users/login: Authenticate and log in a user.

> GET /api/users/current: Get current user information.

> GET /api/users: Get all users' information (accessible to admin only).

> PUT /api/users/:id: Update user information (accessible to authenticated users).

> GET /api/events: Get all events.

> POST /api/events: Create a new event.

> GET /api/events/:id: Get details of a specific event.

> PUT /api/events/:id: Update details of a specific event.

> DELETE /api/events/:id: Delete a specific event and associated images.

> POST /api/images/:id: Upload an image for a specific event.

> DELETE /api/images/:id: Delete an image associated with a specific event.

> GET /api/categories: Get all event categories.

> POST /api/categories: Create a new event category.

> GET /api/categories/:id: Get details of a specific event category.

> PUT /api/categories/:id: Update details of a specific event category.

> DELETE /api/categories/:id: Delete a specific event category.
