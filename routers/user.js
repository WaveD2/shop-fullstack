const router = require("express").Router();
const connController = require("../controllers/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
//verifyAccessToken : check đăng nhập
router.post("/register", connController.register);
router.post("/login", connController.login);
router.get("/currentToken", verifyAccessToken, connController.currentToken);
router.post("/refreshAccessToken", connController.refreshAccessToken);
router.get("/logout", connController.logout);

module.exports = router;
