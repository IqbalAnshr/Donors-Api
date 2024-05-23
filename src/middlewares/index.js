const authMiddleware = require('./authMiddleware');
const addressMiddleware = require('./addressMiddleware');
const userMiddleware = require('./userMiddleware');
const requestMiddleware = require('./requestMiddleware');
const donorMiddleware = require('./donorMiddleware');


module.exports = {
    authMiddleware,
    addressMiddleware,
    userMiddleware,
    requestMiddleware,
    donorMiddleware
};