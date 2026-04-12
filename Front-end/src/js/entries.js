import { fetchData } from "./fetch";

const diaryContainer = document.querySelector('.korttipakka');


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
  response.forEach((entry) => {
    // console.log(entry);

    const card = document.createElement('div');
    card.classList.add('kortti');

    const pvKirjaTiedot = document.createElement('div');
    pvKirjaTiedot.classList.add('korttiteksti');
    pvKirjaTiedot.innerHTML = `<p>Päivämäärä: ${entry.created_at}</p>
    <p>Olotila: ${entry.mood}</p>
    <p>Paino: ${entry.weight}kg </p>
    <p>Unen määrä: ${entry.sleep_hours} tuntia</p>
    <p>Muuta sanottavaa: ${entry.notes}</p>
    <p><strong>ID: ${entry.entry_id}</strong></p>`;


    card.appendChild(pvKirjaTiedot);
    diaryContainer.appendChild(card);

  });
};

const deleteEntry = async () => {
  let token = localStorage.getItem('token');
  let headers = {}
  const idInput = document.getElementById('entryId')
  const entryId = idInput.value;
  // console.log(entryId);
  const apiurl = `http://127.0.0.1:3000/api/entries/${entryId}`
  const confirmed = confirm(`Oletko varma, että haluat poistaa entry: Entry ID: ${entryId}?`);
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

  alert(`Entry poistettu. ID: ${entryId}`);
    await getEntries();
}

export {getEntries, deleteEntry};
