const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadReqError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotAuthError = require('../errors/not-auth-err');
const {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  NOT_FOUND_USER_MESSAGE,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(BAD_REQUEST_ERROR);
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(CONFLICT_ERROR);
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const userId = req.urer._id;

  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadReqError(BAD_REQUEST_ERROR);
      }
      if (err.message === 'NotValidId') {
        throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(BAD_REQUEST_ERROR);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};
