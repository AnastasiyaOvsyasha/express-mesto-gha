const userRouter = require('express').Router();

const {
  createUser, getUsers, getUserId, editUserProfile, updateUserAvatar,
} = require('../controllers/users');

const { updateProfileValidation, userIdValidation, userAvatarValidation } = require('../middlewares/celebrate');

userRouter.post('/', createUser);
userRouter.get('/', getUsers);
userRouter.get('/:userId', userIdValidation, getUserId);
userRouter.patch('/me', updateProfileValidation, editUserProfile);
userRouter.patch('/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = userRouter;
