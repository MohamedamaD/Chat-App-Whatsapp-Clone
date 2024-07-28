const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { validateToken } = require("../validations/token.validation");

router.get("/logout", userController.logout);
router.get("/user/protected", validateToken, userController.protected);
router.get("/user/search", validateToken, userController.userSearch);

router.post("/password", userController.login);
router.post("/register", userController.register);
router.post("/email", userController.getUserByEmail);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

router.put("/user/", validateToken, userController.editUserDetails);

module.exports = router;
