const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  createCardsPostValidation,
  deleteCardsValidation,
  likeCardsValidation,
  dislikeCardsValidation,
} = require('../middlewares/celebrate');

router.post('/', createCardsPostValidation, createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCardsValidation, deleteCard);
router.put('/:cardId/likes', likeCardsValidation, likeCard);
router.delete('/:cardId/likes', dislikeCardsValidation, dislikeCard);

module.exports = router;
