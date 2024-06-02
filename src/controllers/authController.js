const refreshToken = require('../database/models/refreshToken');
const AuthService = require('../services/authService');

module.exports = {
  async signup(req, res) {
    try {
      const userData = req.body;
      console.log(req.body);
      const { user, token, refreshToken } = await AuthService.signup(userData);

      res.status(201).send({
        auth: true,
        message: 'User registered successfully!',
        data: {
          id: user.id,
          accessToken: token,
          refreshToken: refreshToken
        }
      });

    } catch (error) {
      res.status(500).send({
        auth: false,
        message: 'Error creating user',
        errors: [error.message],
      });
    }
  },

  async signin(req, res) {
    try {
      const credentials = req.body;
      const { user, token, refreshToken } = await AuthService.signin(credentials);

      res.status(200).send({
        auth: true,
        message: 'Successfully Logged In',
        data: {
          id: user.id,
          accessToken: token,
          refreshToken: refreshToken,
        }
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: 'Error While Logging In',
        errors: [error.message],
      });
    }
  },

  async signout(req, res) {
    try {
      const { token } = req.body;
      await AuthService.signout(token);
      res.status(200).send({
        auth: false,
        message: 'Successfully Logged Out',
      });
    } catch (error) {
      res.status(500).send({
        auth: false,
        message: 'Error While Logging Out',
        errors: [error.message],
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const token = req.body.token;
      const AccessToken = await AuthService.refreshToken(token);
      res.status(200).send({
        auth: true,
        message: 'Successfully Refreshed Token',
        data: {
          accessToken: AccessToken
        }
      });
    } catch (error) {
      res.status(403).send({
        auth: false,
        message: 'Error While Refreshing Token',
        errors: [error.message],
      })
    }
  }
};
