document.addEventListener('DOMContentLoaded', function() {
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

    if (loggedIn) {
        fetch(`/user/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            return response.json();
        })
        .then(user => {
            if (!user) {return}
            
            const welcome = document.querySelector('.welcome-section h1');
            if (!welcome) {return}

            const userName = document.createElement('span');
            userName.id = 'userName';
            userName.innerText = user.name;

            welcome.appendChild(userName);
        });
    }
});