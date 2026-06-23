import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authroutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import userManagementRoutes from "./routes/userManagementRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

import { authenticate } from "./middleware/authmiddleware.js";
import { authLimiter } from "./middleware/rateLimiter.js";

import Permission from "./models/Permission.js";

// ---------------- ENV ----------------

dotenv.config();

// ---------------- ENV VALIDATION ----------------

const required = [
  "MONGO_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID"
];

required.forEach((env) => {

  if (!process.env[env]) {

    throw new Error(`${env} is missing`);

  }

});

// ---------------- APP ----------------

const app = express();

// ---------------- MIDDLEWARES ----------------

app.use(helmet());

app.use(express.json());

app.use(
  cors({

    origin:

      process.env.FRONTEND_URL ||

      "http://localhost:5173",

    credentials: true

  })
);

// ---------------- DATABASE ----------------

mongoose.connect(process.env.MONGO_URI)

.then(() =>

  console.log("MongoDB Connected")

)

.catch((err) =>

  console.log(err)

);

// ---------------- ROUTES ----------------

// Auth routes with rate limiter

app.use(
  "/api/auth",

  authLimiter,

  authRoutes
);

// Protected test route

app.get(
  "/api/protected",

  authenticate,

  (req, res) => {

    res.json({

      message: "Protected route accessed",

      user: req.user

    });

  }
);

// Seed permissions

app.get(

  "/seed-permissions",

  async (req, res) => {

    const perms = [

      "CREATE_USER",

      "DELETE_USER",

      "VIEW_USERS",

      "MANAGE_ROLES"

    ];

    const created = await Permission.insertMany(

      perms.map((p) => ({

        name: p

      }))

    );

    res.json(created);

  }

);

// Main routes

app.use("/api/roles", roleRoutes);

app.use("/api/test", testRoutes);

app.use("/api/users", userManagementRoutes);

app.use("/api/logs", logRoutes);

app.use("/api/blogs", blogRoutes);

// Root route

app.get("/", (req, res) => {

  res.send("API Running");

});

// 404 route

app.use((req, res) => {

  res.status(404).json({

    message: "Route not found"

  });

});

// ---------------- SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>

  console.log(`Server running on ${PORT}`)

);
