// index.js
import render from './framework/render.js';
import createElement from './framework/element.js';

const INTRO_TEXTS = [
  "Check out this new color!",
  "I've found a new color, check it out!",
  "Behold, a fresh color just for you!",
  "New color unlocked! ✨",
  "Here's a beautiful new shade!",
  "Fresh color just dropped!"
];

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function getRandomIntro() {
  return INTRO_TEXTS[Math.floor(Math.random() * INTRO_TEXTS.length)];
}

function loadColors() {
  const saved = localStorage.getItem('randomColors');
  if (saved) return JSON.parse(saved);

  const initial = Array.from({ length: 3 }, () => ({
    color: getRandomColor(),
    intro: getRandomIntro()
  }));

  localStorage.setItem('randomColors', JSON.stringify(initial));
  return initial;
}

function addNewColor() {
  const colors = loadColors();
  colors.unshift({
    color: getRandomColor(),
    intro: getRandomIntro()
  });
  localStorage.setItem('randomColors', JSON.stringify(colors));
  renderApp();
}

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

function App() {
  const colors = loadColors();

  return createElement('div', { id: 'app' },
    createElement('header', {},
      createElement('h1', {}, 'Random Colors'),
      createElement('button', {
        className: 'btn',
        onClick: addNewColor
      }, 'Get New Color')
    ),
    ...colors.map((item, index) =>
      ColorBox({
        key: `color-${index}`,
        color: item.color,
        intro: item.intro
      })
    )
  );
}

function renderApp() {
  render(App(), document.getElementById('app'));
}

// Start
renderApp();