import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authroutes.js"; // extension required
import { authenticate } from "./middleware/authmiddleware.js"; // extension required
import Permission from "./models/Permission.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import userManagementRoutes from "./routes/userManagementRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// FIXED (you missed "/")
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/seed-permissions", async (req, res) => {
  const perms = [
    "CREATE_USER",
    "DELETE_USER",
    "VIEW_USERS",
    "MANAGE_ROLES"
  ];

  const created = await Permission.insertMany(
    perms.map(p => ({ name: p }))
  );

  res.json(created);
});

app.use("/api/roles", roleRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));