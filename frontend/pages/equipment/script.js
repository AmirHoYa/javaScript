const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const activeTab = urlParams.get('tab') ? 'course' : 'equipment';

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
  openTab(`${activeTab}-button`, `${activeTab}-tab`);
}

function openTab(buttonId, tabName) {
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
  document.getElementById(buttonId).className += " active";

  if (!tab.hasAttribute('loaded')) {
    loadInfo(tab)
  }
} 

/**
 * Loads information of a tab from the server. 
 * @param {*} tab 
 */
function loadInfo(tab) {
  fetch(`/manage-equipment/${tab.id}/${email}`, {
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
    applyInfo(tab, json);
  })
  .catch(error => console.error('Error:', error));
};

/**
 * Populates the tab with panels of information retrieved from the server.
 * @param {*} tab 
 * @param {*} infos 
 */
function applyInfo(tab, infos) {
  if (!email) {
    document.querySelector(`#${tab.id} #personal`).style.display = 'none';
  }

  const elPersonalGrid = document.querySelector(`#${tab.id} #personal .grid`);
  const elAllGrid = document.querySelector(`#${tab.id} #all .grid`);
  infos.forEach(item => {
    var className = 'panel';
    if (item.reservedByMe) {
      className += ' personal';
    } else if (!item.available) {
      className += ' reserved';
    }

    var panel;
    if (tab.id === 'equipment-tab') {panel = buildEquipmentPanel(className, item)}
    if (tab.id === 'course-tab') {panel = buildCoursePanel(className, item)}
    elAllGrid.appendChild(panel);

    if (item.reservedByMe) {
      const clone = panel.cloneNode(true);
      clone.onclick = () => {details(item.id)};
      elPersonalGrid.appendChild(clone);
    }
  });

  tab.setAttribute('loaded', true)
}

function buildEquipmentPanel(className, info) {
  const panel = document.createElement('div');
  panel.className = className;
  panel.id = info.id;
  if (info.img) {panel.style.backgroundImage = `url(${info.img}), url(/assets/missing_image.jpg)`};
  panel.onclick = () => {details(info.id)};
  panel.innerHTML = `
    <h2>${info.name}</h2>
  `;
  return panel;
}

function buildCoursePanel(className, info) {
  var spanClass = 'many';
  if (info.freeSlots < 3) {spanClass = 'few'}
  if (info.freeSlots == 0) {spanClass = 'none'}

  const panel = document.createElement('div');
  panel.className = className;
  panel.id = info.id;
  if (info.img) {panel.style.backgroundImage = `url(${info.img}), url(/assets/missing_image.jpg)`};
  panel.onclick = () => {details(info.id)};
  panel.innerHTML = `
    <h2>${info.name}</h2>
    <p id="courseSlots">Freie Plätze: <span class="${spanClass}">${info.freeSlots}</span>/${info.totalSlots}</p>
  `;
  return panel;
}

/**
 * Load details of the specified panel from the server to show in a seperate div.
 * @param {string} panelId 
 */
function details(panelId) {
  fetch(`/manage-equipment/${panelId}/${email}`, {
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
    applyDetails(json);
  })
  .catch(error => console.error('Error:', error));
}

/**
 * Generates and populates a 'details' div to show additional information of a selected panel.
 * @param {*} data 
 */
function applyDetails(data) {
  const isEquipment = data.id.startsWith('g');
  const details = document.createElement('div');
  const buttons = {
    sub_available: `<button id="subscribe" onclick="subscribe('${data.id}')">${isEquipment ? 'Reservieren' : 'Anmelden'}</button>`,
    sub_unavailable: `<button class="disabled" id="subscribe")">${isEquipment ? 'Reservieren' : 'Anmelden'}</button>`,
    unsub: `<button id="unsubscribe" onclick="unsubscribe('${data.id}')">${isEquipment ? 'Stornieren' : 'Abmelden'}</button>`
  }
  var spanClass = 'many';
  if (data.freeSlots < 3) {spanClass = 'few'}
  if (data.freeSlots == 0) {spanClass = 'none'}
  const courseSlots = `<p id="courseSlots">Freie Plätze: <span class="${spanClass}">${data.freeSlots}</span>/${data.totalSlots}</p>`
  details.id = data.id;
  details.className = 'details';
  details.innerHTML = `
    <img src="${data.img}" width="230" height="230" alt="">
    <hr id="seperator">
    <div id="detail-info">
        <h2 id="name">${data.name}</h2>
        <p id="description">${data.desc}</p>
        ${!isEquipment ? courseSlots : ''}
    </div>
    ${data.reservedByMe ? buttons.unsub : data.available ? buttons.sub_available : buttons.sub_unavailable}
    <button id="close" onclick="closeDetails()">X</button>
  `;
  
  const selected = document.getElementById('selected');
  if (selected.hasChildNodes()) {selected.removeChild(selected.firstChild);}
  selected.appendChild(details)
  selected.style.display = 'block';
}

/**
 * Closes the 'details' div.
 */
function closeDetails() {
  const selected = document.getElementById('selected');
  selected.removeChild(selected.firstChild);
  selected.style.display = 'none';
}

/**
 * Subcribes to a course or equipment. Reloads page after success.
 * If user is not logged in, automatically redirects to the login and back.
 * @param {string} panelId
 */
function subscribe(panelId) {
  if (!email) {
    alert('Für diese Funktion müssen Sie eingeloggt sein!');
    location.href = `/login?redirectFrom=/equipment`;
    return;
  }
  fetch(`/manage-equipment/sub/${panelId}/${email}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    } else {
      return response.text();
    }
  })
  .then(text => {
    if (text) {alert(text)}
  });
}

/**
 * Unsubscribes to a course or equipment. Reloads page after success.
 * @param {string} panelId
 */
function unsubscribe(panelId) {
  fetch(`/manage-equipment/unsub/${panelId}/${email}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
  })
  .then(response => {
    if (response.redirected) {
      window.location.href = response.url;
    } else {
      return response.text();
    }
  })
  .then(text => {
    if (text) {alert(text)}
  });
}