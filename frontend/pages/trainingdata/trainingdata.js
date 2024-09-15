document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loggedIn = urlParams.get('loggedIn') === 'true';
    const email = urlParams.get('email');

    // Sicherstellen, dass der Benutzer eingeloggt ist und eine gültige E-Mail hat
    if (!loggedIn || !email) {
        alert('Diese Funktion ist nur mit einem Login zugänglich!');
        window.location.href = '/login';
        return;
    }

    // Trainingsdaten und Trainer-Daten abrufen und in die Tabelle einfügen
    fetch(`/trainingdata?loggedIn=${loggedIn}&email=${encodeURIComponent(email)}`)
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

    // Logout-Button-Event hinzufügen
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (loggedIn) {
                // URL-Parameter entfernen
                urlParams.delete('loggedIn');
                urlParams.delete('email');
                
                // URL aktualisieren und zur Startseite weiterleiten
                const newUrl = `${window.location.origin}/index.html`; // Weiterleitung zur Startseite
                history.replaceState(null, '', newUrl);
                alert('Sie wurden erfolgreich ausgeloggt!');
                window.location.href = newUrl; // Weiterleitung zur Startseite
            } else {
                alert('Sie sind bereits ausgeloggt.');
            }
        });
    }

    // Link-Aktualisierung für Navigation (falls erforderlich)
    function updateLinks() {
        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            const href = new URL(link.href);
            href.searchParams.set('loggedIn', loggedIn);
            href.searchParams.set('email', email);
            link.href = href.toString();
        });
    }

    updateLinks();
});