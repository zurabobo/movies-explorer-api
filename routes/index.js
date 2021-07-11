const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR_MESSAGE } = require('../utils/constants');

const { login, createUser } = require('../controllers/users');
const { signinValidation, signupValidation } = require('../middlewares/validations');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

router.use('/', auth, moviesRouter);
router.use('/', auth, usersRouter);

router.use(() => {
  throw new NotFoundError(NOT_FOUND_ERROR_MESSAGE);
});

module.exports = router;
