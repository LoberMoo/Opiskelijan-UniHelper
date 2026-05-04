import { getEntries, deleteEntry, addentry } from "./entries.js";

// const getEntriesBtn = document.querySelector('.get_entries');
// getEntriesBtn.addEventListener('click', getEntries);

// Automaattinen diary:n haku, ylhäällä on vanha versio joka haki painamalla nappia.
window.onload = getEntries();

// Toiminto joka saa napit toimimaan tappeina ja että yhen napin painallus ei avaa kaikkia.
document.addEventListener('click', function(event) {
  if (event.target.matches('.dropdownbutton')) {
    const area = event.target.nextElementSibling;
    area.classList.toggle('show');
  } 
});


const addentrybutton = document.querySelector('.add_entry');
addentrybutton.addEventListener('click', addentry);


// Hakee käyttäjän nimen joka on local storagessa, jos nimeä ei ole niin ohjelma antaa käyttäjälle nimen "vieras"
// Käyttäjän nimi (joka on vain sähköposti osoite) näytetään sivun oikeassa yläkulmassa
let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';