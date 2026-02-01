// Snabbdom core ES Module
export function h(sel, b, c) {
    var data = {}, children, text, i;
    if (arguments.length === 3) {
        data = b;
        if (c !== undefined) children = c;
    } else if (arguments.length === 2) {
        if (Array.isArray(b)) {
            children = b;
        } else if (b != null && typeof b === 'object') {
            data = b;
        } else {
            text = b;
        }
    }
    if (Array.isArray(children)) {
        for (i = 0; i < children.length; ++i) {
            if (typeof children[i] === 'string' || typeof children[i] === 'number')
                children[i] = h(undefined, undefined, children[i]);
        }
    }
    return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: undefined,
        key: data ? data.key : undefined
    };
}

export function init(modules) {
    function createElm(vnode) {
        if (vnode.sel === undefined) {
            vnode.elm = document.createTextNode(vnode.text);
            return vnode.elm;
        }
        var elm = vnode.elm = document.createElement(vnode.sel);
        var i, childVnodes = vnode.children;

        if (vnode.data && modules) {
            modules.forEach(function(m) {
                if (m.create) m.create({ data: {} }, vnode); 
            });
        }

        if (childVnodes) {
            for (i = 0; i < childVnodes.length; ++i) {
                var ch = childVnodes[i];
                if (ch != null) {
                    elm.appendChild(createElm(ch));
                }
            }
        } else if (vnode.text != null) {
            elm.appendChild(document.createTextNode(vnode.text));
        }
        return elm;
    }

    function patch(oldVnode, vnode) {
        if (oldVnode.nodeType) {
            const parent = oldVnode;
            parent.innerHTML = ''; 
            createElm(vnode);
            parent.appendChild(vnode.elm);
            return vnode;
        }
        if (oldVnode.elm && oldVnode.elm.parentNode) {
            createElm(vnode);
            oldVnode.elm.parentNode.replaceChild(vnode.elm, oldVnode.elm);
        }
        return vnode;
    }

    return patch;
}