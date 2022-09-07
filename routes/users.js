/* eslint-disable import/no-unresolved */
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  getUsers,
  getUserId,
  editUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getUserId,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  editUserProfile,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  updateUserAvatar,
);

module.exports = userRouter;
