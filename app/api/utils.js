/**
 * Class responsible for generating and managing JWT tokens
 */

const jwt = require('jsonwebtoken');

//Creates token based on user data
exports.createToken = function (user) {
  return jwt.sign({ id: user._id, email: user.email }, 'secretpasswordnotrevealedtoanyone', {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

//Decodes token and compares against user data
exports.decodeToken = function (token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, 'secretpasswordnotrevealedtoanyone');
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
  }

  return userInfo;
};