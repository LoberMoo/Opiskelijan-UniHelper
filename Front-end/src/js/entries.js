import { fetchData } from "./fetch";

const diaryContainer = document.querySelector('.merkinta');


const getEntries = async (event) => {
  const url = 'http://127.0.0.1:3000/api/entries';
  let headers = {};
  let token = localStorage.getItem('token');
  //console.log(token);
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


  diaryContainer.innerHTML = '';
  response.forEach((entry, i) => {
    // console.log(entry);
    i++;
    const card = document.createElement('div');
    card.classList.add('merkinnat');
    const nappi = document.createElement('BUTTON');

    const pvKirjaTiedot = document.createElement('div');
    const dropdowncontent = document.createElement('div');

    nappi.textContent = `Entry ${i}`;
    
    nappi.classList.add('dropdownbutton')

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

    const tamaId = entry.entry_id;
    document.getElementById(tamaId).addEventListener('click', () => {
      deleteEntry(tamaId);
    });
  });
};

const deleteEntry = async (id) => {
  let token = localStorage.getItem('token');
  let headers = {};
  const apiurl = `http://127.0.0.1:3000/api/entries/${id}`
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
    await getEntries();
}


const addentry = async () => {
  let token = localStorage.getItem('token');
  let headers = {}
  const apiurl = `http://127.0.0.1:3000/api/entries/`
  
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

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

  let datetime = new Date ()

  let day = datetime.getDate();
  if (day < 10) {
    day = '0' + day;
  }

  let month = datetime.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }

  let year = datetime.getFullYear();

  let pvmr = `${year}-${month}-${day}`

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

const delent = () => {
  const miumau = document.getElementById('nuke').className
  console.log(miumau);
}

export {getEntries, deleteEntry, addentry, delent};
