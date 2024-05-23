const express = require('express');
const userController = require('../controllers/userController');
const AddressController = require('../controllers/addressController');
const requestController = require('../controllers/requestController');
const donorController = require('../controllers/donorController');

const { validateUpdateProfile, checkDuplicateUserName, checkDuplicateEmail }= require('../middlewares/userMiddleware');
const {validateAddress, validateUpdateAddress, checkUserHasAddres} = require('../middlewares/addressMiddleware');
const { validateRequest } = require('../middlewares/requestMiddleware');
const { validateDonation, validateUpdateDonation } = require('../middlewares/donorMiddleware');


const router = express.Router();


router.get('/', userController.getUserProfile);
router.put('/', [validateUpdateProfile, checkDuplicateUserName, checkDuplicateEmail],  userController.updateUserProfile);
// router.delete('/', userController.deleteUser);
router.put('/profile-picture', userController.updateProfilePicture);
router.delete('/profile-picture', userController.deleteProfilePicture);


router.post('/address',[validateAddress, checkUserHasAddres], AddressController.createAddress);
router.get('/address', AddressController.getAddress);
router.put('/address', validateUpdateAddress, AddressController.updateAddress);
router.delete('/address', AddressController.deleteAddress);

router.post('/request', validateRequest, requestController.createRequest);
router.get('/request/:requestId',  requestController.getUserRequestById);
router.get('/request',  requestController.getUserRequests);
router.put('/request/:requestId',  requestController.updateRequest);
router.delete('/request/:requestId',  requestController.deleteRequest);

router.post('/donor', validateDonation, donorController.createDonor);
router.get('/donor/:donorId',  donorController.getUserDonorById);
router.get('/donor',  donorController.getUserDonors);
router.put('/donor/:donorId',validateUpdateDonation,  donorController.updateDonor);
router.delete('/donor/:donorId',  donorController.deleteDonor);


module.exports = router;
