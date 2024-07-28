const token = require("../validations/token.validation");
const groupController = require("../controllers/group.controller");
const router = require("express").Router();

router.get(
  "/:groupID/contacts-to-add",
  token.validateToken,
  groupController.getUserContactsToAdd
);

module.exports = router;
