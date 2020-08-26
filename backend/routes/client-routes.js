const { Router } = require('express');

const router = Router();
const clientController = require('../controllers/client-controller');
const checkAuth = require('../middleware/check-auth');
router.use(checkAuth);

router.get('/info/:clientId', clientController.index);

router.get('/active/emails', clientController.indexEmails);

router.get('/active/emails/:clientId', clientController.activeEmailAccount);

router.get('/active/users/:clientId', clientController.activeUsers);

router.get('/equipments', clientController.indexEquipments);

router.get('/equipments/:clientId', clientController.getEquipments);

router.get('/assets', clientController.indexAssets);

router.get('/assets/:clientId', clientController.getAsset);

router.get('/licenses', clientController.indexAllLicenses);

router.get('/licenses/:clientId', clientController.getLicenses);

router.post('/users/emails/create', clientController.createEmails);

router.post('/assets', clientController.createAsset);

router.post('/equipments', clientController.createEquipment);

router.post('/licenses', clientController.createLicense);

router.patch('/active/email/:accountId', clientController.editEmailAccount);

router.patch('/assets/:assetId', clientController.editAsset);

router.patch('/equipment/:equipmentId', clientController.editEquipment);

router.patch('/licenses/:licenseId', clientController.editLicense);

router.delete('/assets/:assetId', clientController.deleteAsset);

router.delete('/active/email/:accountId', clientController.deleteEmailAccount);

router.delete('/equipment/:equipmentId', clientController.deleteEquipment);

router.delete('/licenses/:licenseId', clientController.deleteLicense);

module.exports = router;
