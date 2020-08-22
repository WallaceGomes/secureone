const { Router } = require('express');

const router = Router();
const clientController = require('../controllers/client-controller');

router.get('/info/:clientId', clientController.index);

router.get('/active/emails/:clientId', clientController.activeEmailAccount);

router.get('/active/users/:clientId', clientController.activeUsers);

router.get('/equip/:clientId', clientController.equips);

router.get('/assets/:clientId', clientController.getAssets);

router.post('/users/emails/create', clientController.createEmails);

router.post('/assets', clientController.createAssets);

module.exports = router;
