document.addEventListener('readystatechange', event => { 

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
  document.getElementById('equipment-tab').style.display = "block";
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
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  loadInfo(tabName)
} 

function loadInfo(tab) {
  fetch(`/manage-equipment/${tab}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    var json = response.json();
    console.log(json);
    applyInfo(json);
  })
  .catch(error => console.error('Error:', error));
};

function applyInfo(info) {
  
}