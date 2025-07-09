const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

database();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

app.get("/", (req, res) => {
  res.send("Knowledge Base API running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
