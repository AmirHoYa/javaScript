const urlParams = new URLSearchParams(window.location.search);
const loggedIn = urlParams.get('loggedIn');

if (loggedIn === 'true') {
    alert('Willkommen!');
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loggedIn = urlParams.get('loggedIn') === 'true';

    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (!loggedIn && !this.href.includes('login')) {
                event.preventDefault();
                alert('Funktion nur mit Login verfügbar. Bitte logge dich ein.');
                window.location.href = '/login';
            }
        });
    });
});