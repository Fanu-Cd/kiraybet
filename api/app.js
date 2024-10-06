const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const socketHandler = require("./services/socket");
socketHandler(io);

const mongodb_url = process.env.MONGODB_URL;
mongoose
  .connect(mongodb_url, {})
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const commonRouter = require("./routes/common");
const rentHouseRouter = require("./routes/rentHouse");
const chatInstanceRouter = require("./routes/chat-instance");
const chatMessageRouter = require("./routes/chat-message");
const savedHouseRouter = require("./routes/saved-house");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/common", commonRouter);
app.use("/auth", authRouter);
app.use("/rent-house", rentHouseRouter);
app.use("/chat-instance", chatInstanceRouter);
app.use("/chat-message", chatMessageRouter);
app.use("/saved-house", savedHouseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

io.listen(4000);

module.exports = app;
