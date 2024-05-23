const refreshToken = require('../database/models/refreshToken');
const AuthService = require('../services/authService');

module.exports = {
  async signup(req, res) {
    try {
      const userData = req.body;
      console.log(req.body);
      const { user, token, refreshToken } = await AuthService.signup(userData);

      res.status(200).send({
        auth: true,
        id: user.id,
        accessToken: token,
        refreshToken: null,
        message: 'User registered successfully!',
        errors: null,
      });

    } catch (error) {
      res.status(500).send({
        auth: false,
        id: req.body.id,
        message: 'Error creating user',
        errors: error.message
      });
    }
  },

  async signin(req, res) {
    try {
      const credentials = req.body;
      const { user, token, refreshToken } = await AuthService.signin(credentials);

      res.status(200).send({
        auth: true,
        id: user.id,
        accessToken: token,
        refreshToken: refreshToken,
        message: 'Success',
        errors: null
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        id: req.body.id,
        accessToken: null,
        message: 'Error',
        errors: error.message
      });
    }
  },

  async signout(req, res) {
    try {
      const { token } = req.body;
      await AuthService.signout(token);
      res.status(200).send({
        auth: false,
        id: req.body.id,
        accessToken: null,
        refreshToken: null,
        message: 'Success',
        errors: null
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        id: req.body.id,
        accessToken: null,
        refreshToken: null,
        message: 'Error',
        errors: error.message 
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const  token  = req.body.token;
      const AccessToken = await AuthService.refreshToken(token);
      res.json({ AccessToken });
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  }
};
