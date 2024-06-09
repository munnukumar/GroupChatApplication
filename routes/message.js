const express = require("express");

const messageController = require("../controllers/message");
const authenticate = require("../middlewares/auth");

const router = express.Router();

router.get("/global", messageController.getMessages);

router.post("/global", authenticate, messageController.postMessages);

router.get("/all", authenticate, messageController.getAllMessages);

module.exports = router;