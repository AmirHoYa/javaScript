document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loggedIn = urlParams.get('loggedIn') === 'true';
    const email = urlParams.get('email');

    // Hide "Login" or "Logout" link
    var login = document.getElementById('login');
    var logout = document.getElementById('logout');
    if (loggedIn) {
        login.style.display = 'none';
        logout.style.display = 'block';
    } else {
        login.style.display = 'block';
        logout.style.display = 'none';
    }

    // Trainingsdaten und Trainer-Daten abrufen und in die Tabelle einfügen
    fetch(`/trainingdata/info?loggedIn=${loggedIn}&email=${encodeURIComponent(email)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            return response.json();
        })
        .then(response => {
            const { trainingData, trainer } = response;
            const tableBody = document.querySelector('#trainingTable tbody');
            trainingData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.exercise}</td>
                    <td>${item.duration}</td>
                    <td>${item.calories}</td>
                `;
                tableBody.appendChild(row);
            });

            // Trainer-Daten abrufen und Bild/Name aktualisieren
            const trainerInfo = {
                "Arnold Schwarzenegger": "../../assets/arnold.webp",
                "Markus Rühl": "../../assets/markus.jpg"
            };

            const trainerImage = document.getElementById('trainerImage');
            const trainerNameElement = document.getElementById('trainerName');
            console.log("Test: " + trainerInfo[trainer]);
            if (trainerInfo[trainer]) {
                trainerImage.src = trainerInfo[trainer];
                trainerImage.alt = trainer;
                trainerNameElement.textContent = trainer;
            } else {
                trainerImage.src = '../../assets/default_trainer.jpg';
                trainerImage.alt = 'Trainer Bild';
                trainerNameElement.textContent = 'Unbekannter Trainer';
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Fehler beim Abrufen der Trainingsdaten.');
        });

    // Logout-Button-Event
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (loggedIn) {      
                alert('Sie wurden erfolgreich ausgeloggt!');
                window.location.href = '/';
            } else {
                alert('Sie sind bereits ausgeloggt.');
            }
        });
    }
});