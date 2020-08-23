const { Router } = require('express');

const router = Router();
const clientController = require('../controllers/client-controller');

router.get('/info/:clientId', clientController.index);

router.get('/active/emails', clientController.indexEmails);

router.get('/active/emails/:clientId', clientController.activeEmailAccount);

router.get('/active/users/:clientId', clientController.activeUsers);

router.get('/equip/:clientId', clientController.equips);

router.get('/assets', clientController.indexAssets);

router.get('/assets/:clientId', clientController.getAssets);

router.post('/users/emails/create', clientController.createEmails);

router.post('/assets', clientController.createAssets);

router.patch('/active/email/:accountId', clientController.editEmailAccount);

router.patch('/assets/:assetId', clientController.editAsset);

router.delete('/assets/:assetId', clientController.deleteAsset);

router.delete('/active/email/:accountId', clientController.deleteEmailAccount);

module.exports = router;
