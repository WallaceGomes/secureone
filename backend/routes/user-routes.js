const { Router } = require('express');

const router = Router();
const userController = require('../controllers/user-controller');

router.post('/create', userController.create);

router.post('/login', userController.login);

router.get('/clients', userController.index);

router.patch('/changepass', userController.changePassword);

router.patch('/clients/:userId', userController.update);

router.delete('/clients/:userId', userController.delete);

module.exports = router;
