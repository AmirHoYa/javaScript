document.addEventListener('click', (e) => {
    if (e.target.classList.contains('navLink')) {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const loggedIn = urlParams.get('loggedIn') === 'true';
        const isRestricted = e.target.classList.contains('restricted')

        console.log(e.target);
        if (isRestricted && (!loggedIn || !email)) { // If function is login restricted and no user is logged in
            e.preventDefault(); // Prevent default link behavior
            alert('Diese Funktion ist nur mit einem Login zugänglich!');
            location.href = `/login?redirectFrom=${e.target.getAttribute('href')}`;
            return;
        }

        if (isRestricted) { // Redirects to new url and keeps login info as params
            e.target.href = `${e.target.href}?loggedIn=true&email=${encodeURIComponent(email)}`
            return;
        }

        e.preventDefault(); // Prevent default link behavior
        // Replace the path of URL after the domain with the value from the a-tags href attribute (not the whole href, as that includes the domain).
        // This ensures it keeps any params the URL may contain.
        var ref = '/redirect' + e.target.getAttribute('href');
        location.pathname = ref;
    }

    if (e.target.parentElement.id === 'login') {
        e.target.href += `?redirectFrom=${location.pathname}`;
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