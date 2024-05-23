const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;


module.exports = {
    validateUpdateProfile : [
        body('name')
        .optional()
        .not().isEmpty().withMessage('Name is required'),
        body('username')
        .optional()
        .not().isEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and dashes'),
        body('phoneNumber')
        .optional()
        .not().isEmpty().withMessage('Phone number is required')
        .isMobilePhone('any').withMessage('Invalid phone number format'),
        body('email')
        .optional()
        .not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
        body('password')
        .optional()
        .not().isEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ auth: false, message: "Error", errors: errors.array() });
            }
            next();
        }
    ], 

    checkDuplicateUserName(req, res, next) {
        if (!req.body.username) {
            return next();
        }
        User.findOne({ where: { username: req.body.username } })
            .then(user => {
                if (user) {
                    return res.status(400).send({
                        auth: false,
                        message: "Error",
                        errors: "Username already exists"
                    });
                }
                next();
            })
            .catch(err => {
                res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: err.message
                });
            });
    },

    checkDuplicateEmail(req, res, next) {
        if (!req.body.email) {
            return next();
        }
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    return res.status(400).send({
                        auth: false,
                        message: "Error",
                        errors: "Email already exists"
                    });
                }
                next();
            })
            .catch(err => {
                res.status(500).send({
                    auth: false,
                    message: "Error",
                    errors: err.message
                });
            });
    }
}