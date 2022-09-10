const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new AuthorizationError('Необходимо авторизоваться'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
