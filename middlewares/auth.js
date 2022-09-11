const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const SECRET = 'most_secret_word_ever';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return next(new AuthorizationError('Необходимо авторизоваться'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
