const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { AuthorizationError } = require('../errors/AuthorisationError');

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
    message: 'Введите корректный Email',
  },
});

userSchema.methods.toJSON = function fn() {
  const user = this.toObject();
  return {
    _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
  };
};

userSchema.statics.findUserByCredentials = function fn(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthorizationError('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

const avatarValidator = function fn(value) {
  const regex = /^https*:\/\/(www.)*[0-9a-zа-я.\-_~:/?[\]@!$&'()*+,;=]{1,}(#*$)/gi;
  return regex.test(value);
};

userSchema.path('avatar').validate(avatarValidator, 'error');

module.exports = mongoose.model('user', userSchema);
