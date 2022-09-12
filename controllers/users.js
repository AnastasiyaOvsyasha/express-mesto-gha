const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const AuthorizationError = require('../errors/AuthorizationError');
const ServerError = require('../errors/ServerError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new ErrorNotFound('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt
      .hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new ErrorBadRequest(
          'При создании пользователя переданы некорректные данные',
        ),
      );
    } if (err.code === 11000) {
      return next(new ErrorConflict('Данный email уже зарегестрирован'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.getUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new ErrorNotFound('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBadRequest('При создании пользователя переданы некорректные данные'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.editUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNotFound('Ошибка на сервере'));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(
        new ErrorBadRequest(
          'Переданы некорректные данные при обновлении профиля',
        ),
      );
    } return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new ErrorNotFound('Пользователь не найден'));
    }
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new ErrorBadRequest(
          'При обновлении аватара данные переданы некорректно',
        ),
      );
    } return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, 'secret-key');
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send(user);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};
