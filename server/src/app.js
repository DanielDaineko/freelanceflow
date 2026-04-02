const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FreelanceFlow API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

module.exports = app;
