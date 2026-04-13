const token = localStorage.getItem('token')

const response = await fetch('https://analysis.kubioscloud.com/v2/result/self', {
  headers: {
    Authorization: 'Bearer ' + token
  }
})

const data = await response.json()
const readiness = data.results[0].readiness

document.querySelector('.bar-inner').style.width = readiness + '%'
document.querySelector('.bar-pct').textContent = readiness + '%'