const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { AuthorizationError } = require('../errors/AuthorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/g.test(
          v,
        );
      },
      message: 'Ошибка валидации url адреса',
    },
  },
  password: {
    type: String,
    required: [true, 'Данное поле должно быть заполнено'],
    select: false,
  },
  email: {
    type: String,
    required: [true, 'Данное поле должно быть заполнено'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      massages: 'Введите корректный Email',
    },
  },
});

userSchema.statics.findUserByCredentials = function fn(email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthorizationError('Неправильные почта или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }

        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
