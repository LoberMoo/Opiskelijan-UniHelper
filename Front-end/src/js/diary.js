import { getEntries, deleteEntry } from "./entries.js";
import '../css/style.css';

const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

const deleteEntryButton = document.querySelector('.deleteEntry');
deleteEntryButton.addEventListener('click', deleteEntry);

let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';
