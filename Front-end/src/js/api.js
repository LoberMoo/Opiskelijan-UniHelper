import '../css/api.css'
import { getItems, getItemById, deleteItemById, addItem, putItem, renderItems} from './items.js';


// fetch('https://api.restful-api.dev/objects')
//   .then((response) => {
//    console.log(response);
//    if (!response.ok) {
//     throw new Error('Verkkovastaus ei ollut kunnossa');
//    }
//    return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error('Fetch-operaatiossa ilmeni ongelma:', error);
//   });

  // Yksinkertaistetaan ja modernisoidaan haku
  // käytetään async ja await avainsanoja

//   async function getData() {
// 	try {
// 		const response = await fetch('https://api.restful-api.dev/objects');
// 		const data = await response.json();
// 		console.log(data);
// 	} catch (error) {
// 		console.error('Virhe:', error);
// 	}
// }

// getData();


//ensimmäinen kutsu backend puolelle aeaeaeae
// Vanha version VVV
const consoleLogItmes = async () => {
	try {
    // default on get kutsu ilman optiota (valintoja)
		const response = await fetch('http://127.0.0.1:3000/api/items');
		const data = await response.json();
    console.log('Haetaan omasta rajapinnasta/palvelimesta esineitä aeaeaaeeea')
		console.log(data);

    data.forEach((rivi) => {
      console.log(rivi);
});

	} catch (error) {
		console.error('Virhe:', error);
	}
};

// consoleLogItmes();
// getItems();

// haetaan nappi
// lisätkää kuuntelija ja suorittakaa klikatessa gtItems funktio
const getItemsButton = document.querySelector('.get_items');
getItemsButton.addEventListener('click', getItems);

const getForm = document.querySelector('.get-item-form');
getForm.addEventListener('submit', getItemById);

const deleteBtn = document.querySelector('.delete-item');
deleteBtn.addEventListener('click', deleteItemById);


const addItemForm = document.querySelector('.add-item-form');
addItemForm.addEventListener('submit', addItem);


const putItemForm = document.querySelector('.put-item-form');
putItemForm.addEventListener('submit', putItem);

const renderItemTable = document.querySelector('.get_item_table');
renderbutton.addEventListener('click', renderItems);
