const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.post("/register", userController.register);

router.post("/activation", userController.activateEmail);

router.post("/login", userController.login);

router.post("/refresh_token", userController.getAccessToken);

router.post("/forgot", userController.forgotPassword);

router.post("/reset", auth, userController.resetPassword);

router.get("/infor", auth, userController.getUserInfor);

router.get("/logout", userController.logout);

router.patch("/update", auth, userController.updateUser);


module.exports = router;
