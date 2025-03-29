# Survey Application

This is a full-stack survey application that allows users to create, vote, bookmark, and manage polls. The application is built using **Node.js**, **Express**, **MongoDB** for the backend, and **React**, **Vite**, and **TailwindCSS** for the frontend.

---

## Features

- User authentication (register, login, logout)
- Create polls with different types:
  - Yes/No
  - Single Choice
  - Rating
  - Image-based
  - Open-ended
- Vote on polls
- Bookmark polls
- View polls created by the user
- View polls voted by the user
- Responsive design with TailwindCSS

---

## Folder Structure

### Backend (`/backend`)

```
backend/
├── .env                 # Environment variables (e.g., database URL, JWT secret)
├── package.json         # Backend dependencies and scripts
├── server.js            # Entry point for the backend server
├── config/              # Configuration files
│   └── db.js            # MongoDB connection setup
├── controller/          # Controllers for handling business logic
│   ├── authController.js  # User authentication logic
│   └── pollController.js  # Poll-related logic
├── middleware/          # Middleware for request handling
│   ├── authMiddleware.js  # Protect routes with JWT authentication
│   └── uploadMiddleware.js  # Handle file uploads
├── models/              # Mongoose models for MongoDB
│   ├── user.js          # User schema
│   └── poll.js          # Poll schema
├── routes/              # API routes
│   ├── authRoutes.js    # Routes for authentication
│   └── pollRoutes.js    # Routes for poll management
└── uploads/             # Uploaded files (e.g., poll images)
```

### Frontend (`/frontend`)

```
frontend/
├── public/               # Static assets
│   └── vite.svg          # Vite logo
├── src/                  # Source code
│   ├── App.css           # Global styles
│   ├── App.jsx           # Main React component
│   ├── index.css         # TailwindCSS setup
│   ├── main.jsx          # Entry point for the React app
│   ├── assets/           # Images and other assets
│   ├── components/       # Reusable UI components
│   │   └── layout/       # Layout components (e.g., Navbar, Sidebar)
│   ├── context/          # React context for global state management
│   ├── pages/            # Page components for different routes
│   │   ├── Auth/         # Authentication pages (Login, Signup)
│   │   └── Dashboard/    # Dashboard pages (Home, My Polls, etc.)
│   └── utils/            # Utility functions (e.g., Axios instances, API paths)
├── package.json         # Frontend dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # TailwindCSS configuration
├── vite.config.js       # Vite configuration
└── index.html           # HTML template for the React app
```

---

## Installation

### Prerequisites

- **Node.js** (v16 or later)
- **MongoDB**

### Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   MONGO_URL=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PORT=8000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Usage

1. Open the frontend in your browser at [http://localhost:5173](http://localhost:5173).
2. Register a new user or log in with an existing account.
3. Create, vote, and manage polls.

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Multer for file uploads

### Frontend
- React
- Vite
- TailwindCSS
- Axios for API requests
- React Router for navigation

---

## License

This project is licensed under the **MIT License**.
