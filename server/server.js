const express = require('express');
const app = express();
const path = require('path');
const port = 5000;

/* app.get('/', (req, res) => {
    res.send("Backend working !");
}); */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public'));


app.get('/', (req, res) => {
        res.render('index', {message: 'Hello from the server!'});
    });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});