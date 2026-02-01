// framework/render.js
import { init } from '../libs/snabbdom/snabbdom.esm.js';
import classModule from '../libs/snabbdom/modules/class.js';
import propsModule from '../libs/snabbdom/modules/props.js';
import styleModule from '../libs/snabbdom/modules/style.js';
import eventlisteners from '../libs/snabbdom/modules/eventlisteners.js';

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventlisteners
]);

let previousVnode = null;

export default function render(vnode, container) {
  if (previousVnode === null) {

    container.innerHTML = '';
    previousVnode = patch(container, vnode);
  } else {
    previousVnode = patch(previousVnode, vnode);
  }
}