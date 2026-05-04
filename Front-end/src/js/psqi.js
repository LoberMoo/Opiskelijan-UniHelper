// vaihtaa näkyvän sivun
function goTo(n) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("page" + n).classList.add("active");
}
// laske pisteet komponenteittain (c1-c7) ja näytä tulos
function laske() {
    // c1: subjektiivinen unenlaatu
    const c1 = parseInt(document.getElementById("k5").value);

    const min = parseInt(document.getElementById("k2").value) || 0;
    let nukahtaminen = 0;

    if (min > 60) nukahtaminen = 3;
    else if (min > 30) nukahtaminen = 2;
    else if (min > 15) nukahtaminen = 1;

    const b1 = parseInt(document.querySelector('input[name="b1"]:checked')?.value || 0);
    // c2: nukahtamisviive
    let c2 = nukahtaminen + b1;
    if (c2 > 4) c2 = 3;
    else if (c2 > 2) c2 = 2;
    else if (c2 > 0) c2 = 1;

    const tunnit = parseFloat(document.getElementById("k4").value) || 0;
    // c3: unen kesto
    let c3 = 0;

    if (tunnit < 5) c3 = 3;
    else if (tunnit < 6) c3 = 2;
    else if (tunnit < 7) c3 = 1;

    const k1 = document.getElementById("k1").value;
    const k3 = document.getElementById("k3").value;
    // c4: unitehokkuus (nukuttu aika / sängyssä oloaika)
    let c4 = 0;

    if (k1 && k3 && tunnit) {
        const [bh, bm] = k1.split(":").map(Number);
        const [wh, wm] = k3.split(":").map(Number);

        let aika = (wh * 60 + wm) - (bh * 60 + bm);
        if (aika < 0) aika += 1440;

        const tehokkuus = (tunnit * 60 / aika) * 100;

        if (tehokkuus < 65) c4 = 3;
        else if (tehokkuus < 75) c4 = 2;
        else if (tehokkuus < 85) c4 = 1;
    }

    let hairiot = 0;

    for (let i = 2; i <= 3; i++) {
        hairiot += parseInt(document.querySelector(`input[name="b${i}"]:checked`)?.value || 0);
    }
    // c5: unihäiriöt
    let c5 = 0;

    if (hairiot > 6) c5 = 3;
    else if (hairiot > 3) c5 = 2;
    else if (hairiot > 0) c5 = 1;
    // c6: unilääkkeiden käyttö
    const c6 = parseInt(document.getElementById("k6").value);

    const vasy = parseInt(document.getElementById("k7").value) +
                 parseInt(document.getElementById("k8").value);
    // c7: päiväväsymys
    let c7 = 0;

    if (vasy > 4) c7 = 3;
    else if (vasy > 2) c7 = 2;
    else if (vasy > 0) c7 = 1;
    // summa, max 21. Yli 5p on huono unenlaatu
    const pisteet = c1 + c2 + c3 + c4 + c5 + c6 + c7;

    document.getElementById("tulos").textContent = pisteet + " / 21";

    document.getElementById("tulkinta").textContent =
        pisteet <= 5 ? "Hyvä unenlaatu" : "Huono unenlaatu";

    goTo("Valmis");
}

// Hakee käyttäjän nimen joka on local storagessa, jos nimeä ei ole niin ohjelma antaa käyttäjälle nimen "vieras"
// Käyttäjän nimi (joka on vain sähköposti osoite) näytetään sivun oikeassa yläkulmassa
let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';