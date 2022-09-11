const Card = require('../models/cards');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const ServerError = require('../errors/ServerError');

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.status(200).send(card);
  } catch (err) {
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  try {
    const card = await Card.create({ name, link, owner });
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new ErrorBadRequest('При создании карточки данные переданы некорректно'),
      );
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return next(new ErrorNotFound('Карточка не найдена'));
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Данную карточку удалить невозможно'));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorBadRequest('Некорректные данные запроса'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new ErrorNotFound('Карточка не найдена'));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Данные переданы некорректно'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new ErrorNotFound('Карточка не найдена'));
    }
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new ErrorBadRequest('Данные переданы некорректно'));
    }
    return next(new ServerError('Ошибка на сервере'));
  }
};
