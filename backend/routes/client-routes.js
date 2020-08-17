const { Router } = require('express');

const router = Router();
const clientController = require('../controllers/client-controller');

router.get('/info/:clientId', clientController.index);

router.get('/active/accounts/:clientId', clientController.activeAccounts);

router.get('/active/users/:clientId', clientController.activeUsers);

router.get('/equip/:clientId', clientController.equips);

router.get('/assets:clientId', clientController.assets);

module.exports = router;
