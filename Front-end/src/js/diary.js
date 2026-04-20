import { getEntries, deleteEntry } from "./entries.js";

const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

const deleteEntryButton = document.querySelector('.deleteEntry');
deleteEntryButton.addEventListener('click', deleteEntry);

const opendropdownbtn = document.querySelector('.dropdownbutton');
opendropdownbtn.addEventListener('click', opendropdown);

function opendropdown() {
  document.getElementById("dropdown").classList.toggle("show");
}


window.onclick = function(event) {
  if (!event.target.matches('.dropdownbutton')) {
    var dropdowns = document.getElementsByClassName("area");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 


let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';