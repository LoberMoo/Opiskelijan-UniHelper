import { fetchData } from "./fetch";

const diaryContainer = document.querySelector('.merkinta');


// Entry:n haku ja dynaaminen luonti + poistonapin luonti funktio:
//////////////////////////////////////////////////////////////////////////////////////////////////////
const getEntries = async (event) => {
  // API url, linkki suorittaa back-endissä olevan haku skriptin.
  const url = 'https://kivi-server.swedencentral.cloudapp.azure.com/api/entries';
  let headers = {};
  // Tokenin haku kirjautuneelta käyttäjältä + virheenkäsittely jos tokenia ei löydy
  let token = localStorage.getItem('token');
  //console.log(token);
  if (!token){
    alert('Ei tokenia, kirjaudu sisään kubios tunnuksillasi.')
    return;
  }

  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const options = {
    headers: headers,
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Virhe kirjautumisessa:', response.error);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
  }

  // console.log(response);

  // Dynaamisesti luotujen päiväkirjamerkintöjen skripti
  // Skripti siis menee loopilla jokaikisen palautetun päiväkirjamerkinnän läpi
  // Ja dynaamisesti luo niille oman pienen osan mistä käyttäjä pystyy katsoa omat päiväkirjamerkintänsä  
  diaryContainer.innerHTML = '';
  response.forEach((entry, i) => {
    // console.log(entry);
    // Numero joka nousee 1 -> niin moneen kuinka kertaa looppi joutuu mennä läpi, eli kuinka monta päiväkirjamerkintää on
    // ja lisää sen merkinnän nimeen
    i++;
    // Dynaamista html elementtien luontia johon kaikki haettu tieto menee
    ////////////////////////////////////////////////////
    const card = document.createElement('div');
    card.classList.add('merkinnat');
    const nappi = document.createElement('BUTTON');

    const pvKirjaTiedot = document.createElement('div');
    const dropdowncontent = document.createElement('div');
    ////////////////////////////////////////////////////
    // Merkinöjen nappien nimeemistä ja luontia
    nappi.textContent = `Entry ${i}`;
    
    nappi.classList.add('dropdownbutton')
    
    // Tässä alkaa varsinainen muotoilu jokaikiselle päiväkirja merkinnölle
    pvKirjaTiedot.classList.add('area');
    const mauku = entry.created_at;
    const date = mauku.slice(0, 10);
    pvKirjaTiedot.innerHTML = `<p>Päivämäärä: ${date}</p>
    <p>Olotila: ${entry.mood}</p>
    <p>Paino: ${entry.weight}kg </p>
    <p>Unen määrä: ${entry.sleep_hours} tuntia</p>
    <p>Notes: </p>
    <p id="long">${entry.notes}</p>
    <p><strong>ID: ${entry.entry_id}</strong></p>
    <button id="${entry.entry_id}" class="nuke">Poista</button>`;

    const entryidnumber = entry.entry_id;

    card.appendChild(nappi);
    card.appendChild(pvKirjaTiedot);
    card.appendChild(dropdowncontent);
    diaryContainer.appendChild(card);

    // Tämä taas luo dynaamisesti jokaikiselle merkinnölle oman poistonappinsa
    const tamaId = entry.entry_id;
    document.getElementById(tamaId).addEventListener('click', () => {
      deleteEntry(tamaId);
    });
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////


// Merkintöjen poisto skripti, ei siinä kauheesti kiinnostavaa ole
const deleteEntry = async (id) => {
  let token = localStorage.getItem('token');
  let headers = {};
  const apiurl = `https://kivi-server.swedencentral.cloudapp.azure.com/api/entries/${id}`
  const confirmed = confirm(`Oletko varma, että haluat poistaa entry: Entry ID: ${id}?`);
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  if (!entryId) {
    console.log('Ei löytynyt Entryä ID:llä')
    return;
  }
  if (!confirmed) return;

  const options = {
    headers: headers,
    method: 'DELETE',
  };

  const entry = await fetchData(apiurl, options);
  if (entry.error){
    console.log(entry.error);
    alert(`Tapahtui virhe.`);
    return;
  }

  alert(`Entry poistettu. ID: ${id}`);
  // Kun päiväkirjamerkintö on poistettu sivu refreshaa jotta käyttäjä näkee heti muutoksen.
    await getEntries();
}

// Merkinnön lisäys sivulta
/////////////////////////////////////////////////////////////////////////////////////
const addentry = async () => {
  let token = localStorage.getItem('token');
  let headers = {}
  const apiurl = `https://kivi-server.swedencentral.cloudapp.azure.com/api/entries/`
  
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  // Kaikki alla olevat hakee sivulla olevasta dialogista käyttäjän pistämät tiedot
  /////////////////////////////////////////////////////
  const mood = document.getElementById('mood')
  const moodval = mood.value
  // console.log(moodval)

  const weight = document.getElementById('weight')
  const weightval = weight.value
  // console.log(weightval)

  const sleep = document.getElementById('sleep')
  const sleepval = sleep.value
  // console.log(sleepval)

  const notes = document.getElementById('notes')
  const notesval = notes.value
  // console.log(notesval)

  // Jotta täsmällistä käyttäjän kirjoittamaa arvoa voi käyttää,
  // niin jokaikiselle muuttujalle on annettu toisellainen .value muuttuja
  /////////////////////////////////////////////////////

  // Tämä on dynaaminen päivämäärän haku jotta käyttäjän ei tarvitsisi itse kirjoittaa päivämäärää merkintään.
  /////////////////////////////////////////////////////
  let datetime = new Date ()

  // Päivän saanti + jos päivä on yksinumeerinen se muuttaa sen kaksinumeeriseksi koska 
  // Backend jostainsyystä haluaa sen juuri kaksinumeerisena, eli 3 pitää olla 03
  let day = datetime.getDate();
  if (day < 10) {
    day = '0' + day;
  }

  // Kuukauden saanti, sama hommeli kun päivämäärässä, jos kuukausi on yksinumeerinen se muutetaan kaksinumeeriseksi
  let month = datetime.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }

  // Ja tämän hetkinen vuosi
  let year = datetime.getFullYear();
  
  // päivämäärä yhdistetään yheen muuttujaan
  let pvmr = `${year}-${month}-${day}`
  /////////////////////////////////////////////////////

  // Kaikki alla oleva toimittaa tiedot rajapinnan kautta tietokantaan
  const bodydata = {
    entry_date: pvmr,
    mood: moodval,
    weight: weightval,
    sleep_hours: sleepval,
    notes: notesval,
  };

  // console.log(bodydata);

  const options = {
		body: JSON.stringify(bodydata),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
		},
	};

  const entry = await fetchData(apiurl, options);
  // console.log(apiurl);
  // console.log(options);
  // console.log(entry);

  if (entry.error){
    console.log(entry.error);
    alert(`Tapahtui virhe.`);
    return;
  }
  
  alert('Päiväkirja merkintä lisätty!');
  await getEntries();
}
/////////////////////////////////////////////////////////////////////////////////////

// Exporttausta jos muissa JS tiedostoissa käytetään kyseisiä funktioita
export {getEntries, deleteEntry, addentry};
