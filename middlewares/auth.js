const jwt = require('jsonwebtoken');
const NotAuthError = require('../../react-mesto-api-full/backend/errors/not-auth-err');
const { NOT_AUTH_ERROR } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(NOT_AUTH_ERROR);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuthError(NOT_AUTH_ERROR);
  }

  req.user = payload;

  next();
};
