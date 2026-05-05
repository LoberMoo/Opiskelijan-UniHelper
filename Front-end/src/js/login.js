// import '../css/api.css';
// import '../css/forms.css';
// import '../css/snackbar.css';
import { fetchData } from './fetch.js';


// Esimerkin takia haut ovat nyt suoraan tässä tiedostossa, jotta harjoitus ei sekoita
// teidän omaa projektin rakennetta

const registerUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const registerForm = document.querySelector('.registerForm');

	// Haetaan formista arvot
	const username = registerForm.querySelector('#username').value.trim();
	const password = registerForm.querySelector('#password').value.trim();
	const email = registerForm.querySelector('#email').value.trim();

	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
	const bodyData = {
		username: username,
		password: password,
		email: email,
	};

	// Endpoint
	const url = 'https://kivi-server.swedencentral.cloudapp.azure.com/api/users';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
	};
	console.log(options);

	// Hae data
	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error adding a new user:', response.error);
		return;
	}

	if (response.message) {
		console.log(response.message, 'success');
	}

	console.log(response);
	registerForm.reset(); // tyhjennetään formi
};

const loginUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const loginForm = document.querySelector('.loginForm');

	// Haetaan formista arvot
	const username = loginForm.querySelector('input[name=username]').value;
	const password = loginForm.querySelector('input[name=password]').value;

	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
	const bodyData = {
		username: username,
		password: password,
	};

	// Endpoint
	const url = 'https://kivi-server.swedencentral.cloudapp.azure.com/api/users/login';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
	};
	console.log(options);

	// Hae data
	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error login in:', response.error);
    alert('väärä käyttäjänimi tai salasana.')
		return;
	}

	if (response.message) {
		// console.log(response.message, 'success');
		localStorage.setItem('token', response.token);
		localStorage.setItem('name', username);
		// logResponse('loginResponse', `localStorage set with token value: ${response.token}`);
    	alert(`Tervetuloa ${username}!`);
		setTimeout(function () {
			window.location.href = 'homepage.html';
		}, 0);
	}

	console.log(response);
	loginForm.reset(); // tyhjennetään formi
};

const checkUser = async (event) => {
	const url = 'https://kivi-server.swedencentral.cloudapp.azure.com/api/users/me';
	let headers = {};
	let token = localStorage.getItem('token');
	console.log(token);
	if (token) {
		headers = { Authorization: `Bearer ${localStorage.token}` };
	}
	const options = {
		headers: headers,
	};

	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error login in:', response.error);
		return;
	}

	if (response.message) {
		console.log(response.message, 'success');
		logResponse('meResponse', `Authorized user info: ${JSON.stringify(response)}`);
		setTimeout(function () {
			// window.location.href = '/';
		}, 3000);
	}

	console.log(response);
	loginForm.reset(); // tyhjennetään formi
};

const deleteUser = async (event) => {
	console.log(evt);
	console.log(evt.target);
	console.log(evt.target.attributes['data-id'].value);
	const id = evt.target.attributes['data-id'].value;
	const url = `https://kivi-server.swedencentral.cloudapp.azure.com/api/users/${id}`;
	const options = { method: 'DELETE' };

	const answer = confirm(`Are you sure you want to delete user with ID: ${id}`);
	if (answer) {
		try {
			const response = await fetch(url, options);
			console.log(response);
			getAllUsers();
		} catch (error) {
			console.error(error);
		}
	}
};

function clearLocalStorage() {
	localStorage.removeItem('token');
	logResponse('clearResponse', 'localStorage cleared!');
}

// function logResponse(codeblock, text) {
// 	document.getElementById(codeblock).innerText = text;
// }

// const registerForm = document.querySelector('.registerForm');
// registerForm.addEventListener('submit', registerUser);

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', loginUser);

// const meRequest = document.querySelector('#meRequest');
// meRequest.addEventListener('click', checkUser);

const clear = document.querySelector('#clearButton');
clear.addEventListener('click', clearLocalStorage);
