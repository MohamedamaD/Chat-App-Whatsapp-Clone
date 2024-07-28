const token = require("../validations/token.validation");
const conversationController = require("../controllers/conversation.controller");
const router = require("express").Router();

router.get(
  "/contacts",
  token.validateToken,
  conversationController.getUserContacts
);

module.exports = router;
