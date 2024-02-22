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
const sendEmail = require('./middleware/emailSender.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/* app.use((req, res, next) => {
    res.status(404).render('404');
}) */

/* app.get('/styles/style.css', function(req, res) {
    res.type('text/css');

}); */

app.get('/programme', (req, res) => {
    res.render('programme');
});

app.get('/contact/', (req, res) => {
    res.render('contact');
});

app.get('/hebergements', (req, res) => {
    res.render('hebergements');
})

app.get('/api/google-maps', (req, res) => {
    try {
        // Créer l'iframe HTML avec l'URL de l'API Google Maps Embed et la clé API
        const iframe = `
            <iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen
                src="https://www.google.com/maps/embed/v1/search?q=7%20Rue%20de%20la%20Lucque%2C%20Saint-Andr%C3%A9-de-Sangonis%2C%20France&key=${process.env.GOOGLE_MAPS_API_KEY}">
            </iframe>
        `;
        // Envoyer l'iframe HTML en réponse
        res.send(iframe);
    } catch (error) {
        console.error('Erreur lors de la requête à l\'API Google Maps:', error);
        res.status(500).send('Erreur lors de la requête à l\'API Google Maps');
    }
});

app.post('/send-email', (req, res) => {
    const { from, subject, text } = req.body;
    const to = process.env.EMAIL_CONTACT;
    sendEmail(from, to, subject, text);
    res.send('Email envoyé avec succès à ' + from + text);
});

app.get('/', (req, res) => {
    res.render('index', { message: 'Hello from the server!' });
});

app.get('/admin/login', (req, res) => {
    res.render('admin-login');
});

app.get('/admin/register', (req, res) => {
    res.render('admin-register');
})

/* app.get('/admin/dashboard', tokenHandler.requireAuth, function (req, res) {
    res.render('admin-dashboard', { username: req.user.username });
})
 */
app.use('/admin', authRouter);

app.use('/', authRoutes);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

