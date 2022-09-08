const Card = require('../models/cards');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const ErrorServer = require('../errors/ErrorServer');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => next(new ErrorServer('Произошла ошибка')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new ErrorBadRequest(
            'При создании карточки данные переданы некорректно',
          ),
        );
      }
      return next(new ErrorServer('Произошла ошибка'));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Данную карточку удалить невозможно');
      } else {
        return Card.findByIdAndDelete(req.params.cardId).then(() => {
          res.send(card);
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorBadRequest('Данные переданы некорректно'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorBadRequest('Данные переданы некорректно'));
      }
      return next(new ErrorServer('Произошла ошибка'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        throw new ErrorNotFound('Карточка не найдена');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorBadRequest('Данные переданы некорректно'));
      }
      return next(new ErrorServer('Произошла ошибка'));
    });
};
