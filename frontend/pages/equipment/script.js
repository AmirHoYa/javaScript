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

document.addEventListener('readystatechange', event => { 

  // When DOM is loading
  if (event.target.readyState === "loading") {
  }

  // When HTML/DOM elements are ready:
  if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
      init();
  }

  // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
  if (event.target.readyState === "complete") {
    //
  }
});

function init() {
  //Open tab on load
  openTab(null, 'equipment-tab');
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tab-button" and remove the class "active"
  tablinks = document.getElementsByClassName("tab-button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  var tab = document.getElementById(tabName);
  tab.style.display = "block"
  if (evt) {
    evt.currentTarget.className += " active";
  } else {
    document.getElementById('equipment-button').className += " active";
  }

  if (!tab.hasAttribute('loaded')) {
    loadInfo(tab)
  }
} 

function loadInfo(tab) {
  fetch(`/manage-equipment/${tab.id}`, {
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
  .then(json => {
    console.log(json);
    applyInfo(tab, json);
  })
  .catch(error => console.error('Error:', error));
};

function applyInfo(tab, infos) {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  if (!email) {
    document.getElementById('personal').style.display = 'none';
  }

  const elPersonalGrid = document.querySelector('#personal .grid');
  const elAllGrid = document.querySelector('#all .grid');
  infos.forEach(item => {
    const panel = document.createElement('div');
    var className = 'panel';
    if (email && item.reservedBy === email) {
      className += ' personal';
      item.reservedByMe = true;
    } else if (item.reservedBy) {
      className += ' reserved';
    }

    panel.className = className;
    panel.onclick = () => {alert('hi')};
    panel.innerHTML = `
      <h2>${item.name}</h2>
    `;
    
    elAllGrid.appendChild(panel);

    if (item.reservedByMe) {
      elPersonalGrid.appendChild(panel.cloneNode(true));
    }
  });

  tab.setAttribute('loaded', true)
}