import { getEntries, deleteEntry, addentry, delent } from "./entries.js";

// const getEntriesBtn = document.querySelector('.get_entries');
// getEntriesBtn.addEventListener('click', getEntries);

// Automaattinen diary:n haku, ylhäällä on vanha versio joka haki painamalla nappia.
window.onload = getEntries();

document.addEventListener('click', function(event) {
  if (event.target.matches('.dropdownbutton')) {
    const area = event.target.nextElementSibling;
    area.classList.toggle('show');
  } 
});

const addentrybutton = document.querySelector('.add_entry');
addentrybutton.addEventListener('click', addentry);

// const deleteEntryButton = document.querySelector('.deleteEntry');
// deleteEntryButton.addEventListener('click', deleteEntry);

const poistonappi = document.querySelector('.nuke');
poistonappi.addEventListener('click', delent);


// const opendropdownbtn = document.querySelector('.dropdownbutton');
// opendropdownbtn.addEventListener('click', opendropdown);

// function opendropdown() {
//   document.getElementById("dropdown").classList.toggle("show");
// }


// window.onclick = function(event) {
//   if (!event.target.matches('.dropdownbutton')) {
//     var dropdowns = document.getElementsByClassName("area");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// } 



let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';