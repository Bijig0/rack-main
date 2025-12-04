require("dotenv").config();
require("./config/database.js").connect();
const express = require("express");
const app = express();
const http = require("http");
var cors = require("cors");
var bodyParser = require("body-parser");
app.use(cors({ origin: "*" }));
const morgan = require("morgan");
const path = require("path");
const router = require("./routes/index.js");
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/image", express.static(path.join(__dirname, "public/image")));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Not Found" });
});

const port = process.env.APP_PORT;
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log("server up and running on PORT :", port);
});