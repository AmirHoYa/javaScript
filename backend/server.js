const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

class DataService {
    cache = {};

    loadEquipment() {
        if (!this.cache.equipment) {
            //read equipment.json and put in cache
            console.log('loading equipment from db')
            this.cache.equipment = {
                "id":"xyz123",
                "name":"Gerät",
                "available":true,
                "reservedByMe":false
            }
        }
        return this.cache.equipment;
    }

    saveEquipment(equipment) {
        this.cache.equipment = equipment;
    }
    
    loadCourses() {
        if (!this.cache.courses) {
            //read courses.json and put in cache
        }
        return this.cache.courses;
    }

    saveCourses(courses) {
        this.cache.courses = courses;
    }
}
const dataService = new DataService();

app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages', 'trainingdata')));
app.use(bodyParser.json());

const trainingData = {
    "test@user.de": [
        { date: '2024-09-01', exercise: 'Laufband', duration: '30 Minuten', calories: 300 },
        { date: '2024-09-05', exercise: 'Fahrrad', duration: '45 Minuten', calories: 400 },
        { date: '2024-09-10', exercise: 'Rudergerät', duration: '20 Minuten', calories: 250 },
        { date: '2024-09-15', exercise: 'Krafttraining', duration: '60 Minuten', calories: 500 }
    ],
    "another@user.com": [
        { date: '2024-09-02', exercise: 'Stepper', duration: '40 Minuten', calories: 350 },
        { date: '2024-09-06', exercise: 'Ellipsentrainer', duration: '50 Minuten', calories: 420 },
        { date: '2024-09-12', exercise: 'Boxen', duration: '30 Minuten', calories: 400 },
        { date: '2024-09-18', exercise: 'Yoga', duration: '45 Minuten', calories: 200 }
    ],
    "third@user.com": [
        { date: '2024-09-03', exercise: 'Krafttraining', duration: '45 Minuten', calories: 450 },
        { date: '2024-09-07', exercise: 'Schwimmen', duration: '30 Minuten', calories: 350 },
        { date: '2024-09-13', exercise: 'Laufband', duration: '40 Minuten', calories: 400 },
        { date: '2024-09-20', exercise: 'Fahrrad', duration: '60 Minuten', calories: 500 }
    ]
};

const users = {
    "test@user.de": {
        password: "password123",
        name: "Test User",
        gender: "male",
        age: 21,
        trainer: ""
    },
    "another@user.com": {
        password: "password456",
        name: "Another User",
        gender: "female",
        age: 30,
        trainer: "Arnold Schwarzenegger"
    },
    "third@user.com": {
        password: "password789",
        name: "Third User",
        gender: "non-binary",
        age: 25,
        trainer: "Markus Rühl"
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'login', 'login.html'));
});

app.post('/login', (req, res) => {
    const { loginEmail, password } = req.body;

    if (users[loginEmail] && users[loginEmail].password === password) {
        res.redirect('/index.html?loggedIn=true&email=' + encodeURIComponent(loginEmail));
    } else {
        res.send('Login fehlgeschlagen! Ungültige E-Mail oder Passwort.');
    }
});

app.get('/trainingdata', (req, res) => {
    const { email } = req.query;    
    const data = trainingData[email] || [];
    const trainer = users[email].trainer;

    res.json({
        trainingData: data,
        trainer: trainer
    });
});

app.get('/test-image', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'assets', 'arnold.webp'));
});

app.get('/manage-equipment/equipment-tab', (req, res) => {
    res.send(dataService.loadEquipment());
    // console.log(dataService.loadEquipment());
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});


