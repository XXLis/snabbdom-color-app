// np. src/color.js
import createElement from '../framework/element.js';

export function ColorBox(props) {
  const { color = '#444444', intro = 'New color appeared!' } = props || {};

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