import { fetchData } from "./fetch";

const token = localStorage.getItem('token')
const card = document.querySelector('.palautumis')

// Palautumis arvon haku ja esitys funktio 
const palautumis = async () => {
  // Backendiä varten kommunikoivan API:n linkki
  const url = 'https://kivi.server.swedencentral.cloudapp.azure.com/api/kubios/user-data';
  let headers = {};
  // Tokenin haku
  let token = localStorage.getItem('token');
  // Haun muotoilu tokenin kanssa
  //////////////////////////////////////////////
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const options = {
    headers: headers,
  };

  const response = await fetchData(url, options);
  //////////////////////////////////////////////
  //Yleistä virheenkäsittelyä, ei spesifoi, että mikä on vialla
  if (response.error) {
    console.error('Virhe kirjautumisessa:', response.error);
    return;
  }
  // Jos kaikki menee oikein niin funktio jatkaa seuraavaan kohtaan
  if (response.message) {
    console.log(response.message, 'success');
  }
  //////////////////////////////////////////////
  //////////////////////////////////////////////

  // console.log(response);
  // console.log(response.results[15].create_timestamp);

  // Tässä alkaa dynaamisen palautumis palkin luonti
  ///////////////////////////////////////////////////////////
  // Tämän tarkoitus on lyhentää Json haun vaiheita jotta ei ole response.results.(blah blah)
  // vaan results.(blah blah)
  const {results} = response;

  // Ensiksi funktio ottaa ja lyhentää viimeisimmän Kubios haun(for lack of a better word)
  // ja lyhentää sen siistimmäksi, eli yyyy-mm-dd muotoon
  const pvmr = results[results.length -1].create_timestamp
  const date = pvmr.slice(0, 10)

  // Seuraavaksi fuktio ottaa saman, eli viimeisimmän kubios haun palautumisarvon
  // ja tekee siitä lyhyen numeron, eli 80.1234567 => 80
  const readinessnum = results[results.length -1].result.readiness
  const wholenum = Math.trunc(readinessnum);

  // Viimeiseksi funktio dynaamisesti luo palkin homepage sivustolle
  card.innerhtml = '';
  const palautumispalkki = document.createElement('div');
  palautumispalkki.classList.add('palkki')
  palautumispalkki.innerHTML = `
  <p>Viimeisimmän haun päivämäärä: ${date}</p>
  <progress value="${wholenum}" max="100"></progress>
  <div class="bar-labels"><span>Lepo</span><span>Stressi</span></div>
  <p class="readinessprosentti"><u>Palautumisprosentti: ${wholenum}%</u></p>`;

  card.appendChild(palautumispalkki);
  ///////////////////////////////////////////////////////////
}

// haeKubiosData()


// Tämä juoksee funktion automaattisesti kun käyttäjä avaa sivun
window.onload = palautumis();

// Hakee käyttäjän nimen joka on local storagessa, jos nimeä ei ole niin ohjelma antaa käyttäjälle nimen "vieras"
// Käyttäjän nimi (joka on vain sähköposti osoite) näytetään sivun oikeassa yläkulmassa
let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';