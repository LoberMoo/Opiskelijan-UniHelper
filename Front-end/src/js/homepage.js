import { fetchData } from "./fetch";

const token = localStorage.getItem('token')

const card = document.querySelector('.palautumis')

const haeKubiosData = async () => {
  if (!token) {
    console.log('Ei tokenia')
    return
  }

  try {
    const res = await fetch('https://analysis.kubioscloud.com/v2/result/self?from=2026-01-01', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'User-Agent': 'UniHelper'
      }
    })

    const data = await res.json()
    const viimeisin = data.results[0]

    // Readiness = palautumisprosentti
    const readiness = Math.round(viimeisin.readiness * 100)
    document.querySelector('.bar-inner').style.width = readiness + '%'
    document.querySelector('.bar-pct').textContent = readiness + '%'

    // BPM sydämen lyöntitiheys
    const bpm = Math.round(viimeisin.mean_hr_bpm)
    document.getElementById('bpm-arvo').textContent = bpm + ' bpm'

    // RMSSD = HRV
    const hrv = Math.round(viimeisin.rmssd)
    document.getElementById('hrv-arvo').textContent = hrv + ' ms'

  } catch (err) {
    console.error('Kubios haku epäonnistui:', err)
  }
}

const palautumis = async () => {
  const url = 'http://127.0.0.1:3000/api/kubios/user-data';
  let headers = {};
  let token = localStorage.getItem('token');
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
  // console.log(response.results[15].create_timestamp);
  const {results} = response;

  const pvmr = results[results.length -1].create_timestamp
  const date = pvmr.slice(0, 10)

  const readinessnum = results[results.length -1].result.readiness
  const wholenum = Math.trunc(readinessnum);

  card.innerhtml = '';
  const palautumispalkki = document.createElement('div');
  palautumispalkki.classList.add('palkki')
  palautumispalkki.innerHTML = `
  <p>Viimeisimmän haun päivämäärä: ${date}</p>
  <progress value="${wholenum}" max="100"></progress>
  <div class="bar-labels"><span>Lepo</span><span>Stressi</span></div>
  <p class="readinessprosentti"><u>Palautumisprosentti: ${wholenum}%</u></p>`;

  card.appendChild(palautumispalkki);
}


// haeKubiosData()

window.onload = palautumis();