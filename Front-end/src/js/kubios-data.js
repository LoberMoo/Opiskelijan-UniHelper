import { fetchData } from '/src/js/fetch.js';

////////////////////////////////////////////////////////////////////////
// Function to test and get user info from kubios API
// const getUserInfo = async () => {
//   console.log('Käyttäjän INFO Kubioksesta');

//   const url = 'http://localhost:3000/api/kubios/user-info';
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };
//   const options = {
//     headers: headers,
//   };
//   const userData = await fetchData(url, options);

//   if (userData.error) {
//     console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
//     return;
//   }
//   console.log(userData);
// };
////////////////////////////////////////////////////////////////////////

// Funktio joka hakee datan Kubioksesta
const getUserData = async () => {


  const url = 'http://localhost:3000/api/kubios/user-data';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }

  // Luo kaavisto chart.js:llä
  drawChart(userData);
  let formattedData = formatKubiosResults(userData);
  // console.log('Formatted Data', formattedData);
};


const formatKubiosResults = (userData) => {
  // Formatter chat.js varten
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  const formattedData = userData.results.map((entry) => {
    // Muunnetaan päivämäärä Date-olioksi
    const dateObject = new Date(entry.daily_result);
    // Muotoillaan label (esim "19. elokuuta") chart.js varten
    const formattedLabel = formatter.format(dateObject);
    // Timestamp amCharts varten, muuttaa päivämäärän numeroksi
    const timestamp = dateObject.getTime();

    // palautetaan muotoiltu objekti jossa oikeat arvot
    return {
      date: entry.daily_result, // alkuperäine päivämäätä
      timestamp: timestamp, // amcharts
      label: formattedLabel,
      readiness: entry.result.readiness,
      stressIndex: entry.result.stress_index,
    };
  });

  return formattedData;
};

// Chart.js kaavion luonti nettisivulle
const drawChart = (userData) => {
  // Chart.js dokumentaatio in case sitä tarvitaan:
  // https://www.chartjs.org/docs/latest/charts/line.html
  // https://www.chartjs.org/docs/latest/samples/line/line.html


  // Käyttäjätiedon logaaminen konsoliin testausta varten:
  // console.log(userData);


  // Muodostetaan erilliset taulukot chat.js:sää varten
  // haetaan käyttämällä map metodia vain kaikki sykkeen arvot
  const bpm = userData.results.map((rivi) => rivi.result.mean_hr_bpm);

  //
  const formatter = new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'long',
  });

  // Hakee kaavalle päivämäärät oikein (toimii myös jos samana päivänä tekee kaksi eri mittausta)
  const labels = userData.results.map((rivi) =>
    formatter.format(new Date(rivi.create_timestamp))
  );
  // Hakekaa stressIndex tiedot
  const hrv = userData.results.map((rivi) => rivi.result.rmssd_ms);
  console.log(userData);
  const readiness = userData.results.map((rivi) => rivi.result.readiness);

  // loggausta datan varmistamista varten
  ///////////////////////////////////////
  //  console.log('Labels', labels);
  // console.log('Readiness', readiness);
  // console.log('Stress Index', stressIndex);
  ///////////////////////////////////////

  const ctx = document.getElementById('jsChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'BPM',
          data: bpm,
          borderWidth: 1,
          borderColor: 'red',
        },
        {
          label: 'HRV',
          data: hrv,
          borderWidth: 1,
          borderColor: 'blue',
        },
        {
          label: 'Readiness',
          data: readiness,
          borderWidth: 1,
          borderColor: 'lime',
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'BPM / HRV',
          },
        },
      },
    },
  });

};

// alla oleva pätkä luo kaavion suoraan kun käyttäjä avaa sivun jotta ei tarvitse painaa erillistä nappia
window.onload = getUserData();

export { getUserData };