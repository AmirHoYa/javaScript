document.addEventListener('DOMContentLoaded', function () {
    // URL-Parameter abrufen
    const urlParams = new URLSearchParams(window.location.search);
    const loggedIn = urlParams.get('loggedIn');
    const email = urlParams.get('email');

    if (loggedIn !== 'true') {
        alert('Nicht autorisiert! Bitte logge dich ein.');
        window.location.href = '/login';
        return;
    }

    if (!email) {
        alert('Email nicht gefunden! Bitte logge dich ein.');
        window.location.href = '/login';
        return;
    }

    // Daten von der API abrufen
    fetch(`/trainingdata.html?loggedIn=${loggedIn}&email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#trainingTable tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.exercise}</td>
                    <td>${item.duration}</td>
                    <td>${item.calories}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Abrufen der Trainingsdaten.');
        });
});