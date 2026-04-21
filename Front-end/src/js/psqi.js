function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("auki");
}

function goTo(n) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
    document.getElementById('page' + n).classList.add('active')
}

function laske() {
    const c1 = parseInt(document.getElementById('k5').value)

    const min = parseInt(document.getElementById('k2').value) || 0
    let c2a = min <= 15 ? 0 : min <= 30 ? 1 : min <= 60 ? 2 : 3
    const b1 = parseInt(document.querySelector('input[name="b1"]:checked')?.value || 0)
    const c2sum = c2a + b1
    const c2 = c2sum === 0 ? 0 : c2sum <= 2 ? 1 : c2sum <= 4 ? 2 : 3

    const h = parseFloat(document.getElementById('k4').value) || 0
    const c3 = h > 7 ? 0 : h >= 6 ? 1 : h >= 5 ? 2 : 3

    const bedtime = document.getElementById('k1').value
    const waketime = document.getElementById('k3').value
    let c4 = 0
    if (bedtime && waketime && h) {
        const [bh, bm] = bedtime.split(':').map(Number)
        const [wh, wm] = waketime.split(':').map(Number)
        let inBed = (wh * 60 + wm) - (bh * 60 + bm)
        if (inBed < 0) inBed += 24 * 60
        const eff = inBed > 0 ? (h * 60 / inBed) * 100 : 0
        c4 = eff >= 85 ? 0 : eff >= 75 ? 1 : eff >= 65 ? 2 : 3
    }

    let hairiot = 0
    for (let i = 2; i <= 7; i++) {
        hairiot += parseInt(document.querySelector(`input[name="b${i}"]:checked`)?.value || 0)
    }
    const c5 = hairiot === 0 ? 0 : hairiot <= 9 ? 1 : hairiot <= 18 ? 2 : 3

    const c6 = parseInt(document.getElementById('k6').value)

    const c7sum = parseInt(document.getElementById('k7').value) + parseInt(document.getElementById('k8').value)
    const c7 = c7sum === 0 ? 0 : c7sum <= 2 ? 1 : c7sum <= 4 ? 2 : 3

    const pisteet = c1 + c2 + c3 + c4 + c5 + c6 + c7
    document.getElementById('tulos').textContent = pisteet + ' / 21'
    document.getElementById('tulkinta').textContent =
        pisteet <= 5
            ? 'Hyvä unenlaatu'
            : 'Huono unenlaatu. Harkitse yhteydenottoa lääkäriin'

    goTo('Valmis')
}