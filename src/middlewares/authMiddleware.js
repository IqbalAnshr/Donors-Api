const jwt = require("jsonwebtoken");
const config = require("../../config/configRoles");
const User = require("../database/models").User;
const { body, validationResult } = require("express-validator");
const ROLEs = config.ROLEs;

module.exports = {
    validateUser: [
        body("username")
            .isString()
            .withMessage("Username must be a string")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long")
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage(
                "Username can only contain letters, numbers, underscores, and dashes"
            )
            .notEmpty()
            .withMessage("Username is required"),
        body("name")
            .isString()
            .withMessage("Name must be a string")
            .notEmpty()
            .withMessage("Name is required"),
        body("email")
            .isEmail()
            .withMessage("Email is invalid")
            .notEmpty()
            .withMessage("Email is required"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .matches(/\d/)
            .withMessage("Password must contain at least one number")
            .matches(/[A-Z]/)
            .withMessage("Password must contain at least one uppercase letter"),
        body("phoneNumber")
            .isString()
            .notEmpty()
            .withMessage("Phone number is required"),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ auth: false, message: "Error", errors: errors.array() });
            }
            next();
        },
    ],

    // Validasi login menggunakan express-validator
    validateLogin: [
        body("email")
            .isEmail()
            .withMessage("Email is invalid")
            .notEmpty()
            .withMessage("Email is required"),
        body("password").notEmpty().withMessage("Password is required"),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ auth: false, message: "Error", errors: errors.array() });
            }
            next();
        },
    ],

    checkDuplicateUserNameOrEmail(req, res, next) {
        User.findOne({
            where: {
                email: req.body.email,
            },
        })
            .then((userWithEmail) => {
                if (userWithEmail) {
                    return res.status(400).send({
                        auth: false,
                        id: req.body.id,
                        message: "Error",
                        errors: "Email is already taken!",
                    });
                } else {
                    User.findOne({
                        where: {
                            username: req.body.username,
                        },
                    })
                        .then((userWithUsername) => {
                            if (userWithUsername) {
                                return res.status(400).send({
                                    auth: false,
                                    id: req.body.id,
                                    message: "Error",
                                    errors: "Username is already taken!",
                                });
                            } else {
                                // Lanjut ke langkah berikutnya setelah memastikan username unik
                                next();
                            }
                        })
                        .catch((error) => {
                            // Tangani kesalahan pencarian pengguna dengan username
                            console.error("Error searching for user by username:", error);
                            return res.status(500).send({
                                auth: false,
                                id: req.body.id,
                                message: "Error",
                                errors: "Internal server error",
                            });
                        });
                }
            })
            .catch((error) => {
                // Tangani kesalahan pencarian pengguna dengan email
                console.error("Error searching for user by email:", error);
                return res.status(500).send({
                    auth: false,
                    id: req.body.id,
                    message: "Error",
                    errors: "Internal server error",
                });
            });
    },

    // Middleware untuk cek role yang ada
    checkRolesExisted(req, res, next) {
        const role = req.body.role.toUpperCase();
        if (!ROLEs.includes(role)) {
            return res.status(400).send({
                auth: false,
                id: req.body.id,
                message: "Error",
                errors: "Invalid Role: " + role,
            });
        }
        next();
    },

    // Middleware untuk autentikasi
    Authentication: async (req, res, next) => {
        let tokenHeader = req.headers["x-access-token"];
        
        if (!tokenHeader) {
            return res.status(403).send({
                auth: false,
                message: "Error",
                errors: "No token provided",
            });
        }

        if (!tokenHeader.startsWith("Bearer ")) {
            return res.status(500).send({
                auth: false,
                message: "Error",
                errors: "Incorrect token format",
            });
        }

        let token = tokenHeader.split(" ")[1];

        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: err,
                });
            }

            try {
                const user = await User.findByPk(decoded.id);
                if (!user) {
                    return res
                        .status(404)
                        .send({ auth: false, message: "User not found" });
                }
                req.user = user; 
                next();
            } catch (error) {
                return res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: error,
                });
            }
        });
    },

    // Middleware untuk cek peran admin
    isAdmin(req, res, next) {
        User.findByPk(req.userid, { include: "Roles" })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({
                        auth: false,
                        message: "Error",
                        errors: "User not found",
                    });
                }
                const roles = user.Roles.map((role) => role.name.toUpperCase());
                if (roles.includes("ADMIN")) {
                    next();
                } else {
                    res.status(403).send({
                        auth: false,
                        message: "Error",
                        errors: "Require Admin Role",
                    });
                }
            })
            .catch((err) => {
                res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: err.message,
                });
            }
        );
    },
};
