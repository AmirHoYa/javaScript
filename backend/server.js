const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const users = {
    "test@user.de": "12345678"
};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'login.html'));
});

app.post('/login', (req, res) => {
    const { loginEmail, password } = req.body;

    if (users[loginEmail] && users[loginEmail] === password) {
        res.send('Login erfolgreich! Willkommen, ' + loginEmail);
    } else {
        res.send('Login fehlgeschlagen! Ungültige E-Mail oder Passwort.');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});