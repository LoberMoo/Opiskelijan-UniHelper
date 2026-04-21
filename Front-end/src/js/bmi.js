
let name = localStorage.getItem('name');
document.querySelector('.username').textContent = name ? name :
'vieras';


// Navbar disappearing trick (scrollaa alas niin se katoaa ja ei ole edessä)
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-360px";
  }
  prevScrollpos = currentScrollPos;
}


const formi = document.querySelector('form');
const lopputulos = document.querySelector('#lopputulos')
const painoSyotto = document.querySelector('#weight');
const pituusSyotto = document.querySelector('#height');

formi.addEventListener('submit', (evt) => {
  console.log('Tehään taikuuksia');
  evt.preventDefault();

  const paino = Number(painoSyotto.value);
  const pituus = Number(pituusSyotto.value);

  laskelopputulos(paino, pituus);
});

const laskelopputulos = (paino, pituus) => {
  let vastaus = (paino / (pituus / 100) ** 2).toFixed(1);

  lopputulos.textContent = vastaus;
};
