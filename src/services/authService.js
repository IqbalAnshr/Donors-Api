const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const db = require('../models/index');
const User = require("../database/models").User;
const Role = require("../database/models").Role;
const config = require("../../config/configRoles");
const { generateTokens, generateTokenAccess } = require("../utils/generateToken");
const refreshSecretKey = process.env.JWT_SECRET_REFRESH_TOKEN;

module.exports = {
  async signup(userData) {
    try {
      // if (userData.role === 'barongsai') {
      //     const role = await Role.findOne({
      //         where: { name: userData.role }
      //       });
      //       if (!role) {
      //         throw new Error('Role not found');
      //       }
      // }else{
      const role = await Role.findOne({
        where: { name: "USER" },
      });
      // }

      const user = await User.create({
        username: userData.username,
        name: userData.name,
        password: bcrypt.hashSync(userData.password, 8),
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        roleId: role.id,
      });

      const { accessToken, refreshToken } = await generateTokens(user);

      await db.RefreshToken.create({ token: refreshToken, userId: user.id });

      return { user, token: accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  async signin(credentials) {
    try {
      const user = await User.findOne({
        where: { email: credentials.email },
        include: Role,
      });

      if (!user) {
        throw new Error("User Not Found");
      }

      const passwordIsValid = bcrypt.compareSync(
        credentials.password,
        user.password
      );
      if (!passwordIsValid) {
        throw new Error("Invalid Password");
      }

      const { accessToken, refreshToken } = await generateTokens(user);

      await db.RefreshToken.create({ token: refreshToken, userId: user.id });

      return { user, token: accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  },

  async signout(refreshToken) {
    try {
      const refreshTokenData = await db.RefreshToken.findOne({
        where: { token: refreshToken },
      });
      if (!refreshTokenData) throw new Error("Invalid token");
      await db.RefreshToken.destroy({ where: { token: refreshToken } });
    } catch (error) {
      throw new Error("Could not signout try again");
    }
  },

  async refreshToken(oldToken) {
    try {
      const decoded = jwt.verify(oldToken, refreshSecretKey);
      const storedToken = await db.RefreshToken.findOne({
        where: { token: oldToken },
      });
      if (!storedToken) throw new Error("Invalid token");

      const newAccessToken = generateTokenAccess(decoded);
      return newAccessToken;
    } catch (error) {
      throw new Error("Could not refresh token");
    }
  },
};
