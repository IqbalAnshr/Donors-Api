const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;
const db = require('../database/models');
const { where } = require('sequelize');

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

    checkUserHasRequestId: async (req, res, next) => {
        try {
            const userRequest = await db.Request.findOne({ where: { id: req.params.requestId }, attributes: ['userId'] });

            if (!userRequest || userRequest.userId !== req.user.id) {
                return res.status(400).json({ status: 'error', message: 'User does not have this request', errors: [] });
            }

            next();
        } catch (error) {
            console.error('Error in checkUserRequestId:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error', errors: [error.message] });
        }
    }
}