const fs = require('fs');
const path = require('path');
const db = require('../database/models');
const config = require('../../config/configMulter');


module.exports = {
    async updateProfilePicture(user, profilePicturePath) {
        try {
          if (profilePicturePath) {
            const oldFilePath = path.join(config.uploadDirectory, String(user.profilePicturePath));
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }
    
          // Simpan path foto profil baru
          user.profilePicturePath = profilePicturePath;
          await user.save();
    
          return user;
        } catch (error) {
          throw error;
        }
      },

    async deleteProfilePicture(user) {
        try {
          if (user.profilePicturePath) {
            const oldFilePath = path.join(config.uploadDirectory, String(user.profilePicturePath));
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }
    
          // Simpan path foto profil baru
          user.profilePicturePath = null;
          await user.save();
    
          return user;
        } catch (error) {
          throw error;
        }
      },

    async getUserProfile(userId) {
        return db.User.findByPk(userId, {
            include: [
              { model: db.Role },
              { model: db.Address }
            ]
          })
    },

    async updateUserProfile(user, updatedData) {
       user.update(updatedData);
    },

    async deleteUserProfile(userId) {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.destroy();
    }

};
