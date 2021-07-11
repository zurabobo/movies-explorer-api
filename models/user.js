const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { NOT_AUTH_ERROR_EMAIL_PASSWORD } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
    minlength: [8, 'В поле "password" должно быть не менее 8 символов'],
  },
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'В поле "name" должно быть не менее 2 символов'],
    maxlength: [30, 'В поле "name" должно быть не более 30 символов'],
  },

});

userSchema.statics.findUserByCredentials = function Credential(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(NOT_AUTH_ERROR_EMAIL_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(NOT_AUTH_ERROR_EMAIL_PASSWORD));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
