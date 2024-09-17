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
    console.log(json);
    applyInfo(tab, json);
  })
  .catch(error => console.error('Error:', error));
};

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
  console.log(info.img);
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
  panel.onclick = () => {details(info.id)};
  panel.innerHTML = `
    <h2>${info.name}</h2>
    <p>Freie Plätze: <span class="${spanClass}">${info.freeSlots}</span></p>
  `;
  return panel;
}

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
    console.log(json);
    applyDetails(json);
  })
  .catch(error => console.error('Error:', error));
}

function applyDetails(data) {
  const isEquipment = data.id.startsWith('g');
  const details = document.createElement('div');
  const buttons = {
    sub_available: `<button id="subscribe" onclick="subscribe('${data.id}')">${isEquipment ? 'Reservieren' : 'Anmelden'}</button>`,
    sub_unavailable: `<button class="disabled" id="subscribe")">${isEquipment ? 'Reservieren' : 'Anmelden'}</button>`,
    unsub: `<button id="unsubscribe" onclick="unsubscribe('${data.id}')">${isEquipment ? 'Stornieren' : 'Abmelden'}</button>`
  }
  details.id = data.id;
  details.className = 'details';
  details.innerHTML = `
    <img src="${data.img}" width="230" height="230" alt="">
    <hr id="seperator">
    <div id="detail-info">
        <h2 id="name">${data.name}</h2>
        <p id="description">${data.desc}</p>
    </div>
    ${data.reservedByMe ? buttons.unsub : data.available ? buttons.sub_available : buttons.sub_unavailable}
    <button id="close" onclick="closeDetails()">X</button>
  `;
  
  const selected = document.getElementById('selected');
  if (selected.hasChildNodes()) {selected.removeChild(selected.firstChild);}
  selected.appendChild(details)
  selected.style.display = 'block';
}

function closeDetails() {
  const selected = document.getElementById('selected');
  selected.removeChild(selected.firstChild);
  selected.style.display = 'none';
}

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
}

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
}