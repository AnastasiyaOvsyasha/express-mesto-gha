const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  createCard,
);

router.get('/cards', getCards);

router.delete(
  'cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  deleteCard,
);

router.put(
  'cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  likeCard,
);

router.delete(
  'cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().regex(/^[0-9a-f]{24}$/i),
    }),
  }),
  dislikeCard,
);

module.exports = router;
