const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/constants/AuthError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new AuthError('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};

module.exports = auth;
