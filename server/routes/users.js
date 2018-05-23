var express = require('express');
var router = express.Router();

const {
  authentication,
  authorization
} = require('../middlewares/auth')

const {
  signup,
  signin,
  fbLogin,
  deleteUser,
  updateUser,
} = require('../controllers/user.controller')

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/fblogin', fbLogin)
router.delete('/:id', authentication, authorization, deleteUser)
router.put('/:id', authentication, authorization, updateUser)

module.exports = router

