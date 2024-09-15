document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const loggedIn = urlParams.get('loggedIn') === 'true';

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
});