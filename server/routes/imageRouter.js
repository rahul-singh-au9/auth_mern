const router = require("express").Router();
const imageMiddleware = require("../middlewares/imageMiddleware");
const imageController = require("../controllers/imageController");
const auth = require("../middlewares/authMiddleware");

router.post(
  "/upload_avatar",
  imageMiddleware,
  auth,
  imageController.uploadAvatar
);

module.exports = router;
