const { Router } = require('express');

const router = Router();
const activeUserController = require('../controllers/activeUser-controller');

router.post('/create', activeUserController.create);

router.get('/', activeUserController.index);

router.get('/:clientId', activeUserController.indexOne);

router.patch('/:activeUserId', activeUserController.update);

router.delete('/:activeUserId', activeUserController.delete);

module.exports = router;
