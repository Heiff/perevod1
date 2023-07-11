const { Router } = require('express');
const router = Router()
const { Register,Login } = require('../controller/Auth.controller');
const { addCard, getStore, Pay } = require('../controller/Controller');

router.post('/register',Register);
router.post('/login',Login)
router.post('/cards',addCard)
router.get('/store',getStore)
router.post('/pay',Pay)
module.exports = router