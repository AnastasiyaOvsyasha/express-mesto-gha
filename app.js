const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const ErrorNotFound = require('./errors/ErrorNotFound');
const ServerError = require('./errors/ServerError');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
      email: Joi.string().required().email(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/,
      ),
      password: Joi.string().required(),
      email: Joi.string().required().email(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
  });
  next(err);
});

// подключаемся к серверу mongo
async function main(req, res, next) {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    await app.listen(PORT);
  } catch (error) {
    next(new ServerError('Ошибка на сервере'));
  }
}

main();
