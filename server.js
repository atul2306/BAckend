require("dotenv").config();
const express = require("express");
const oauth = require("./Routes/oauth")
const blog  = require("./Routes/blog")
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());


// CORS Policy

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/oauth",oauth)
app.use("/api/blog",blog)


// For any unknown API request
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(500).json({ message: error.message || "Something went wrong" });
});

const PORT = process.env.PORT || 8000;


// const CONNECTION_URL = `mongodb+srv://assignment:assignment@cluster0.4sdqfmq.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MongoDB Connected and Connection started at ${PORT}`);
      console.log(`Local -> http://localhost:8000`);
      console.log(`Client Origin -> ${process.env.CLIENT_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });