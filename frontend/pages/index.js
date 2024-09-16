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

function openInfo(infoId) {
    // Declare all variables
    var i, info, card;

    // Get all elements with class="info" and hide them
    info = document.getElementsByClassName("info");
    for (i = 0; i < info.length; i++) {
        info[i].style.display = "none";
    }

    // Get all elements with class="card" and remove the class "active"
    card = document.getElementsByClassName("card");
    for (i = 0; i < card.length; i++) {
        card[i].className = card[i].className.replace(" active", "");
    }

    // Show the current info, and add an "active" class to the card that opened the info
    var activeInfo = document.getElementById(infoId);
    activeInfo.style.display = "block"
    event.currentTarget.className += " active";
}