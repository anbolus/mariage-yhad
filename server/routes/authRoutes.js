const express = require('express');
const jwtHandler = require("../middleware/tokenHandler.js")
require('dotenv').config();
const db = require('../db.js');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

//authentification du token
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

//middleware d'authentification pour les routes /admin
//authRouter.use('/admin', authenticateToken);

authRouter.get('/admin/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});

//connexion 
authRouter.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const results = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (results.length > 0) {
            const user = results[0];

            //vérification du mdp avec bcrypt
            if (user.password && user.password.trim() !== '') {
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    //génération du token
                    const token = jwtHandler.generateToken(username, { expiresIn: '1h' });
                    res.json({ token });
                } else {
                    res.status(401).json({ message: 'Invalid password' });
                }
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//inscription
authRouter.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword]);
        res.json({ message: 'Registration successful' })
    } catch (error) {
        console.error('Error during registration :' + error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = authRouter;