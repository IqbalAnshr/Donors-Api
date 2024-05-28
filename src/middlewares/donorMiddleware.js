const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;

module.exports = {
    validateDonation: [
        body('organType')
            .not().isEmpty().withMessage('Organ type is required'),
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

    validateUpdateDonation: [
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