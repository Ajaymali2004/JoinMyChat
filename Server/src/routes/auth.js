const express = require("express");
const { register, login, verifyToken, forgetPass } = require("../controller/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verification", verifyToken);
router.post("/forget",forgetPass);
module.exports = router;
