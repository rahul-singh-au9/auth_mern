const express = require("express");
const cors = require("cors");
require("./db/connection");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 3001;

// Init app
const app = express();

// middlewares
// to communicate between different origins
app.use(cors());

// for post requests
app.use(express.json());

// cookie-parser
app.use(cookieParser());

// file-upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// HOMEPAGE
app.get("/", (req, res) => {
  res.send("HOME");
});

// USER ROUTES
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/imageRouter"));


// ROUTES THAT NOT BEEN DEFINED
app.get("*", (req, res) => {
  res.send("You've tried reaching a route that doesn't exist.");
});

// PRODUCTION MODE
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// CONNECTING TO THE SERVER
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
