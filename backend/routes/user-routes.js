const { Router } = require('express');

const router = Router();
const userController = require('../controllers/user-controller');
const checkAuth = require('../middleware/check-auth');

router.post('/login', userController.login);

router.patch('/changepass', userController.changePassword);

router.use(checkAuth);

router.post('/create', userController.create);

router.get('/clients', userController.index);

router.patch('/resetpass/:userId', userController.resetPass);

router.patch('/clients/:userId', userController.update);

router.delete('/clients/:userId', userController.delete);

module.exports = router;
