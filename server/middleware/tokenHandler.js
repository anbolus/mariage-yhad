const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(username) {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ username }, tokenSecret, { expiresIn: '1h'});
    return token;
} 

function verifyToken(token) {
    return new Promise((resolve, reject) => {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(token, tokenSecret, (err, decoded) => {
        if(err) {
            reject(err);
        } else {
            resolve(decoded);
        }
      });
    });
}

module.exports = {generateToken, verifyToken};
