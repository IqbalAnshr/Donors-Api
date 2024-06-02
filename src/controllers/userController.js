const userService = require('../services/userService');
const uploadMiddleware = require('../middlewares/uploadImageMulter');

const UserController = {
  getUserProfile: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ status : 'error', message: 'User not found', errors : [] });
      }
      return res.status(200).json({status : 'success', message: 'User profile fetched successfully', user});
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const user = req.user;
      const updatedData = req.body;
      await userService.updateUserProfile(user, updatedData);
      return res.status(200).json({ status : 'success', message: 'User profile updated successfully', data :  { id: user.id, ...updatedData} });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error', errors: [error.message] });
    }
  },

  updateProfilePicture: (req, res) => {
    uploadMiddleware(req, res, async (err) => {
      try {
        if (err) {
          throw new Error('Error uploading image');
        }
        const user = req.user;
        const profilePicturePath = req.file.filename;
        await userService.updateProfilePicture(user, profilePicturePath);
        return res.status(200).json({ status : 'success', message: 'Profile picture updated successfully', data : {id : user.id} });
      } catch (error) {
        console.error('Error updating profile picture:', error);
        return res.status(500).json({status : 'error', message:'Internal server error', errors: [error.message] });
      }
    });
  },

  deleteProfilePicture: async (req, res) => {
    try {
      const user = req.user;
      await userService.deleteProfilePicture(user);
      return res.status(200).json({  status : 'success', message: 'Profile picture deleted successfully' , data : {id : user.id} });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error' , errors: [error.message] });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      await userService.deleteUserProfile(userId);
      return res.status(200).json({status : 'success', message: 'User profile deleted successfully' , data : {id : userId} });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return res.status(500).json({ status : 'error', message: 'Internal server error' , errors: [error.message] });
    }
  }
};

module.exports = UserController;
