const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages', 'trainingdata')));
app.use(bodyParser.json());

const trainingData = {
    "test@user.de": [
        { date: '2024-09-01', exercise: 'Laufband', duration: '30 Minuten', calories: 300 },
        { date: '2024-09-05', exercise: 'Fahrrad', duration: '45 Minuten', calories: 400 }
    ]
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'login', 'login.html'));
});

app.post('/login', (req, res) => {
    const { loginEmail, password } = req.body;

    const users = {
        "test@user.de": "password123"
    };

    if (users[loginEmail] && users[loginEmail] === password) {
        res.redirect('/index.html?loggedIn=true&email=' + encodeURIComponent(loginEmail));
    } else {
        res.send('Login fehlgeschlagen! Ungültige E-Mail oder Passwort.');
    }
});

app.get('/trainingdata', (req, res) => {
    const { loggedIn, email } = req.query;
    
    if (loggedIn !== 'true') {
        return res.redirect('/login');
    }

    if (!email) {
        return res.redirect('/login');
    }

    const data = trainingData[email] || [];
    res.json(data);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});