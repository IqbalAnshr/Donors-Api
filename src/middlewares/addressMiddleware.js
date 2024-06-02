const { body, validationResult } = require('express-validator');
const User = require('../database/models').User;

module.exports = {
    validateAddress: [
        body('city')
            .not().isEmpty().withMessage('City is required'),
        body('province')
            .not().isEmpty().withMessage('Province is required'),
        body('district')
            .not().isEmpty().withMessage('District is required'),
        body('subdistrict')
            .not().isEmpty().withMessage('Subdistrict is required'),
        body('streetName')
            .not().isEmpty().withMessage('Street name is required'),
        body('postalCode')
            .not().isEmpty().withMessage('Postal code is required')
            .isPostalCode('any').withMessage('Invalid postal code format'),
        body('houseNumber')
            .not().isEmpty().withMessage('House number is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status : 'error', message: "Error Validation", errors: errors.array() });
            }
            next();
        }
    ],

    validateUpdateAddress : [
        body('postalCode')
        .isPostalCode('any').withMessage('Invalid postal code format'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status : 'error' , message: "Error Validation", errors: errors.array() });
            }
            next();
        }
    ],

    // cek apakah user sudah punya alamat id
    checkUserHasAddres (req, res, next) {
        if (req.user.addressId) {
            return res.status(400).json({ status : 'error', message: "User already has an address", errors: [] });
        }
        next();
    }

}