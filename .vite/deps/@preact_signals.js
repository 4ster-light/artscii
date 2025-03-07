// node_modules/.deno/preact@10.19.3/node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c = {};
var s = [];
var a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var h = Array.isArray;
function v(n3, l5) {
  for (var u4 in l5) n3[u4] = l5[u4];
  return n3;
}
function p(n3) {
  var l5 = n3.parentNode;
  l5 && l5.removeChild(n3);
}
function d(n3, t4, i4, o4, r4) {
  var f4 = { type: n3, props: t4, key: i4, ref: o4, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r4 ? ++u : r4, __i: -1, __u: 0 };
  return null == r4 && null != l.vnode && l.vnode(f4), f4;
}
function g(n3) {
  return n3.children;
}
function b(n3, l5) {
  this.props = n3, this.context = l5;
}
function m(n3, l5) {
  if (null == l5) return n3.__ ? m(n3.__, n3.__i + 1) : null;
  for (var u4; l5 < n3.__k.length; l5++) if (null != (u4 = n3.__k[l5]) && null != u4.__e) return u4.__e;
  return "function" == typeof n3.type ? m(n3) : null;
}
function k(n3) {
  var l5, u4;
  if (null != (n3 = n3.__) && null != n3.__c) {
    for (n3.__e = n3.__c.base = null, l5 = 0; l5 < n3.__k.length; l5++) if (null != (u4 = n3.__k[l5]) && null != u4.__e) {
      n3.__e = n3.__c.base = u4.__e;
      break;
    }
    return k(n3);
  }
}
function w(n3) {
  (!n3.__d && (n3.__d = true) && i.push(n3) && !x.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(x);
}
function x() {
  var n3, u4, t4, o4, r4, e4, c4, s4, a4;
  for (i.sort(f); n3 = i.shift(); ) n3.__d && (u4 = i.length, o4 = void 0, e4 = (r4 = (t4 = n3).__v).__e, s4 = [], a4 = [], (c4 = t4.__P) && ((o4 = v({}, r4)).__v = r4.__v + 1, l.vnode && l.vnode(o4), L(c4, o4, r4, t4.__n, void 0 !== c4.ownerSVGElement, 32 & r4.__u ? [e4] : null, s4, null == e4 ? m(r4) : e4, !!(32 & r4.__u), a4), o4.__.__k[o4.__i] = o4, M(s4, o4, a4), o4.__e != e4 && k(o4)), i.length > u4 && i.sort(f));
  x.__r = 0;
}
function C(n3, l5, u4, t4, i4, o4, r4, f4, e4, a4, h3) {
  var v5, p5, y2, d5, _4, g4 = t4 && t4.__k || s, b4 = l5.length;
  for (u4.__d = e4, P(u4, l5, g4), e4 = u4.__d, v5 = 0; v5 < b4; v5++) null != (y2 = u4.__k[v5]) && "boolean" != typeof y2 && "function" != typeof y2 && (p5 = -1 === y2.__i ? c : g4[y2.__i] || c, y2.__i = v5, L(n3, y2, p5, i4, o4, r4, f4, e4, a4, h3), d5 = y2.__e, y2.ref && p5.ref != y2.ref && (p5.ref && z(p5.ref, null, y2), h3.push(y2.ref, y2.__c || d5, y2)), null == _4 && null != d5 && (_4 = d5), 65536 & y2.__u || p5.__k === y2.__k ? e4 = S(y2, e4, n3) : "function" == typeof y2.type && void 0 !== y2.__d ? e4 = y2.__d : d5 && (e4 = d5.nextSibling), y2.__d = void 0, y2.__u &= -196609);
  u4.__d = e4, u4.__e = _4;
}
function P(n3, l5, u4) {
  var t4, i4, o4, r4, f4, e4 = l5.length, c4 = u4.length, s4 = c4, a4 = 0;
  for (n3.__k = [], t4 = 0; t4 < e4; t4++) null != (i4 = n3.__k[t4] = null == (i4 = l5[t4]) || "boolean" == typeof i4 || "function" == typeof i4 ? null : "string" == typeof i4 || "number" == typeof i4 || "bigint" == typeof i4 || i4.constructor == String ? d(null, i4, null, null, i4) : h(i4) ? d(g, { children: i4 }, null, null, null) : void 0 === i4.constructor && i4.__b > 0 ? d(i4.type, i4.props, i4.key, i4.ref ? i4.ref : null, i4.__v) : i4) ? (i4.__ = n3, i4.__b = n3.__b + 1, f4 = H(i4, u4, r4 = t4 + a4, s4), i4.__i = f4, o4 = null, -1 !== f4 && (s4--, (o4 = u4[f4]) && (o4.__u |= 131072)), null == o4 || null === o4.__v ? (-1 == f4 && a4--, "function" != typeof i4.type && (i4.__u |= 65536)) : f4 !== r4 && (f4 === r4 + 1 ? a4++ : f4 > r4 ? s4 > e4 - r4 ? a4 += f4 - r4 : a4-- : a4 = f4 < r4 && f4 == r4 - 1 ? f4 - r4 : 0, f4 !== t4 + a4 && (i4.__u |= 65536))) : (o4 = u4[t4]) && null == o4.key && o4.__e && (o4.__e == n3.__d && (n3.__d = m(o4)), N(o4, o4, false), u4[t4] = null, s4--);
  if (s4) for (t4 = 0; t4 < c4; t4++) null != (o4 = u4[t4]) && 0 == (131072 & o4.__u) && (o4.__e == n3.__d && (n3.__d = m(o4)), N(o4, o4));
}
function S(n3, l5, u4) {
  var t4, i4;
  if ("function" == typeof n3.type) {
    for (t4 = n3.__k, i4 = 0; t4 && i4 < t4.length; i4++) t4[i4] && (t4[i4].__ = n3, l5 = S(t4[i4], l5, u4));
    return l5;
  }
  return n3.__e != l5 && (u4.insertBefore(n3.__e, l5 || null), l5 = n3.__e), l5 && l5.nextSibling;
}
function H(n3, l5, u4, t4) {
  var i4 = n3.key, o4 = n3.type, r4 = u4 - 1, f4 = u4 + 1, e4 = l5[u4];
  if (null === e4 || e4 && i4 == e4.key && o4 === e4.type) return u4;
  if (t4 > (null != e4 && 0 == (131072 & e4.__u) ? 1 : 0)) for (; r4 >= 0 || f4 < l5.length; ) {
    if (r4 >= 0) {
      if ((e4 = l5[r4]) && 0 == (131072 & e4.__u) && i4 == e4.key && o4 === e4.type) return r4;
      r4--;
    }
    if (f4 < l5.length) {
      if ((e4 = l5[f4]) && 0 == (131072 & e4.__u) && i4 == e4.key && o4 === e4.type) return f4;
      f4++;
    }
  }
  return -1;
}
function I(n3, l5, u4) {
  "-" === l5[0] ? n3.setProperty(l5, null == u4 ? "" : u4) : n3[l5] = null == u4 ? "" : "number" != typeof u4 || a.test(l5) ? u4 : u4 + "px";
}
function T(n3, l5, u4, t4, i4) {
  var o4;
  n: if ("style" === l5) if ("string" == typeof u4) n3.style.cssText = u4;
  else {
    if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l5 in t4) u4 && l5 in u4 || I(n3.style, l5, "");
    if (u4) for (l5 in u4) t4 && u4[l5] === t4[l5] || I(n3.style, l5, u4[l5]);
  }
  else if ("o" === l5[0] && "n" === l5[1]) o4 = l5 !== (l5 = l5.replace(/(PointerCapture)$|Capture$/, "$1")), l5 = l5.toLowerCase() in n3 ? l5.toLowerCase().slice(2) : l5.slice(2), n3.l || (n3.l = {}), n3.l[l5 + o4] = u4, u4 ? t4 ? u4.u = t4.u : (u4.u = Date.now(), n3.addEventListener(l5, o4 ? D : A, o4)) : n3.removeEventListener(l5, o4 ? D : A, o4);
  else {
    if (i4) l5 = l5.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" !== l5 && "height" !== l5 && "href" !== l5 && "list" !== l5 && "form" !== l5 && "tabIndex" !== l5 && "download" !== l5 && "rowSpan" !== l5 && "colSpan" !== l5 && "role" !== l5 && l5 in n3) try {
      n3[l5] = null == u4 ? "" : u4;
      break n;
    } catch (n4) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" !== l5[4] ? n3.removeAttribute(l5) : n3.setAttribute(l5, u4));
  }
}
function A(n3) {
  var u4 = this.l[n3.type + false];
  if (n3.t) {
    if (n3.t <= u4.u) return;
  } else n3.t = Date.now();
  return u4(l.event ? l.event(n3) : n3);
}
function D(n3) {
  return this.l[n3.type + true](l.event ? l.event(n3) : n3);
}
function L(n3, u4, t4, i4, o4, r4, f4, e4, c4, s4) {
  var a4, p5, y2, d5, _4, m3, k3, w4, x2, P2, S2, $, H2, I2, T2, A2 = u4.type;
  if (void 0 !== u4.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), r4 = [e4 = u4.__e = t4.__e]), (a4 = l.__b) && a4(u4);
  n: if ("function" == typeof A2) try {
    if (w4 = u4.props, x2 = (a4 = A2.contextType) && i4[a4.__c], P2 = a4 ? x2 ? x2.props.value : a4.__ : i4, t4.__c ? k3 = (p5 = u4.__c = t4.__c).__ = p5.__E : ("prototype" in A2 && A2.prototype.render ? u4.__c = p5 = new A2(w4, P2) : (u4.__c = p5 = new b(w4, P2), p5.constructor = A2, p5.render = O), x2 && x2.sub(p5), p5.props = w4, p5.state || (p5.state = {}), p5.context = P2, p5.__n = i4, y2 = p5.__d = true, p5.__h = [], p5._sb = []), null == p5.__s && (p5.__s = p5.state), null != A2.getDerivedStateFromProps && (p5.__s == p5.state && (p5.__s = v({}, p5.__s)), v(p5.__s, A2.getDerivedStateFromProps(w4, p5.__s))), d5 = p5.props, _4 = p5.state, p5.__v = u4, y2) null == A2.getDerivedStateFromProps && null != p5.componentWillMount && p5.componentWillMount(), null != p5.componentDidMount && p5.__h.push(p5.componentDidMount);
    else {
      if (null == A2.getDerivedStateFromProps && w4 !== d5 && null != p5.componentWillReceiveProps && p5.componentWillReceiveProps(w4, P2), !p5.__e && (null != p5.shouldComponentUpdate && false === p5.shouldComponentUpdate(w4, p5.__s, P2) || u4.__v === t4.__v)) {
        for (u4.__v !== t4.__v && (p5.props = w4, p5.state = p5.__s, p5.__d = false), u4.__e = t4.__e, u4.__k = t4.__k, u4.__k.forEach(function(n4) {
          n4 && (n4.__ = u4);
        }), S2 = 0; S2 < p5._sb.length; S2++) p5.__h.push(p5._sb[S2]);
        p5._sb = [], p5.__h.length && f4.push(p5);
        break n;
      }
      null != p5.componentWillUpdate && p5.componentWillUpdate(w4, p5.__s, P2), null != p5.componentDidUpdate && p5.__h.push(function() {
        p5.componentDidUpdate(d5, _4, m3);
      });
    }
    if (p5.context = P2, p5.props = w4, p5.__P = n3, p5.__e = false, $ = l.__r, H2 = 0, "prototype" in A2 && A2.prototype.render) {
      for (p5.state = p5.__s, p5.__d = false, $ && $(u4), a4 = p5.render(p5.props, p5.state, p5.context), I2 = 0; I2 < p5._sb.length; I2++) p5.__h.push(p5._sb[I2]);
      p5._sb = [];
    } else do {
      p5.__d = false, $ && $(u4), a4 = p5.render(p5.props, p5.state, p5.context), p5.state = p5.__s;
    } while (p5.__d && ++H2 < 25);
    p5.state = p5.__s, null != p5.getChildContext && (i4 = v(v({}, i4), p5.getChildContext())), y2 || null == p5.getSnapshotBeforeUpdate || (m3 = p5.getSnapshotBeforeUpdate(d5, _4)), C(n3, h(T2 = null != a4 && a4.type === g && null == a4.key ? a4.props.children : a4) ? T2 : [T2], u4, t4, i4, o4, r4, f4, e4, c4, s4), p5.base = u4.__e, u4.__u &= -161, p5.__h.length && f4.push(p5), k3 && (p5.__E = p5.__ = null);
  } catch (n4) {
    u4.__v = null, c4 || null != r4 ? (u4.__e = e4, u4.__u |= c4 ? 160 : 32, r4[r4.indexOf(e4)] = null) : (u4.__e = t4.__e, u4.__k = t4.__k), l.__e(n4, u4, t4);
  }
  else null == r4 && u4.__v === t4.__v ? (u4.__k = t4.__k, u4.__e = t4.__e) : u4.__e = j(t4.__e, u4, t4, i4, o4, r4, f4, c4, s4);
  (a4 = l.diffed) && a4(u4);
}
function M(n3, u4, t4) {
  u4.__d = void 0;
  for (var i4 = 0; i4 < t4.length; i4++) z(t4[i4], t4[++i4], t4[++i4]);
  l.__c && l.__c(u4, n3), n3.some(function(u5) {
    try {
      n3 = u5.__h, u5.__h = [], n3.some(function(n4) {
        n4.call(u5);
      });
    } catch (n4) {
      l.__e(n4, u5.__v);
    }
  });
}
function j(l5, u4, t4, i4, o4, r4, f4, e4, s4) {
  var a4, v5, y2, d5, _4, g4, b4, k3 = t4.props, w4 = u4.props, x2 = u4.type;
  if ("svg" === x2 && (o4 = true), null != r4) {
    for (a4 = 0; a4 < r4.length; a4++) if ((_4 = r4[a4]) && "setAttribute" in _4 == !!x2 && (x2 ? _4.localName === x2 : 3 === _4.nodeType)) {
      l5 = _4, r4[a4] = null;
      break;
    }
  }
  if (null == l5) {
    if (null === x2) return document.createTextNode(w4);
    l5 = o4 ? document.createElementNS("http://www.w3.org/2000/svg", x2) : document.createElement(x2, w4.is && w4), r4 = null, e4 = false;
  }
  if (null === x2) k3 === w4 || e4 && l5.data === w4 || (l5.data = w4);
  else {
    if (r4 = r4 && n.call(l5.childNodes), k3 = t4.props || c, !e4 && null != r4) for (k3 = {}, a4 = 0; a4 < l5.attributes.length; a4++) k3[(_4 = l5.attributes[a4]).name] = _4.value;
    for (a4 in k3) _4 = k3[a4], "children" == a4 || ("dangerouslySetInnerHTML" == a4 ? y2 = _4 : "key" === a4 || a4 in w4 || T(l5, a4, null, _4, o4));
    for (a4 in w4) _4 = w4[a4], "children" == a4 ? d5 = _4 : "dangerouslySetInnerHTML" == a4 ? v5 = _4 : "value" == a4 ? g4 = _4 : "checked" == a4 ? b4 = _4 : "key" === a4 || e4 && "function" != typeof _4 || k3[a4] === _4 || T(l5, a4, _4, k3[a4], o4);
    if (v5) e4 || y2 && (v5.__html === y2.__html || v5.__html === l5.innerHTML) || (l5.innerHTML = v5.__html), u4.__k = [];
    else if (y2 && (l5.innerHTML = ""), C(l5, h(d5) ? d5 : [d5], u4, t4, i4, o4 && "foreignObject" !== x2, r4, f4, r4 ? r4[0] : t4.__k && m(t4, 0), e4, s4), null != r4) for (a4 = r4.length; a4--; ) null != r4[a4] && p(r4[a4]);
    e4 || (a4 = "value", void 0 !== g4 && (g4 !== l5[a4] || "progress" === x2 && !g4 || "option" === x2 && g4 !== k3[a4]) && T(l5, a4, g4, k3[a4], false), a4 = "checked", void 0 !== b4 && b4 !== l5[a4] && T(l5, a4, b4, k3[a4], false));
  }
  return l5;
}
function z(n3, u4, t4) {
  try {
    "function" == typeof n3 ? n3(u4) : n3.current = u4;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function N(n3, u4, t4) {
  var i4, o4;
  if (l.unmount && l.unmount(n3), (i4 = n3.ref) && (i4.current && i4.current !== n3.__e || z(i4, null, u4)), null != (i4 = n3.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n4) {
      l.__e(n4, u4);
    }
    i4.base = i4.__P = null, n3.__c = void 0;
  }
  if (i4 = n3.__k) for (o4 = 0; o4 < i4.length; o4++) i4[o4] && N(i4[o4], u4, t4 || "function" != typeof n3.type);
  t4 || null == n3.__e || p(n3.__e), n3.__ = n3.__e = n3.__d = void 0;
}
function O(n3, l5, u4) {
  return this.constructor(n3, u4);
}
n = s.slice, l = { __e: function(n3, l5, u4, t4) {
  for (var i4, o4, r4; l5 = l5.__; ) if ((i4 = l5.__c) && !i4.__) try {
    if ((o4 = i4.constructor) && null != o4.getDerivedStateFromError && (i4.setState(o4.getDerivedStateFromError(n3)), r4 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n3, t4 || {}), r4 = i4.__d), r4) return i4.__E = i4;
  } catch (l6) {
    n3 = l6;
  }
  throw n3;
} }, u = 0, t = function(n3) {
  return null != n3 && null == n3.constructor;
}, b.prototype.setState = function(n3, l5) {
  var u4;
  u4 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v({}, this.state), "function" == typeof n3 && (n3 = n3(v({}, u4), this.props)), n3 && v(u4, n3), null != n3 && this.__v && (l5 && this._sb.push(l5), w(this));
}, b.prototype.forceUpdate = function(n3) {
  this.__v && (this.__e = true, n3 && this.__h.push(n3), w(this));
}, b.prototype.render = g, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n3, l5) {
  return n3.__v.__b - l5.__v.__b;
}, x.__r = 0, e = 0;

// node_modules/.deno/preact@10.19.3/node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = [];
var e2 = l.__b;
var a2 = l.__r;
var v2 = l.diffed;
var l2 = l.__c;
var m2 = l.unmount;
function d2(t4, u4) {
  l.__h && l.__h(r2, t4, o2 || u4), o2 = 0;
  var i4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return t4 >= i4.__.length && i4.__.push({ __V: c2 }), i4.__[t4];
}
function p2(u4, i4) {
  var o4 = d2(t2++, 3);
  !l.__s && z2(o4.__H, i4) && (o4.__ = u4, o4.i = i4, r2.__H.__h.push(o4));
}
function _(n3) {
  return o2 = 5, F(function() {
    return { current: n3 };
  }, []);
}
function F(n3, r4) {
  var u4 = d2(t2++, 7);
  return z2(u4.__H, r4) ? (u4.__V = n3(), u4.i = r4, u4.__h = n3, u4.__V) : u4.__;
}
function b2() {
  for (var t4; t4 = f2.shift(); ) if (t4.__P && t4.__H) try {
    t4.__H.__h.forEach(k2), t4.__H.__h.forEach(w2), t4.__H.__h = [];
  } catch (r4) {
    t4.__H.__h = [], l.__e(r4, t4.__v);
  }
}
l.__b = function(n3) {
  r2 = null, e2 && e2(n3);
}, l.__r = function(n3) {
  a2 && a2(n3), t2 = 0;
  var i4 = (r2 = n3.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n4) {
    n4.__N && (n4.__ = n4.__N), n4.__V = c2, n4.__N = n4.i = void 0;
  })) : (i4.__h.forEach(k2), i4.__h.forEach(w2), i4.__h = [], t2 = 0)), u2 = r2;
}, l.diffed = function(t4) {
  v2 && v2(t4);
  var o4 = t4.__c;
  o4 && o4.__H && (o4.__H.__h.length && (1 !== f2.push(o4) && i2 === l.requestAnimationFrame || ((i2 = l.requestAnimationFrame) || j2)(b2)), o4.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.__V !== c2 && (n3.__ = n3.__V), n3.i = void 0, n3.__V = c2;
  })), u2 = r2 = null;
}, l.__c = function(t4, r4) {
  r4.some(function(t5) {
    try {
      t5.__h.forEach(k2), t5.__h = t5.__h.filter(function(n3) {
        return !n3.__ || w2(n3);
      });
    } catch (u4) {
      r4.some(function(n3) {
        n3.__h && (n3.__h = []);
      }), r4 = [], l.__e(u4, t5.__v);
    }
  }), l2 && l2(t4, r4);
}, l.unmount = function(t4) {
  m2 && m2(t4);
  var r4, u4 = t4.__c;
  u4 && u4.__H && (u4.__H.__.forEach(function(n3) {
    try {
      k2(n3);
    } catch (n4) {
      r4 = n4;
    }
  }), u4.__H = void 0, r4 && l.__e(r4, u4.__v));
};
var g2 = "function" == typeof requestAnimationFrame;
function j2(n3) {
  var t4, r4 = function() {
    clearTimeout(u4), g2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u4 = setTimeout(r4, 100);
  g2 && (t4 = requestAnimationFrame(r4));
}
function k2(n3) {
  var t4 = r2, u4 = n3.__c;
  "function" == typeof u4 && (n3.__c = void 0, u4()), r2 = t4;
}
function w2(n3) {
  var t4 = r2;
  n3.__c = n3.__(), r2 = t4;
}
function z2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
    return t5 !== n3[r4];
  });
}

// node_modules/.deno/@preact+signals-core@1.8.0/node_modules/@preact/signals-core/dist/signals-core.module.js
var i3 = Symbol.for("preact-signals");
function t3() {
  if (!(s2 > 1)) {
    var i4, t4 = false;
    while (void 0 !== h2) {
      var r4 = h2;
      h2 = void 0;
      f3++;
      while (void 0 !== r4) {
        var o4 = r4.o;
        r4.o = void 0;
        r4.f &= -3;
        if (!(8 & r4.f) && c3(r4)) try {
          r4.c();
        } catch (r5) {
          if (!t4) {
            i4 = r5;
            t4 = true;
          }
        }
        r4 = o4;
      }
    }
    f3 = 0;
    s2--;
    if (t4) throw i4;
  } else s2--;
}
function r3(i4) {
  if (s2 > 0) return i4();
  s2++;
  try {
    return i4();
  } finally {
    t3();
  }
}
var o3 = void 0;
function n2(i4) {
  var t4 = o3;
  o3 = void 0;
  try {
    return i4();
  } finally {
    o3 = t4;
  }
}
var h2 = void 0;
var s2 = 0;
var f3 = 0;
var v3 = 0;
function e3(i4) {
  if (void 0 !== o3) {
    var t4 = i4.n;
    if (void 0 === t4 || t4.t !== o3) {
      t4 = { i: 0, S: i4, p: o3.s, n: void 0, t: o3, e: void 0, x: void 0, r: t4 };
      if (void 0 !== o3.s) o3.s.n = t4;
      o3.s = t4;
      i4.n = t4;
      if (32 & o3.f) i4.S(t4);
      return t4;
    } else if (-1 === t4.i) {
      t4.i = 0;
      if (void 0 !== t4.n) {
        t4.n.p = t4.p;
        if (void 0 !== t4.p) t4.p.n = t4.n;
        t4.p = o3.s;
        t4.n = void 0;
        o3.s.n = t4;
        o3.s = t4;
      }
      return t4;
    }
  }
}
function u3(i4) {
  this.v = i4;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
}
u3.prototype.brand = i3;
u3.prototype.h = function() {
  return true;
};
u3.prototype.S = function(i4) {
  if (this.t !== i4 && void 0 === i4.e) {
    i4.x = this.t;
    if (void 0 !== this.t) this.t.e = i4;
    this.t = i4;
  }
};
u3.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    var t4 = i4.e, r4 = i4.x;
    if (void 0 !== t4) {
      t4.x = r4;
      i4.e = void 0;
    }
    if (void 0 !== r4) {
      r4.e = t4;
      i4.x = void 0;
    }
    if (i4 === this.t) this.t = r4;
  }
};
u3.prototype.subscribe = function(i4) {
  var t4 = this;
  return E(function() {
    var r4 = t4.value, n3 = o3;
    o3 = void 0;
    try {
      i4(r4);
    } finally {
      o3 = n3;
    }
  });
};
u3.prototype.valueOf = function() {
  return this.value;
};
u3.prototype.toString = function() {
  return this.value + "";
};
u3.prototype.toJSON = function() {
  return this.value;
};
u3.prototype.peek = function() {
  var i4 = o3;
  o3 = void 0;
  try {
    return this.value;
  } finally {
    o3 = i4;
  }
};
Object.defineProperty(u3.prototype, "value", { get: function() {
  var i4 = e3(this);
  if (void 0 !== i4) i4.i = this.i;
  return this.v;
}, set: function(i4) {
  if (i4 !== this.v) {
    if (f3 > 100) throw new Error("Cycle detected");
    this.v = i4;
    this.i++;
    v3++;
    s2++;
    try {
      for (var r4 = this.t; void 0 !== r4; r4 = r4.x) r4.t.N();
    } finally {
      t3();
    }
  }
} });
function d3(i4) {
  return new u3(i4);
}
function c3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i) return true;
  return false;
}
function a3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) {
    var r4 = t4.S.n;
    if (void 0 !== r4) t4.r = r4;
    t4.S.n = t4;
    t4.i = -1;
    if (void 0 === t4.n) {
      i4.s = t4;
      break;
    }
  }
}
function l3(i4) {
  var t4 = i4.s, r4 = void 0;
  while (void 0 !== t4) {
    var o4 = t4.p;
    if (-1 === t4.i) {
      t4.S.U(t4);
      if (void 0 !== o4) o4.n = t4.n;
      if (void 0 !== t4.n) t4.n.p = o4;
    } else r4 = t4;
    t4.S.n = t4.r;
    if (void 0 !== t4.r) t4.r = void 0;
    t4 = o4;
  }
  i4.s = r4;
}
function y(i4) {
  u3.call(this, void 0);
  this.x = i4;
  this.s = void 0;
  this.g = v3 - 1;
  this.f = 4;
}
(y.prototype = new u3()).h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === v3) return true;
  this.g = v3;
  this.f |= 1;
  if (this.i > 0 && !c3(this)) {
    this.f &= -2;
    return true;
  }
  var i4 = o3;
  try {
    a3(this);
    o3 = this;
    var t4 = this.x();
    if (16 & this.f || this.v !== t4 || 0 === this.i) {
      this.v = t4;
      this.f &= -17;
      this.i++;
    }
  } catch (i5) {
    this.v = i5;
    this.f |= 16;
    this.i++;
  }
  o3 = i4;
  l3(this);
  this.f &= -2;
  return true;
};
y.prototype.S = function(i4) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.S(t4);
  }
  u3.prototype.S.call(this, i4);
};
y.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    u3.prototype.U.call(this, i4);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t4 = this.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
    }
  }
};
y.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i4 = this.t; void 0 !== i4; i4 = i4.x) i4.t.N();
  }
};
Object.defineProperty(y.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i4 = e3(this);
  this.h();
  if (void 0 !== i4) i4.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function w3(i4) {
  return new y(i4);
}
function _2(i4) {
  var r4 = i4.u;
  i4.u = void 0;
  if ("function" == typeof r4) {
    s2++;
    var n3 = o3;
    o3 = void 0;
    try {
      r4();
    } catch (t4) {
      i4.f &= -2;
      i4.f |= 8;
      g3(i4);
      throw t4;
    } finally {
      o3 = n3;
      t3();
    }
  }
}
function g3(i4) {
  for (var t4 = i4.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
  i4.x = void 0;
  i4.s = void 0;
  _2(i4);
}
function p3(i4) {
  if (o3 !== this) throw new Error("Out-of-order effect");
  l3(this);
  o3 = i4;
  this.f &= -2;
  if (8 & this.f) g3(this);
  t3();
}
function b3(i4) {
  this.x = i4;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
}
b3.prototype.c = function() {
  var i4 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t4 = this.x();
    if ("function" == typeof t4) this.u = t4;
  } finally {
    i4();
  }
};
b3.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _2(this);
  a3(this);
  s2++;
  var i4 = o3;
  o3 = this;
  return p3.bind(this, i4);
};
b3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h2;
    h2 = this;
  }
};
b3.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) g3(this);
};
function E(i4) {
  var t4 = new b3(i4);
  try {
    t4.c();
  } catch (i5) {
    t4.d();
    throw i5;
  }
  return t4.d.bind(t4);
}

// node_modules/.deno/@preact+signals@1.2.2/node_modules/@preact/signals/dist/signals.module.js
var v4;
var s3;
function l4(n3, i4) {
  l[n3] = i4.bind(null, l[n3] || function() {
  });
}
function d4(n3) {
  if (s3) s3();
  s3 = n3 && n3.S();
}
function p4(n3) {
  var r4 = this, f4 = n3.data, o4 = useSignal(f4);
  o4.value = f4;
  var e4 = F(function() {
    var n4 = r4.__v;
    while (n4 = n4.__) if (n4.__c) {
      n4.__c.__$f |= 4;
      break;
    }
    r4.__$u.c = function() {
      var n5;
      if (!t(e4.peek()) && 3 === (null == (n5 = r4.base) ? void 0 : n5.nodeType)) r4.base.data = e4.peek();
      else {
        r4.__$f |= 1;
        r4.setState({});
      }
    };
    return w3(function() {
      var n5 = o4.value.value;
      return 0 === n5 ? 0 : true === n5 ? "" : n5 || "";
    });
  }, []);
  return e4.value;
}
p4.displayName = "_st";
Object.defineProperties(u3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: p4 }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l4("__b", function(n3, r4) {
  if ("string" == typeof r4.type) {
    var i4, t4 = r4.props;
    for (var f4 in t4) if ("children" !== f4) {
      var o4 = t4[f4];
      if (o4 instanceof u3) {
        if (!i4) r4.__np = i4 = {};
        i4[f4] = o4;
        t4[f4] = o4.peek();
      }
    }
  }
  n3(r4);
});
l4("__r", function(n3, r4) {
  d4();
  var i4, t4 = r4.__c;
  if (t4) {
    t4.__$f &= -2;
    if (void 0 === (i4 = t4.__$u)) t4.__$u = i4 = function(n4) {
      var r5;
      E(function() {
        r5 = this;
      });
      r5.c = function() {
        t4.__$f |= 1;
        t4.setState({});
      };
      return r5;
    }();
  }
  v4 = t4;
  d4(i4);
  n3(r4);
});
l4("__e", function(n3, r4, i4, t4) {
  d4();
  v4 = void 0;
  n3(r4, i4, t4);
});
l4("diffed", function(n3, r4) {
  d4();
  v4 = void 0;
  var i4;
  if ("string" == typeof r4.type && (i4 = r4.__e)) {
    var t4 = r4.__np, f4 = r4.props;
    if (t4) {
      var o4 = i4.U;
      if (o4) for (var e4 in o4) {
        var u4 = o4[e4];
        if (void 0 !== u4 && !(e4 in t4)) {
          u4.d();
          o4[e4] = void 0;
        }
      }
      else i4.U = o4 = {};
      for (var a4 in t4) {
        var c4 = o4[a4], s4 = t4[a4];
        if (void 0 === c4) {
          c4 = _3(i4, a4, s4, f4);
          o4[a4] = c4;
        } else c4.o(s4, f4);
      }
    }
  }
  n3(r4);
});
function _3(n3, r4, i4, t4) {
  var f4 = r4 in n3 && void 0 === n3.ownerSVGElement, o4 = d3(i4);
  return { o: function(n4, r5) {
    o4.value = n4;
    t4 = r5;
  }, d: E(function() {
    var i5 = o4.value.value;
    if (t4[r4] !== i5) {
      t4[r4] = i5;
      if (f4) n3[r4] = i5;
      else if (i5) n3.setAttribute(r4, i5);
      else n3.removeAttribute(r4);
    }
  }) };
}
l4("unmount", function(n3, r4) {
  if ("string" == typeof r4.type) {
    var i4 = r4.__e;
    if (i4) {
      var t4 = i4.U;
      if (t4) {
        i4.U = void 0;
        for (var f4 in t4) {
          var o4 = t4[f4];
          if (o4) o4.d();
        }
      }
    }
  } else {
    var e4 = r4.__c;
    if (e4) {
      var u4 = e4.__$u;
      if (u4) {
        e4.__$u = void 0;
        u4.d();
      }
    }
  }
  n3(r4);
});
l4("__h", function(n3, r4, i4, t4) {
  if (t4 < 3 || 9 === t4) r4.__$f |= 2;
  n3(r4, i4, t4);
});
b.prototype.shouldComponentUpdate = function(n3, r4) {
  var i4 = this.__$u;
  if (!(i4 && void 0 !== i4.s || 4 & this.__$f)) return true;
  if (3 & this.__$f) return true;
  for (var t4 in r4) return true;
  for (var f4 in n3) if ("__source" !== f4 && n3[f4] !== this.props[f4]) return true;
  for (var o4 in this.props) if (!(o4 in n3)) return true;
  return false;
};
function useSignal(n3) {
  return F(function() {
    return d3(n3);
  }, []);
}
function useComputed(n3) {
  var r4 = _(n3);
  r4.current = n3;
  v4.__$f |= 4;
  return F(function() {
    return w3(function() {
      return r4.current();
    });
  }, []);
}
function useSignalEffect(n3) {
  var r4 = _(n3);
  r4.current = n3;
  p2(function() {
    return E(function() {
      return r4.current();
    });
  }, []);
}
export {
  u3 as Signal,
  r3 as batch,
  w3 as computed,
  E as effect,
  d3 as signal,
  n2 as untracked,
  useComputed,
  useSignal,
  useSignalEffect
};
//# sourceMappingURL=@preact_signals.js.map
