// app.js — входной файл
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { ErrorNotFound } = require('./errors/constants/ErrorNotFound');
const { errorHandler } = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('/*', (req, res, next) => next(new ErrorNotFound('Страница не найдена')));
app.post('/signin', login);
app.post('/signup', createUser);

app.use(errors());

app.use(auth);

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
