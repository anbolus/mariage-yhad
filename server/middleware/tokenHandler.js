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

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if(token) {
    jwt.verify(token, tokenSecret, (err, decoded) => {
      if(err) {
        res.status(401).json({ message: 'Invalid token' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
}

module.exports = {generateToken, verifyToken, requireAuth};
