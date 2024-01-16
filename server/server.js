const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
        res.render('index', {message: 'Hello from the server!'});
    });

app.get('/admin/login', (req, res) => {
        res.render('admin-login');
    });

app.post('/admin/login', (req, res) => {
        const { username, password } = req.body;

        //TODO: implémenter logique d'authentification admin

        res.redirect('/admin/dashboard');

    });
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

