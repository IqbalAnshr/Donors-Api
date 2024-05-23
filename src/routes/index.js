const express = require("express");
const router = express.Router();
const signRoutes = require("./auth");
const userRoutes = require("./user");
const postRoutes = require("./post");

const authMiddleware = require("../middlewares/authMiddleware");


router.route("/").get((req, res) => {
  res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

router.use("/auth", signRoutes);
router.use("/user", authMiddleware.Authentication , userRoutes);
router.use("/post", postRoutes);


module.exports = router;