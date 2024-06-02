const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;
const db = require('../database/models');
const { checkUserHasAddres } = require('./addressMiddleware');

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

    async checkUserHasIdDonor(req, res, next) {  
        try {
            const userDonor = await db.Donor.findOne({ where: { id: req.params.donorId }, attributes: ['userId'] });

            if (!userDonor || userDonor.userId !== req.user.id) {
                return res.status(400).json({ status: 'error', message: 'User does not have this Donor', errors: [] });
            }

            next();
        } catch (error) {
            console.error('Error in checkUserDonorId:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
        }
    }
}    