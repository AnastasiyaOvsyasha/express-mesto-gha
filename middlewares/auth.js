const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/AuthorisationError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new AuthorizationError('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};

module.exports = auth;
