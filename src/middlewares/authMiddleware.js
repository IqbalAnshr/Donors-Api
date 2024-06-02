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
            .isLength({ min: 5 })
            .withMessage("Username must be at least 5 characters long")
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
                    .json({ auth: false, message: "Error Validation", errors: errors.array() });
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
                    .json({ auth: false, message: "Error Validation", errors: errors.array() });
            }
            next();
        },
    ],

    async checkDuplicateUserNameOrEmail(req, res, next) {
        try {
            const { email, username } = req.body;

            const userWithEmail = await User.findOne({ where: { email } });
            if (userWithEmail) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Email is already taken!',
                    errors: [],
                });
            }

            const userWithUsername = await User.findOne({ where: { username } });
            if (userWithUsername) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Username is already taken!',
                    errors: [],
                });
            }

            next();
        } catch (error) {
            console.error('Error checking duplicate username or email:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                errors: [error.message],
            });
        }
    },

    // Middleware untuk cek role yang ada
    async checkRolesExisted(req, res, next) {
        try {
            const role = req.body.role.toUpperCase();
            if (!ROLEs.includes(role)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid Role: ${role}`,
                    errors: [],
                });
            }
            next();
        } catch (error) {
            console.error('Error in checkRolesExisted:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                errors: [error.message],
            });
        }
    },

    async Authentication(req, res, next) {
        try {
            const tokenHeader = req.headers['x-access-token'];
            if (!tokenHeader) {
                return res.status(403).json({
                    status: 'error',
                    message: 'No token provided',
                    errors: [],
                });
            }

            if (!tokenHeader.startsWith('Bearer ')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Incorrect token format',
                    errors: [],
                });
            }

            const token = tokenHeader.split(' ')[1];

            jwt.verify(token, config.secret, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Unauthorized',
                        errors: [err.message],
                    });
                }

                const user = await User.findByPk(decoded.id);
                if (!user) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'User not found',
                        errors: [],
                    });
                }

                req.user = user;
                next();
            });
        } catch (error) {
            console.error('Error in Authentication:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                errors: [error.message],
            });
        }
    },

    async isAdmin(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, { include: 'Roles' });
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found',
                    errors: [],
                });
            }

            const roles = user.Roles.map(role => role.name.toUpperCase());
            if (roles.includes('ADMIN')) {
                next();
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Require Admin Role',
                    errors: [],
                });
            }
        } catch (error) {
            console.error('Error in isAdmin:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                errors: [error.message],
            });
        }
    },
};
