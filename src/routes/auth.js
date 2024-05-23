const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');


const router = express.Router();

// Route untuk halaman beranda
router.get('/', (req, res) => {
    res.send(`<h2>Hello from ${req.baseUrl}</h2>`);
});

router.post('/signup', [authMiddleware.validateUser, authMiddleware.checkDuplicateUserNameOrEmail], authController.signup);

router.post('/signin', authMiddleware.validateLogin ,authController.signin);

router.post('/signout', authMiddleware.Authentication, authController.signout);

router.post('/refresh-token', authController.refreshToken);

module.exports = router;
