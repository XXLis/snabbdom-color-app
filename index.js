// index.js
import render from './framework/render.js';
import createElement from './framework/element.js';

// Beschikbare teksten voor de introductie van een kleur
const INTRO_TEXTS = [
  "Bekijk deze nieuwe kleur!",
  "Ik heb een nieuwe kleur gevonden, kijk zelf maar!",
  "Zie hier, een verse kleur speciaal voor jou!",
  "Nieuwe kleur ontgrendeld! ✨",
  "Hier is een prachtige nieuwe tint!",
  "Vers van de pers: een nieuwe kleur!"
];

/**
 * Genereert een willekeurige hex-kleurcode.
 */
function getRandomColor() {
  const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  return `#${hex}`.toUpperCase();
}

/**
 * Kiest een willekeurige introductietekst uit de lijst.
 */
function getRandomIntro() {
  return INTRO_TEXTS[Math.floor(Math.random() * INTRO_TEXTS.length)];
}

// Applicatiebeheer (State) - Voorkomt onnodig lezen van de harde schijf
let state = {
  colors: loadInitialData()
};

/**
 * Laadt de eerste gegevens uit localStorage of genereert een startset.
 */
function loadInitialData() {
  const saved = localStorage.getItem('randomColors');
  if (saved) return JSON.parse(saved);

  // Maak 3 startkleuren aan als er nog niets is opgeslagen
  const initial = Array.from({ length: 3 }, () => ({
    id: crypto.randomUUID(), // Unieke ID voor betere rendering
    color: getRandomColor(),
    intro: getRandomIntro()
  }));

  saveToStorage(initial);
  return initial;
}

/**
 * Slaat de huidige lijst met kleuren op in de browser.
 */
function saveToStorage(data) {
  localStorage.setItem('randomColors', JSON.stringify(data));
}

/**
 * Voegt een nieuwe kleur toe aan het begin van de lijst.
 */
function addNewColor() {
  state.colors = [{
    id: crypto.randomUUID(),
    color: getRandomColor(),
    intro: getRandomIntro()
  }, ...state.colors];
  
  saveToStorage(state.colors);
  renderApp(); // Update de interface
}

/**
 * Component voor het weergeven van een individueel kleurblok.
 */
function ColorBox({ color, intro }) {
  return createElement('div', { className: 'color-box' },
    createElement('div', { className: 'intro' }, intro),
    createElement('div', {
      style: { backgroundColor: color, height: '100%' }
    },
      createElement('div', { className: 'hex-big' }, color),
      createElement('div', { className: 'hex-small' }, color)
    )
  );
}

/**
 * Hoofdcomponent van de applicatie.
 */
function App() {
  return createElement('div', { id: 'app' },
    createElement('header', {},
      createElement('h1', {}, 'Willekeurige Kleuren'),
      createElement('button', {
        className: 'btn',
        onClick: addNewColor
      }, 'Nieuwe kleur ophalen')
    ),
    // Gebruik de unieke ID als key voor optimale prestaties
    ...state.colors.map((item) =>
      ColorBox({
        key: item.id,
        color: item.color,
        intro: item.intro
      })
    )
  );
}

/**
 * Tekent de applicatie in de DOM.
 */
function renderApp() {
  const root = document.getElementById('app');
  render(App(), root);
}

// Start de applicatie
renderApp();
