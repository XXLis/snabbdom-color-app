// framework/element.js
import { h } from '../libs/snabbdom/snabbdom.esm.js';

export default function createElement(tag, props = {}, ...children) {
  const data = {
    attrs: {},
    class: {},
    on: {},
    props: {},
    style: {}
  };

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && key !== 'on') {
      const event = key.slice(2).toLowerCase();
      data.on[event] = value;
    }
    else if (key === 'className' || key === 'class') {
      (typeof value === 'string' ? value.split(/\s+/) : [])
        .filter(Boolean)
        .forEach(cls => data.class[cls] = true);
    }
    else if (key === 'style') {
      if (typeof value === 'string') data.attrs.style = value;
      else if (value && typeof value === 'object') Object.assign(data.style, value);
    }
    else if (key === 'key') {
      data.key = value;
    }
    else {
      data.props[key] = value;
    }
  }

  const filteredChildren = children.flat().filter(child => child != null);

  console.log('createElement:', tag, 'children:', filteredChildren);

  return h(tag, data, filteredChildren);
}