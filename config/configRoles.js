require('dotenv').config()

module.exports = {
    'secret': process.env.JWT_SECRET_ACCESS_TOKEN,
    ROLEs: ['USER', 'ADMIN', 'PM']
};