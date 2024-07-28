// imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const dbConfig = require("./configuration/db");
const corsConfig = require("./configuration/cors");
const userRoutes = require("./routes/user.route");
const conversationRoutes = require("./routes/conversation.route");
const groupRoutes = require("./routes/group.route");
const { app, server } = require("./web");

// initiations
const port = process.env.PORT || 8080;

// setup configurations
dotenv.config();
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/groups", groupRoutes);

server.listen(port, () => {
  console.log(`app listening on ${port}`);
});
