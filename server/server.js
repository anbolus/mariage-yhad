const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const db = require('./db');
const authRoutes = require('./routes/authRoutes.js');
const tokenHandler = require('./middleware/tokenHandler.js');
const authRouter = require('./routes/authRoutes.js');
const { generateToken } = require('./middleware/tokenHandler.js');
const requireLogin = require('./middleware/tokenHandler.js');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.get('/', (req, res) => {
    res.render('index', { message: 'Hello from the server!' });
});

app.get('/admin/login', (req, res) => {
    res.render('admin-login');
});

app.get('/admin/register', (req, res) => {
    res.render('admin-register');
})

app.get('/admin/dashboard', tokenHandler.requireLogin, function (req, res) {
    res.render('admin-dashboard', { username: req.user.username });
})

app.use('/admin', authRouter);

app.use('/', authRoutes);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

