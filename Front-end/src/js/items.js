import { fetchData } from "./fetch.js";


// Render item in a list in the UI
//////////////////////////////////

const renderFruitlist = (items) => {

  // Haetaan fruitlist UL
  // ja lisätään loopissa kaikki yksittäiset
  // hedelmä listaan

  const fruitlist = document.querySelector('.fruitlist')
  fruitlist.innerHTML = '';

  items.forEach((nom) => {
    let li = document.createElement('li');
    li.textContent = `${nom.name} ID: ${nom.id}`;
    fruitlist.appendChild(li);

  });

};

// GETataan esineet tai jotain :P
/////////////////////////////////

const getItems = async () => {

  const items = await fetchData('http://20.250.18.57/api/items');

  // Jos kusee jotain backendissä niin tulee virheilmoitus konsoliin tai käyttäjälle.
  if (items.error) {
    console.log(items.error);
    return;
  }

  // Tai jatketaan jos kaikki toimii
  items.forEach((mauku) => {
    console.log(mauku.name);
  });


  renderFruitlist(items);
};

const getItemById = async (event) => {
  event.preventDefault();
  console.log('getting by id');

  const idInput = document.getElementById('itemId')
  const itemId = idInput.value;
  console.log(itemId);
  const apiurl = `http://20.250.18.57/api/items/${itemId}`

  const options = {
    method: 'GET',
  };

  const item = await fetchData(apiurl, options);

  if (item.error){
    console.log(item.error);
    alert(`Oml you so stupid bruh there aint no ${itemId}`);
    return;
  }
  console.log(item);
  alert(`The: ${itemId}`);
};

// Delete item
const deleteItemById = async () => {
  console.log('nuking by id');

  const idInput = document.getElementById('itemId')
  const itemId = idInput.value;
  console.log(itemId);
  const apiurl = `http://20.250.18.57/api/items/${itemId}`
  const confirmed = confirm(`Are juu sure juu want to delete item ${itemId}?`);

  if (!itemId) {
    console.log('Ei löytyny')
    return;
  }

  if (!confirmed) return;


  const options = {
    method: 'DELETE',
  };

  const item = await fetchData(apiurl, options);

  if (item.error){
    console.log(item.error);
    alert(`Oml you so stupid bruh there aint no ${itemId}`);
    return;
  }
  console.log(item);
  alert(`deleted the: ${itemId}`);

  await getItems();
};

const addItem = async (event) => {
  event.preventDefault();
  console.log('getting by id');

  const form = document.querySelector('add-item-form');
  const name_val = document.querySelector('#newItemName').value;
  const weight_val = document.querySelector('#newItemWeight').value.trim();

  if (!name_val) {
    alert('Nimi puuttuu');
    return;
  }

  const body = {};

  const apiurl = `http://20.250.18.57/api/items/`

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name_val,
      weight: weight_val,
    }),
  };

  const response = await fetchData(apiurl, options);

  if (response.error){
    console.log(response.error);
    alert(`Oml you so stupid bruh there aint no cheeseburgerg`);
    return;
  };

  await getItems();
  console.log(response);
  alert(`Lisätty esine: ${name_val}`);
};

const putItem = async (event) => {
  event.preventDefault();
  const name_val = document.querySelector('#putItemName').value;
  const idInput = document.getElementById('putItemId');
  const itemId = idInput.value;

  if (!itemId) {
    alert('Id puuttuu, katso listasta mahdollisia ID:tä');
    return;
  }
  const apiurl = `http://20.250.18.57/api/items/${itemId}`


  const options = {
    method: 'PUT',
	  headers: {
		  'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		  name: name_val,
	  }),
  };
  const response = await fetchData(apiurl, options);

  if (response.error) {
    console.log(response.error);
    alert(`Ei löytynyt Id:tä: ${itemId}. Katso listasta mahdolliset ID:t.`);
    return;
  };

  await getItems();
  console.log(response);
  alert(`Muutettu esine Id: ${itemId}`);
};

const renderItems = () => {

  items.forEach((item) => {
	const row = document.createElement('tr');

	row.innerHTML = `
      <td>${item.name}</td>
      <td><button class="check" data-id="${item.id}">Info</button></td>
      <td><button class="del" data-id="${item.id}">Delete</button></td>
      <td>${item.id}</td>
    `;

	tableBody.appendChild(row);
});
}

export {getItems, getItemById, deleteItemById, addItem, putItem, renderItems};
