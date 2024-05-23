const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_ACCESS_TOKEN;
const refreshSecretKey = process.env.JWT_SECRET_REFRESH_TOKEN;


module.exports = { 
  async generateTokens(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user');
    }
    try {
      const accessToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, refreshSecretKey, { expiresIn: '7d' });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Failed to generate tokens');
    }
  },

  async generateTokenAccess(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user');
    }
    try {
      const accessToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '15m' });
      return accessToken ;
    } catch (error) {
      throw new Error('Failed to generate tokens');
    }
  }

 }