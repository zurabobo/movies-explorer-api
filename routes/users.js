const router = require('express').Router();
const { idValidation, updateUserValidation } = require('../middlewares/validations');

const {
  getUser, updateUser,
} = require('../controllers/users');

router.get('/users/me', idValidation, getUser);

router.patch('/users/me', updateUserValidation, updateUser);

module.exports = router;
