const express = require('express');
const jwtHandler = require("../middleware/tokenHandler.js")
require('dotenv').config();
const db = require('../db.js');
const authRouter = express.Router();


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwtHandler.verifyToken(token)
        .then(decoded => {
            req.user = decoded;
            next();
        })
        .catch(err => {
            res.status(401).json({ message: 'Invalid token' });
        });
};

authRouter.get('/admin/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});

authRouter.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (results.length > 0) {
                const token = jwtHandler.generateToken(username);
                // console.log('token generated: ' + token);
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    );
});

module.exports = authRouter;