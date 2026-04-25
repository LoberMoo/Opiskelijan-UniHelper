const token = localStorage.getItem('token')

async function haeKubiosData() {
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

haeKubiosData()