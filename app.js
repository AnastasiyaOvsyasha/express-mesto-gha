// app.js — входной файл

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...

app.listen(3000);