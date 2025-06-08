# Event Scheduler - SPACEAI MERN Stack Developer Assignment

This is a full-stack event scheduler application built as a coding assignment for the MERN Stack Developer role at SPACEAI. The application allows users to create, view, update, delete, and filter events through a modern and responsive user interface.

## Table of Contents

- [Live Demo & Screenshots](#live-demo--screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)

## Live Demo & Screenshots

**(Optional but Highly Recommended)**
*A live demo link hosted on Vercel (for the frontend) and a service like Render (for the backend) would be very impressive.*

**Live Demo:** [Link to your deployed application]

### Screenshots

**Important:** Replace these placeholders with actual screenshots of your application. This is the fastest way for a reviewer to see your work.

| Event List Page                                       | Create Event Modal                               | Event Detail Page                                     |
| ----------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| ![Event List Page](link-to-your-list-page-screenshot.png) | ![Create Event Modal](link-to-your-form-screenshot.png) | ![Event Detail Page](link-to-your-detail-page-screenshot.png) |

## Features

- **Full CRUD Functionality:** Create, Read, Update, and Delete events.
- **Event Listing:** View all events sorted by their start time.
- **Detailed View:** Click on an event to see all its details on a separate page.
- **Event Creation/Editing:** A user-friendly form with validation for creating and updating events.
- **Date/Time Picker:** Intuitive date and time selection using `react-datepicker`.
- **Recurring Events:** Option to mark events as recurring with a simple recurrence rule.
- **Date Range Filtering:** (If implemented) Filter events based on a selected start and end date.
- **Responsive Design:** The UI is built with Tailwind CSS and is fully responsive for mobile and desktop views.
- **Real-time UI Updates:** The event list automatically updates after creating, updating, or deleting an event without a page reload, thanks to Apollo Client's cache management.

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **API:** GraphQL with Apollo Server
- **Database:** MongoDB (using the official `mongodb` Node.js driver)
- **Environment Variables:** `dotenv`

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **GraphQL Client:** Apollo Client
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form
- **UI Components:** `react-datepicker` for date/time selection

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A MongoDB Atlas account for the database connection string.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following variables. See the [Environment Variables](#environment-variables) section for more details.
    ```
    MONGODB_URI=your_mongodb_connection_string
    PORT=4000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The backend server will be running at `http://localhost:4000/graphql`.

### Frontend Setup

1.  **Navigate to the frontend directory from the root:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be running at `http://localhost:3000`.

## Environment Variables

To run this project, you need to create a `.env` file in the `backend` directory. **Do not commit this file to Git.**

```env
# backend/.env

# Your MongoDB Atlas connection string.
# Replace <password> with your database user's password.
# It's recommended to specify the database name in the URI.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster_url/eventScheduler?retryWrites=true&w=majority

# The port the backend server will run on.
PORT=4000
