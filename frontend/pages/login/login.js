document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('password').value;
    const redirectParam = window.location.search;


    fetch(`/login${redirectParam}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginEmail: email, password: password })
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.text();
        }
    })
    .then(data => {
        if (data) {
            alert(data);
        }
    })
    .catch(error => console.error('Error:', error));
});