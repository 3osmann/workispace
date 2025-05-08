
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Database connection (no need to call connect separately)
require("./config/db");
if (process.env.NODE_ENV === "development") {
  require("./database/init");
}

// Set up CORS middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rest of your app.js remains the same
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax',
    },
  })
);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve uploaded files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const placeRoutes = require("./routes/placeRoutes");
app.use("/api/places", placeRoutes);
const propertyRoutes = require("./routes/propertyRoutes");
app.use("/api/properties", propertyRoutes);

// Documentation route
app.get("/documentation", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Add error handling middleware last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
