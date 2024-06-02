const express = require('express');
const userController = require('../controllers/userController');
const AddressController = require('../controllers/addressController');
const requestController = require('../controllers/requestController');
const donorController = require('../controllers/donorController');

const { validateUpdateProfile, checkDuplicateUserName, checkDuplicateEmail }= require('../middlewares/userMiddleware');
const {validateAddress, validateUpdateAddress, checkUserHasAddres} = require('../middlewares/addressMiddleware');
const { validateRequest, checkUserHasRequestId } = require('../middlewares/requestMiddleware');
const { validateDonation, validateUpdateDonation, checkUserHasIdDonor } = require('../middlewares/donorMiddleware');


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
router.get('/request/:requestId', checkUserHasRequestId, requestController.getUserRequestById);
router.get('/request',  requestController.getUserRequests);
router.put('/request/:requestId', checkUserHasRequestId, requestController.updateRequest);
router.delete('/request/:requestId',checkUserHasRequestId,  requestController.deleteRequest);

router.post('/donor', validateDonation, donorController.createDonor);
router.get('/donor/:donorId', checkUserHasIdDonor, donorController.getUserDonorById);
router.get('/donor',  donorController.getUserDonors);
router.put('/donor/:donorId',[validateUpdateDonation, checkUserHasIdDonor],donorController.updateDonor);
router.delete('/donor/:donorId', checkUserHasIdDonor ,donorController.deleteDonor);


module.exports = router;
