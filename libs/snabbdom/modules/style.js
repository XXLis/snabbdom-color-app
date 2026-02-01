// Binding `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
const raf =
    typeof window !== 'undefined' && window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout;

const nextFrame = (fn) => {
    raf(() => {
        raf(fn);
    });
};

let reflowForced = false;

function setNextFrame(obj, prop, val) {
    nextFrame(() => {
        obj[prop] = val;
    });
}

function updateStyle(oldVnode, vnode) {
    let cur;
    let name;
    const elm = vnode.elm;
    let oldStyle = oldVnode.data.style;
    let style = vnode.data.style;

    if (!oldStyle && !style) {
        return;
    }
    if (oldStyle === style) {
        return;
    }

    oldStyle = oldStyle || {};
    style = style || {};
    const oldHasDel = 'delayed' in oldStyle;

    for (name in oldStyle) {
        if (Object.prototype.hasOwnProperty.call(oldStyle, name) && !(name in style)) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            } else {
                elm.style[name] = '';
            }
        }
    }

    for (name in style) {
        if (Object.prototype.hasOwnProperty.call(style, name)) {
            cur = style[name];
            if (name === 'delayed' && style.delayed) {
                for (const name2 in style.delayed) {
                    if (Object.prototype.hasOwnProperty.call(style.delayed, name2)) {
                        cur = style.delayed[name2];
                        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                            setNextFrame(elm.style, name2, cur);
                        }
                    }
                }
            } else if (name !== 'remove' && cur !== oldStyle[name]) {
                if (name[0] === '-' && name[1] === '-') {
                    elm.style.setProperty(name, cur);
                } else {
                    elm.style[name] = cur;
                }
            }
        }
    }
}

function applyDestroyStyle(vnode) {
    const elm = vnode.elm;
    const s = vnode.data.style;
    let style;
    let name;

    if (!s) {
        return;
    }
    style = s.destroy;
    if (!style) {
        return;
    }

    for (name in style) {
        if (Object.prototype.hasOwnProperty.call(style, name)) {
            elm.style[name] = style[name];
        }
    }
}

function applyRemoveStyle(vnode, rm) {
    const s = vnode.data.style;

    if (!s || !s.remove) {
        rm();
        return;
    }

    if (!reflowForced) {
        // Force reflow
        getComputedStyle(vnode.elm);
        reflowForced = true;
    }

    let name;
    const elm = vnode.elm;
    let i = 0;
    const style = s.remove;
    let amount = 0;
    const applied = [];

    for (name in style) {
        if (Object.prototype.hasOwnProperty.call(style, name)) {
            applied.push(name);
            elm.style[name] = style[name];
        }
    }

    const compStyle = getComputedStyle(elm);
    const props = compStyle['transition-property'].split(', ');

    for (; i < props.length; i += 1) {
        if (applied.indexOf(props[i]) !== -1) {
            amount += 1;
        }
    }

    elm.addEventListener('transitionend', (ev) => {
        if (ev.target === elm) {
            amount -= 1;
        }
        if (amount === 0) {
            rm();
        }
    });
}

function forceReflow() {
    reflowForced = false;
}

const styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle,
};

export default styleModule;