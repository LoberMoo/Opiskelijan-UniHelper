// Render Items in UI
/////////////////////////////

const snackbar = document.getElementById('snackbar');

// Reusable function to show snackbar message
const showSnackbar = (message, type = '') => {
	snackbar.innerText = message;
	snackbar.className = `show ${type}`.trim();

	setTimeout(() => {
		snackbar.className = snackbar.className.replace('show', '').trim();
	}, 3000);
};
