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
            "g1":{
                id:"g1",
                name:"Gerät",
                reservedBy:null
            },
            "g2":{
                id:"g2",
                name:"Anderes Gerät",
                reservedBy:"test@user.de"
            },
            "g3":{
                id:"g3",
                name:"Tolles Gerät",
                reservedBy:"another@user.com"
            }}
        }
        return this.cache.equipment;
    }

    saveEquipment(equipment) {
        this.cache.equipment = equipment;
    }
    
    loadCourses() {
        if (!this.cache.courses) {
            //read courses.json and put in cache
            console.log('loading courses from db')
            this.cache.courses = {"c1":{
                id:"c1",
                name:"Wassergymnastik",
                capacity: 4,
                reservedBy:[]
            },
            "c2":{
                id:"c2",
                name:"Zumba",
                capacity: 4,
                reservedBy:["test@user.de"]
            },
            "c3":{
                id:"c3",
                name:"Aerobik",
                capacity: 4,
                reservedBy:["another@user.com", "third@user.com"]
            },
            "c4":{
                id:"c4",
                name:"Personal",
                capacity: 1,
                reservedBy:["another@user.com"]
            },
            "c5":{
                id:"c5",
                name:"Personal 2",
                capacity: 1,
                reservedBy:["test@user.de"]
            }}
        }
        return this.cache.courses;
    }

    saveCourses(courses) {
        this.cache.courses = courses;
    }
}
const dataService = new DataService();

// IMPORTANT: configured before static path to prevent loading index.html directly instead of using the configured routing!
app.all('/', (req, res) => {
    redirectWithParams(req, res, '/home');
});

app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages')));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'pages', 'trainingdata')));
app.use(bodyParser.json());

const trainingData = {
    "test@user.de": [
        { date: '2024-09-01', exercise: 'Laufband', duration: '30 Minuten', calories: 300, repetitions: '-', sets: '-', weight: '-'},
        { date: '2024-09-05', exercise: 'Fahrrad', duration: '45 Minuten', calories: 400, repetitions: '-', sets: '-', weight: '-' },
        { date: '2024-09-10', exercise: 'Rudern', duration: '20 Minuten', calories: 250, repetitions: '10', sets: '3', weight: '50 kg' },
        { date: '2024-09-15', exercise: 'Beinpresse', duration: '60 Minuten', calories: 500, repetitions: '5', sets: '5', weight: '100 kg'}
    ],
    "another@user.com": [
        { date: '2024-09-02', exercise: 'Stepper', duration: '40 Minuten', calories: 350, repetitions: '-', sets: '-', weight: '-' },
        { date: '2024-09-06', exercise: 'Ellipsentrainer', duration: '50 Minuten', calories: 420, repetitions: '-', sets: '-', weight: '-' },
        { date: '2024-09-12', exercise: 'Latissimuszug', duration: '30 Minuten', calories: 400, repetitions: '8', sets: '2', weight: '20 kg' },
        { date: '2024-09-18', exercise: 'Brustpresse', duration: '45 Minuten', calories: 200, repetitions: '10', sets: '3', weight: '25 kg' }
    ],
    "third@user.com": [
        { date: '2024-09-03', exercise: 'Schulterpresse', duration: '45 Minuten', calories: 450, repetitions: '5', sets: '4', weight: '30 kg' },
        { date: '2024-09-07', exercise: 'Beinbeuger/-strecker', duration: '30 Minuten', calories: 350, repetitions: '10', sets: '3', weight: '40 kg' },
        { date: '2024-09-13', exercise: 'Laufband', duration: '40 Minuten', calories: 400, repetitions: '-', sets: '-', weight: '-' },
        { date: '2024-09-20', exercise: 'Fahrrad', duration: '60 Minuten', calories: 500, repetitions: '-', sets: '-', weight: '-' }
    ]
};

const users = {
    "test@user.de": {
        password: "password123",
        name: "Test User",
        gender: "male",
        age: 21,
        trainer: "Markus Rühl"
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
        trainer: ""
    }
};

/*
    ===== Request body (relevant data): =====
    IncomingMessage {
        headers: {
            host: 'localhost:3000'
            referer: 'http://localhost:3000/<path> (previous page from history, where this page was called from) >> can be used to auto redirect to calling page after login, instead of /home
        }
        host: 'localhost'
        hostname: 'localhost'
        method: 'GET'
        originalUrl: <url> (url that was used to call this page, includes params)
        path: <path> (url path after domain)
        query: {
            <key>: <value> (params; ex: loggedIn: 'true') // <value> is always a string, so "loggedIn === true" -> false //
        }
    }
*/
function redirectWithParams(req, res, path) {
    var params = req.query;
    var firstParam = true;
    var url = path;

    if (params) {
        for (const key in params) {
            var param = firstParam ? '?' : '&';
            param += `${key}=${params[key]}`;
            url += param;
            firstParam = false;
        }
    }

    res.redirect(url);
}

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'login', 'login.html'));
});

app.post('/login', (req, res) => {
    const { loginEmail, password } = req.body;
    const redirectPath = req.query.redirectFrom;

    if (users[loginEmail] && users[loginEmail].password === password) {
        res.redirect(`${redirectPath ? redirectPath : '/home'}?loggedIn=true&email=` + encodeURIComponent(loginEmail));
    } else {
        res.send('Login fehlgeschlagen! Ungültige E-Mail oder Passwort.');
    }
});

app.get('/logout', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

app.get('/trainingdata', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'trainingdata', 'trainingdata.html'));
});

app.get('/equipment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'equipment', 'manage-equipment.html'));
});

app.get('/trainingdata/info', (req, res) => {
    const { email } = req.query;    
    const data = trainingData[email] || [];
    const trainer = users[email].trainer;

    res.json({
        trainingData: data,
        trainer: trainer
    });
});

/*
    response json:
    {
        name: string,
        available: boolean,
        reservedByMe: boolean,
        (freeSlots: int) //courses only
    }
 */
app.get('/manage-equipment/equipment-tab/:email', (req, res) => {
    var equipment = dataService.loadEquipment();
    var response = [];
    for (const key in equipment) {
        const element = equipment[key];
        var reserved = element.reservedBy ? true : false;
        var reservedByMe = req.params.email && element.reservedBy === req.params.email;
        response.push({
            id: element.id,
            name: element.name,
            available: !reserved,
            reservedByMe: reservedByMe
        })
    }

    res.send(response);
})

app.get('/manage-equipment/course-tab/:email', (req, res) => {
    var courses = dataService.loadCourses();
    var response = [];
    for (const key in courses) {
        const element = courses[key];
        var reservedByMe = req.params.email && element.reservedBy.includes(req.params.email);
        var freeSlots = element.capacity - element.reservedBy.length;
        var available = freeSlots > 0 || reservedByMe;
        response.push({
            id: element.id,
            name: element.name,
            available: available,
            reservedByMe: reservedByMe,
            freeSlots: freeSlots
        })
    }
    
    res.send(response);
})

app.get('/manage-equipment/:id/:email', (req, res) => {
    const id = req.params.id;
    const email = req.params.email;
    const isEquipment = id.startsWith('g');
    const data = isEquipment ? dataService.loadEquipment() : dataService.loadCourses();
    const element = data[id];
    if (isEquipment) {
        var reserved = element.reservedBy ? true : false;
        var reservedByMe = req.params.email && element.reservedBy === req.params.email;
        res.json({
            id: element.id,
            name: element.name,
            available: !reserved,
            reservedByMe: reservedByMe
        })
    } else {
        var reservedByMe = req.params.email && element.reservedBy.includes(req.params.email);
        var freeSlots = element.capacity - element.reservedBy.length;
        var available = freeSlots > 0 || reservedByMe;
        res.json({
            id: element.id,
            name: element.name,
            available: available,
            reservedByMe: reservedByMe,
            freeSlots: freeSlots
        });
    }
});

app.post('/manage-equipment/sub/:id/:email', (req, res) => {
    const id = req.params.id;
    const isEquipment = id.startsWith('g');
    const email = req.params.email;
    const data = isEquipment ? dataService.loadEquipment() : dataService.loadCourses();
    if (isEquipment) {
        data[id].reservedBy = email;
    } else {
        data[id].reservedBy.push(email);
    }

    isEquipment ? dataService.saveEquipment(data) : dataService.saveCourses(data);

    var url = req.headers.referer;
    if (url.endsWith('tab=course')) {
        url = url.substring(0, url.length -11);
    }
    if (!isEquipment) {   
        url+= url.includes('?') ? '&tab=course' : '?tab=course';
    }
    res.redirect(url);
});

app.post('/manage-equipment/unsub/:id/:email', (req, res) => {
    const id = req.params.id;
    const isEquipment = id.startsWith('g');
    const email = req.params.email;
    const data = isEquipment ? dataService.loadEquipment() : dataService.loadCourses();
    if (isEquipment) {
        data[id].reservedBy = null;
    } else {
        var index = data[id].reservedBy.indexOf(email);
        data[id].reservedBy.splice(index, 1)
    }

    isEquipment ? dataService.saveEquipment(data) : dataService.saveCourses(data);

    var url = req.headers.referer;
    if (url.endsWith('tab=course')) {
        url = url.substring(0, url.length -11);
    }
    if (!isEquipment) {   
        url+= url.includes('?') ? '&tab=course' : '?tab=course';
    }
    res.redirect(url);
});

app.get('/user/:email', (req, res) => {
    const email = req.params.email;
    const user = users[email];
    
    if (!user) {
        res.status(204).send('User not found.');
        return;
    }

    res.json(user);
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
