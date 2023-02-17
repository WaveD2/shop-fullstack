const router = require("express").Router();
const connController = require("../controllers/user");

router.post("/register", connController.register);

module.exports = router;
