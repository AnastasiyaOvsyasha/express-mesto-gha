// app.js — входной файл
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(errors());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
