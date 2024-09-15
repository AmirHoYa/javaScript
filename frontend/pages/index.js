document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const loggedIn = urlParams.get('loggedIn') === 'true';

    // Update the training data link only if the user is logged in
    const trainingDataLink = document.getElementById('trainingDataLink');
    if (email && loggedIn) {
        trainingDataLink.href = `/trainingdata.html?loggedIn=true&email=${encodeURIComponent(email)}`;
    } else {
        trainingDataLink.href = '/login';  // Adjust link if not logged in
    }

    // Add a click event listener to the training data link
    if (trainingDataLink) {
        trainingDataLink.addEventListener('click', function(event) {
            if (!loggedIn) {
                event.preventDefault(); // Prevent default link behavior
                alert('Diese Funktion ist nur mit einem Login zugänglich!');
            }
        });
    }

    // Logout button event listener
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (loggedIn) {
                window.location.href = '/';
                alert('Sie wurden erfolgreich ausgeloggt!');
            } else {
                alert('Sie sind nicht eingeloggt.');
            }
        });
    }
});