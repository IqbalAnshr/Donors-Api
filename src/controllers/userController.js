const userService = require('../services/userService');
const uploadMiddleware = require('../middlewares/uploadImageMulter');

const UserController = {
  // Mendapatkan profil pengguna berdasarkan ID
  getUserProfile: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json( user );
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Memperbarui profil pengguna
  updateUserProfile: async (req, res) => {
    try {
      const user = req.user;
      const updatedData = req.body;

      // Perbarui data pengguna
      await userService.updateUserProfile(user, updatedData);

      return res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Memperbarui foto profil pengguna
  updateProfilePicture:  (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        try {
            const user = req.user;
            const profilePicturePath = req.file.filename;
    
            await userService.updateProfilePicture(user, profilePicturePath);
    
            return res.status(200).json({ message: 'Profile picture updated successfully' });
          } catch (error) {
            console.error('Error updating profile picture:', error);
            return res.status(500).json({ message: 'Internal server error' });
          }
    })
  },

  deleteProfilePicture: async (req, res,) => {
    try {
        const user = req.user;

        await userService.deleteProfilePicture(user);

        return res.status(200).json({ message: 'Profile picture deleted successfully' });
      } catch (error) {
        console.error('Error deleting profile picture:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  },

  // Menghapus profil pengguna
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      // Hapus pengguna
      await userService.deleteUserProfile(userId);

      return res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = UserController;
