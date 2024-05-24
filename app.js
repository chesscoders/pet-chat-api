require("express-async-errors");
const express = require("express");
const helmet = require("helmet");
const { setupCors } = require("express-goodies");
const fileUpload = require("express-fileupload");
const router = require("./router");
const { whitelist } = require("./site.config");
const app = express();

// Configure express app
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ limit: "500kb", extended: false }));
app.use(helmet());
app.use(fileUpload());

// Custom cors config
app.use(setupCors(whitelist));

// Route everything
app.use("/", router);

module.exports = app;
