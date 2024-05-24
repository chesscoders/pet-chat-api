const { Chat } = require("../controllers");

const express = require("express");
const router = express.Router();

router.post("/chat", Chat.chat);

module.exports = router;
