const express = require("express");
const router = express.Router();
const signRoutes = require("./auth");
const userRoutes = require("./user");
const postRoutes = require("./post");

const authMiddleware = require("../middlewares/authMiddleware");

router.use("/auth", signRoutes);
router.use("/user", authMiddleware.Authentication , userRoutes);
router.use("/post", postRoutes);

module.exports = router;