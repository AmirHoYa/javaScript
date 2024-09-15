document.addEventListener('click', (e) => {
    if (e.target.classList.contains('navLink')) {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const loggedIn = urlParams.get('loggedIn') === 'true';
        const isRestricted = e.target.classList.contains('restricted')

        console.log(e.target);
        if (isRestricted && (!loggedIn || !email)) {
            e.preventDefault(); // Prevent default link behavior
            alert('Diese Funktion ist nur mit einem Login zugänglich!');
            location.href = '/login';
            return;
        }

        if (isRestricted) {
            e.target.href = `${e.target.href}?loggedIn=true&email=${encodeURIComponent(email)}`
        } else {
            e.preventDefault(); // Prevent default link behavior
            // Replace the path of URL after the domain with the value from the a-tags href attribute (not the whole href, as that includes the domain).
            // This ensures it keeps any params the URL may contain.
            var ref = e.target.getAttribute('href');
            location.pathname = ref;
        }
    }

    /*
    let target = e.target.closest('a');    
    if (target) { // if the click was on or within an <a>
        // then based on some condition...
        if (target.getAttribute("href").startsWith("/foo")) {
           e.preventDefault(); // tell the browser not to respond to the link click
           // then maybe do something else
        }
    }*/
});