const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;

module.exports = {
    validateRequest: [
        body('city')
            .not().isEmpty().withMessage('City is required'),
        body('hospital')
            .not().isEmpty().withMessage('Hospital is required'),
        body('organType')
            .not().isEmpty().withMessage('Organ type is required'),
        body('phoneNumber')
            .not().isEmpty().withMessage('Phone number is required')
            .isMobilePhone('any').withMessage('Invalid phone number format'),
        body('note')
            .optional()
            .isString().withMessage('Note must be a string'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ auth: false, message: "Error", errors: errors.array() });
            }
            next();
        }
    ],
}