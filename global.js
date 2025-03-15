"use strict";
(() => {
  var Tt = "4.0.14";
  var ke = 92,
    Ke = 47,
    Pe = 42,
    an = 34,
    sn = 39,
    un = 58,
    Ue = 59,
    le = 10,
    we = 32,
    _e = 9,
    Vt = 123,
    rt = 125,
    it = 40,
    Et = 41,
    cn = 91,
    fn = 93,
    Rt = 45,
    nt = 64,
    dn = 33;
  function pe(t) {
    t[0] === "\uFEFF" && (t = t.slice(1)),
      (t = t.replaceAll(
        `\r
    `,
        `
    `
      ));
    let r = [],
      n = [],
      e = [],
      o = null,
      s = null,
      l = "",
      p = "",
      f;
    for (let d = 0; d < t.length; d++) {
      let c = t.charCodeAt(d);
      if (c === ke) (l += t.slice(d, d + 2)), (d += 1);
      else if (c === Ke && t.charCodeAt(d + 1) === Pe) {
        let m = d;
        for (let y = d + 2; y < t.length; y++)
          if (((f = t.charCodeAt(y)), f === ke)) y += 1;
          else if (f === Pe && t.charCodeAt(y + 1) === Ke) {
            d = y + 1;
            break;
          }
        let g = t.slice(m, d + 1);
        g.charCodeAt(2) === dn && n.push(De(g.slice(2, -2)));
      } else if (c === sn || c === an) {
        let m = d;
        for (let g = d + 1; g < t.length; g++)
          if (((f = t.charCodeAt(g)), f === ke)) g += 1;
          else if (f === c) {
            d = g;
            break;
          } else {
            if (f === Ue && t.charCodeAt(g + 1) === le)
              throw new Error(
                `Unterminated string: ${
                  t.slice(m, g + 1) + String.fromCharCode(c)
                }`
              );
            if (f === le)
              throw new Error(
                `Unterminated string: ${t.slice(m, g) + String.fromCharCode(c)}`
              );
          }
        l += t.slice(m, d + 1);
      } else {
        if (
          (c === we || c === le || c === _e) &&
          (f = t.charCodeAt(d + 1)) &&
          (f === we || f === le || f === _e)
        )
          continue;
        if (c === le) {
          if (l.length === 0) continue;
          (f = l.charCodeAt(l.length - 1)),
            f !== we && f !== le && f !== _e && (l += " ");
        } else if (c === Rt && t.charCodeAt(d + 1) === Rt && l.length === 0) {
          let m = "",
            g = d,
            y = -1;
          for (let k = d + 2; k < t.length; k++)
            if (((f = t.charCodeAt(k)), f === ke)) k += 1;
            else if (f === Ke && t.charCodeAt(k + 1) === Pe) {
              for (let A = k + 2; A < t.length; A++)
                if (((f = t.charCodeAt(A)), f === ke)) A += 1;
                else if (f === Pe && t.charCodeAt(A + 1) === Ke) {
                  k = A + 1;
                  break;
                }
            } else if (y === -1 && f === un) y = l.length + k - g;
            else if (f === Ue && m.length === 0) {
              (l += t.slice(g, k)), (d = k);
              break;
            } else if (f === it) m += ")";
            else if (f === cn) m += "]";
            else if (f === Vt) m += "}";
            else if ((f === rt || t.length - 1 === k) && m.length === 0) {
              (d = k - 1), (l += t.slice(g, k));
              break;
            } else
              (f === Et || f === fn || f === rt) &&
                m.length > 0 &&
                t[k] === m[m.length - 1] &&
                (m = m.slice(0, -1));
          let b = ot(l, y);
          if (!b) throw new Error("Invalid custom property, expected a value");
          o ? o.nodes.push(b) : r.push(b), (l = "");
        } else if (c === Ue && l.charCodeAt(0) === nt)
          (s = xe(l)), o ? o.nodes.push(s) : r.push(s), (l = ""), (s = null);
        else if (c === Ue && p[p.length - 1] !== ")") {
          let m = ot(l);
          if (!m)
            throw l.length === 0
              ? new Error("Unexpected semicolon")
              : new Error(`Invalid declaration: \`${l.trim()}\``);
          o ? o.nodes.push(m) : r.push(m), (l = "");
        } else if (c === Vt && p[p.length - 1] !== ")")
          (p += "}"),
            (s = M(l.trim())),
            o && o.nodes.push(s),
            e.push(o),
            (o = s),
            (l = ""),
            (s = null);
        else if (c === rt && p[p.length - 1] !== ")") {
          if (p === "") throw new Error("Missing opening {");
          if (((p = p.slice(0, -1)), l.length > 0))
            if (l.charCodeAt(0) === nt)
              (s = xe(l)),
                o ? o.nodes.push(s) : r.push(s),
                (l = ""),
                (s = null);
            else {
              let g = l.indexOf(":");
              if (o) {
                let y = ot(l, g);
                if (!y) throw new Error(`Invalid declaration: \`${l.trim()}\``);
                o.nodes.push(y);
              }
            }
          let m = e.pop() ?? null;
          m === null && o && r.push(o), (o = m), (l = ""), (s = null);
        } else if (c === it) (p += ")"), (l += "(");
        else if (c === Et) {
          if (p[p.length - 1] !== ")") throw new Error("Missing opening (");
          (p = p.slice(0, -1)), (l += ")");
        } else {
          if (l.length === 0 && (c === we || c === le || c === _e)) continue;
          l += String.fromCharCode(c);
        }
      }
    }
    if ((l.charCodeAt(0) === nt && r.push(xe(l)), p.length > 0 && o)) {
      if (o.kind === "rule")
        throw new Error(`Missing closing } at ${o.selector}`);
      if (o.kind === "at-rule")
        throw new Error(`Missing closing } at ${o.name} ${o.params}`);
    }
    return n.length > 0 ? n.concat(r) : r;
  }
  function xe(t, r = []) {
    for (let n = 5; n < t.length; n++) {
      let e = t.charCodeAt(n);
      if (e === we || e === it) {
        let o = t.slice(0, n).trim(),
          s = t.slice(n).trim();
        return K(o, s, r);
      }
    }
    return K(t.trim(), "", r);
  }
  function ot(t, r = t.indexOf(":")) {
    if (r === -1) return null;
    let n = t.indexOf("!important", r + 1);
    return a(
      t.slice(0, r).trim(),
      t.slice(r + 1, n === -1 ? t.length : n).trim(),
      n !== -1
    );
  }
  function re(t) {
    if (arguments.length === 0)
      throw new TypeError("`CSS.escape` requires an argument.");
    let r = String(t),
      n = r.length,
      e = -1,
      o,
      s = "",
      l = r.charCodeAt(0);
    if (n === 1 && l === 45) return "\\" + r;
    for (; ++e < n; ) {
      if (((o = r.charCodeAt(e)), o === 0)) {
        s += "\uFFFD";
        continue;
      }
      if (
        (o >= 1 && o <= 31) ||
        o === 127 ||
        (e === 0 && o >= 48 && o <= 57) ||
        (e === 1 && o >= 48 && o <= 57 && l === 45)
      ) {
        s += "\\" + o.toString(16) + " ";
        continue;
      }
      if (
        o >= 128 ||
        o === 45 ||
        o === 95 ||
        (o >= 48 && o <= 57) ||
        (o >= 65 && o <= 90) ||
        (o >= 97 && o <= 122)
      ) {
        s += r.charAt(e);
        continue;
      }
      s += "\\" + r.charAt(e);
    }
    return s;
  }
  function ae(t) {
    return t.replace(/\\([\dA-Fa-f]{1,6}[\t\n\f\r ]?|[\S\s])/g, (r) =>
      r.length > 2
        ? String.fromCodePoint(Number.parseInt(r.slice(1).trim(), 16))
        : r[1]
    );
  }
  var Kt = new Map([
    ["--font", ["--font-weight", "--font-size"]],
    ["--inset", ["--inset-shadow", "--inset-ring"]],
    [
      "--text",
      [
        "--text-color",
        "--text-underline-offset",
        "--text-indent",
        "--text-decoration-thickness",
        "--text-decoration-color",
      ],
    ],
  ]);
  function Ot(t, r) {
    return (Kt.get(r) ?? []).some((n) => t === n || t.startsWith(`${n}-`));
  }
  var ze = class {
    constructor(r = new Map(), n = new Set([])) {
      this.values = r;
      this.keyframes = n;
    }
    prefix = null;
    add(r, n, e = 0) {
      if (r.endsWith("-*")) {
        if (n !== "initial")
          throw new Error(
            `Invalid theme value \`${n}\` for namespace \`${r}\``
          );
        r === "--*"
          ? this.values.clear()
          : this.clearNamespace(r.slice(0, -2), 0);
      }
      if (e & 4) {
        let o = this.values.get(r);
        if (o && !(o.options & 4)) return;
      }
      n === "initial"
        ? this.values.delete(r)
        : this.values.set(r, { value: n, options: e });
    }
    keysInNamespaces(r) {
      let n = [];
      for (let e of r) {
        let o = `${e}-`;
        for (let s of this.values.keys())
          s.startsWith(o) &&
            s.indexOf("--", 2) === -1 &&
            (Ot(s, e) || n.push(s.slice(o.length)));
      }
      return n;
    }
    get(r) {
      for (let n of r) {
        let e = this.values.get(n);
        if (e) return e.value;
      }
      return null;
    }
    hasDefault(r) {
      return (this.getOptions(r) & 4) === 4;
    }
    getOptions(r) {
      return (r = ae(this.#r(r))), this.values.get(r)?.options ?? 0;
    }
    entries() {
      return this.prefix
        ? Array.from(this.values, (r) => ((r[0] = this.prefixKey(r[0])), r))
        : this.values.entries();
    }
    prefixKey(r) {
      return this.prefix ? `--${this.prefix}-${r.slice(2)}` : r;
    }
    #r(r) {
      return this.prefix ? `--${r.slice(3 + this.prefix.length)}` : r;
    }
    clearNamespace(r, n) {
      let e = Kt.get(r) ?? [];
      e: for (let o of this.values.keys())
        if (o.startsWith(r)) {
          if (n !== 0 && (this.getOptions(o) & n) !== n) continue;
          for (let s of e) if (o.startsWith(s)) continue e;
          this.values.delete(o);
        }
    }
    #e(r, n) {
      for (let e of n) {
        let o = r !== null ? `${e}-${r}` : e;
        if (!this.values.has(o))
          if (r !== null && r.includes(".")) {
            if (((o = `${e}-${r.replaceAll(".", "_")}`), !this.values.has(o)))
              continue;
          } else continue;
        if (!Ot(o, e)) return o;
      }
      return null;
    }
    #t(r) {
      let n = this.values.get(r);
      if (!n) return null;
      let e = null;
      return (
        n.options & 2 && (e = n.value),
        `var(${re(this.prefixKey(r))}${e ? `, ${e}` : ""})`
      );
    }
    markUsedVariable(r) {
      let n = ae(this.#r(r)),
        e = this.values.get(n);
      e && (e.options |= 16);
    }
    resolve(r, n) {
      let e = this.#e(r, n);
      if (!e) return null;
      let o = this.values.get(e);
      return o.options & 1 ? o.value : this.#t(e);
    }
    resolveValue(r, n) {
      let e = this.#e(r, n);
      return e ? this.values.get(e).value : null;
    }
    resolveWith(r, n, e = []) {
      let o = this.#e(r, n);
      if (!o) return null;
      let s = {};
      for (let p of e) {
        let f = `${o}${p}`,
          d = this.values.get(f);
        d && (d.options & 1 ? (s[p] = d.value) : (s[p] = this.#t(f)));
      }
      let l = this.values.get(o);
      return l.options & 1 ? [l.value, s] : [this.#t(o), s];
    }
    namespace(r) {
      let n = new Map(),
        e = `${r}-`;
      for (let [o, s] of this.values)
        o === r
          ? n.set(null, s.value)
          : o.startsWith(`${e}-`)
          ? n.set(o.slice(r.length), s.value)
          : o.startsWith(e) && n.set(o.slice(e.length), s.value);
      return n;
    }
    addKeyframes(r) {
      this.keyframes.add(r);
    }
    getKeyframes() {
      return Array.from(this.keyframes);
    }
  };
  var F = class extends Map {
    constructor(n) {
      super();
      this.factory = n;
    }
    get(n) {
      let e = super.get(n);
      return e === void 0 && ((e = this.factory(n, this)), this.set(n, e)), e;
    }
  };
  function at(t) {
    return { kind: "word", value: t };
  }
  function pn(t, r) {
    return { kind: "function", value: t, nodes: r };
  }
  function mn(t) {
    return { kind: "separator", value: t };
  }
  function ee(t, r, n = null) {
    for (let e = 0; e < t.length; e++) {
      let o = t[e],
        s = !1,
        l = 0,
        p =
          r(o, {
            parent: n,
            replaceWith(f) {
              (s = !0),
                Array.isArray(f)
                  ? f.length === 0
                    ? (t.splice(e, 1), (l = 0))
                    : f.length === 1
                    ? ((t[e] = f[0]), (l = 1))
                    : (t.splice(e, 1, ...f), (l = f.length))
                  : (t[e] = f);
            },
          }) ?? 0;
      if (s) {
        p === 0 ? e-- : (e += l - 1);
        continue;
      }
      if (p === 2) return 2;
      if (p !== 1 && o.kind === "function" && ee(o.nodes, r, o) === 2) return 2;
    }
  }
  function H(t) {
    let r = "";
    for (let n of t)
      switch (n.kind) {
        case "word":
        case "separator": {
          r += n.value;
          break;
        }
        case "function":
          r += n.value + "(" + H(n.nodes) + ")";
      }
    return r;
  }
  var Pt = 92,
    gn = 41,
    Ut = 58,
    _t = 44,
    hn = 34,
    Dt = 61,
    zt = 62,
    It = 60,
    Ft = 10,
    bn = 40,
    yn = 39,
    jt = 47,
    Lt = 32,
    Mt = 9;
  function L(t) {
    t = t.replaceAll(
      `\r
    `,
      `
    `
    );
    let r = [],
      n = [],
      e = null,
      o = "",
      s;
    for (let l = 0; l < t.length; l++) {
      let p = t.charCodeAt(l);
      switch (p) {
        case Pt: {
          (o += t[l] + t[l + 1]), l++;
          break;
        }
        case Ut:
        case _t:
        case Dt:
        case zt:
        case It:
        case Ft:
        case jt:
        case Lt:
        case Mt: {
          if (o.length > 0) {
            let m = at(o);
            e ? e.nodes.push(m) : r.push(m), (o = "");
          }
          let f = l,
            d = l + 1;
          for (
            ;
            d < t.length &&
            ((s = t.charCodeAt(d)),
            !(
              s !== Ut &&
              s !== _t &&
              s !== Dt &&
              s !== zt &&
              s !== It &&
              s !== Ft &&
              s !== jt &&
              s !== Lt &&
              s !== Mt
            ));
            d++
          );
          l = d - 1;
          let c = mn(t.slice(f, d));
          e ? e.nodes.push(c) : r.push(c);
          break;
        }
        case yn:
        case hn: {
          let f = l;
          for (let d = l + 1; d < t.length; d++)
            if (((s = t.charCodeAt(d)), s === Pt)) d += 1;
            else if (s === p) {
              l = d;
              break;
            }
          o += t.slice(f, l + 1);
          break;
        }
        case bn: {
          let f = pn(o, []);
          (o = ""), e ? e.nodes.push(f) : r.push(f), n.push(f), (e = f);
          break;
        }
        case gn: {
          let f = n.pop();
          if (o.length > 0) {
            let d = at(o);
            f.nodes.push(d), (o = "");
          }
          n.length > 0 ? (e = n[n.length - 1]) : (e = null);
          break;
        }
        default:
          o += String.fromCharCode(p);
      }
    }
    return o.length > 0 && r.push(at(o)), r;
  }
  function Ie(t) {
    let r = [];
    return (
      ee(L(t), (n) => {
        if (!(n.kind !== "function" || n.value !== "var"))
          return (
            ee(n.nodes, (e) => {
              e.kind !== "word" ||
                e.value[0] !== "-" ||
                e.value[1] !== "-" ||
                r.push(e.value);
            }),
            1
          );
      }),
      r
    );
  }
  var kn = 64;
  function _(t, r = []) {
    return { kind: "rule", selector: t, nodes: r };
  }
  function K(t, r = "", n = []) {
    return { kind: "at-rule", name: t, params: r, nodes: n };
  }
  function M(t, r = []) {
    return t.charCodeAt(0) === kn ? xe(t, r) : _(t, r);
  }
  function a(t, r, n = !1) {
    return { kind: "declaration", property: t, value: r, important: n };
  }
  function De(t) {
    return { kind: "comment", value: t };
  }
  function Q(t, r) {
    return { kind: "context", context: t, nodes: r };
  }
  function U(t) {
    return { kind: "at-root", nodes: t };
  }
  function P(t, r, n = [], e = {}) {
    for (let o = 0; o < t.length; o++) {
      let s = t[o],
        l = n[n.length - 1] ?? null;
      if (s.kind === "context") {
        if (P(s.nodes, r, n, { ...e, ...s.context }) === 2) return 2;
        continue;
      }
      n.push(s);
      let p = !1,
        f = 0,
        d =
          r(s, {
            parent: l,
            context: e,
            path: n,
            replaceWith(c) {
              (p = !0),
                Array.isArray(c)
                  ? c.length === 0
                    ? (t.splice(o, 1), (f = 0))
                    : c.length === 1
                    ? ((t[o] = c[0]), (f = 1))
                    : (t.splice(o, 1, ...c), (f = c.length))
                  : ((t[o] = c), (f = 1));
            },
          }) ?? 0;
      if ((n.pop(), p)) {
        d === 0 ? o-- : (o += f - 1);
        continue;
      }
      if (d === 2) return 2;
      if (d !== 1 && "nodes" in s) {
        n.push(s);
        let c = P(s.nodes, r, n, e);
        if ((n.pop(), c === 2)) return 2;
      }
    }
  }
  function Fe(t, r, n = [], e = {}) {
    for (let o = 0; o < t.length; o++) {
      let s = t[o],
        l = n[n.length - 1] ?? null;
      if (s.kind === "rule" || s.kind === "at-rule")
        n.push(s), Fe(s.nodes, r, n, e), n.pop();
      else if (s.kind === "context") {
        Fe(s.nodes, r, n, { ...e, ...s.context });
        continue;
      }
      n.push(s),
        r(s, {
          parent: l,
          context: e,
          path: n,
          replaceWith(p) {
            Array.isArray(p)
              ? p.length === 0
                ? t.splice(o, 1)
                : p.length === 1
                ? (t[o] = p[0])
                : t.splice(o, 1, ...p)
              : (t[o] = p),
              (o += p.length - 1);
          },
        }),
        n.pop();
    }
  }
  function se(t, r) {
    let n = [],
      e = new Set(),
      o = new F(() => new Set()),
      s = new Set(),
      l = new Set(),
      p = new F(() => new Set());
    function f(c, m, g = {}, y = 0) {
      if (c.kind === "declaration") {
        if (
          c.property === "--tw-sort" ||
          c.value === void 0 ||
          c.value === null
        )
          return;
        if (
          (g.theme &&
            c.property[0] === "-" &&
            c.property[1] === "-" &&
            (g.keyframes || o.get(m).add(c)),
          c.value.includes("var("))
        )
          if (g.theme && c.property[0] === "-" && c.property[1] === "-")
            for (let b of Ie(c.value)) p.get(b).add(c.property);
          else r.trackUsedVariables(c.value);
        if (c.property === "animation") {
          let b = c.value.split(/\s+/);
          for (let k of b) l.add(k);
        }
        m.push(c);
      } else if (c.kind === "rule")
        if (c.selector === "&")
          for (let b of c.nodes) {
            let k = [];
            f(b, k, g, y + 1), k.length > 0 && m.push(...k);
          }
        else {
          let b = { ...c, nodes: [] };
          for (let k of c.nodes) f(k, b.nodes, g, y + 1);
          b.nodes.length > 0 && m.push(b);
        }
      else if (c.kind === "at-rule" && c.name === "@property" && y === 0) {
        if (e.has(c.params)) return;
        e.add(c.params);
        let b = { ...c, nodes: [] };
        for (let k of c.nodes) f(k, b.nodes, g, y + 1);
        m.push(b);
      } else if (c.kind === "at-rule") {
        c.name === "@keyframes" && (g = { ...g, keyframes: !0 });
        let b = { ...c, nodes: [] };
        for (let k of c.nodes) f(k, b.nodes, g, y + 1);
        c.name === "@keyframes" && g.theme && s.add(b),
          (b.nodes.length > 0 ||
            b.name === "@layer" ||
            b.name === "@charset" ||
            b.name === "@custom-media" ||
            b.name === "@namespace" ||
            b.name === "@import") &&
            m.push(b);
      } else if (c.kind === "at-root")
        for (let b of c.nodes) {
          let k = [];
          f(b, k, g, 0);
          for (let A of k) n.push(A);
        }
      else if (c.kind === "context") {
        if (c.context.reference) return;
        for (let b of c.nodes) f(b, m, { ...g, ...c.context }, y);
      } else c.kind === "comment" && m.push(c);
    }
    let d = [];
    for (let c of t) f(c, d, {}, 0);
    e: for (let [c, m] of o)
      for (let g of m) {
        if (Wt(g.property, r.theme, p)) {
          if (g.property.startsWith(r.theme.prefixKey("--animate-"))) {
            let k = g.value.split(/\s+/);
            for (let A of k) l.add(A);
          }
          continue;
        }
        let b = c.indexOf(g);
        if ((c.splice(b, 1), c.length === 0)) {
          let k = wn(d, (A) => A.kind === "rule" && A.nodes === c);
          if (!k || k.length === 0) continue e;
          k.unshift({ kind: "at-root", nodes: d });
          do {
            let A = k.pop();
            if (!A) break;
            let w = k[k.length - 1];
            if (!w || (w.kind !== "at-root" && w.kind !== "at-rule")) break;
            let T = w.nodes.indexOf(A);
            if (T === -1) break;
            w.nodes.splice(T, 1);
          } while (!0);
          continue e;
        }
      }
    for (let c of s)
      if (!l.has(c.params)) {
        let m = n.indexOf(c);
        n.splice(m, 1);
      }
    return d.concat(n);
  }
  function Y(t) {
    function r(e, o = 0) {
      let s = "",
        l = "  ".repeat(o);
      if (e.kind === "declaration")
        s += `${l}${e.property}: ${e.value}${e.important ? " !important" : ""};
    `;
      else if (e.kind === "rule") {
        s += `${l}${e.selector} {
    `;
        for (let p of e.nodes) s += r(p, o + 1);
        s += `${l}}
    `;
      } else if (e.kind === "at-rule") {
        if (e.nodes.length === 0)
          return `${l}${e.name} ${e.params};
    `;
        s += `${l}${e.name}${e.params ? ` ${e.params} ` : " "}{
    `;
        for (let p of e.nodes) s += r(p, o + 1);
        s += `${l}}
    `;
      } else if (e.kind === "comment")
        s += `${l}/*${e.value}*/
    `;
      else if (e.kind === "context" || e.kind === "at-root") return "";
      return s;
    }
    let n = "";
    for (let e of t) {
      let o = r(e);
      o !== "" && (n += o);
    }
    return n;
  }
  function wn(t, r) {
    let n = [];
    return (
      P(t, (e, { path: o }) => {
        if (r(e)) return (n = [...o]), 2;
      }),
      n
    );
  }
  function Wt(t, r, n, e = new Set()) {
    if (e.has(t) || (e.add(t), r.getOptions(t) & 24)) return !0;
    {
      let s = n.get(t) ?? [];
      for (let l of s) if (Wt(l, r, n, e)) return !0;
    }
    return !1;
  }
  var ut = [
      "calc",
      "min",
      "max",
      "clamp",
      "mod",
      "rem",
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "atan2",
      "pow",
      "sqrt",
      "hypot",
      "log",
      "exp",
      "round",
    ],
    je = ["anchor-size"],
    Bt = new RegExp(`(${je.join("|")})\\(`, "g");
  function Ce(t) {
    return t.indexOf("(") !== -1 && ut.some((r) => t.includes(`${r}(`));
  }
  function qt(t) {
    if (!ut.some((o) => t.includes(o))) return t;
    let r = !1;
    je.some((o) => t.includes(o)) &&
      ((Bt.lastIndex = 0),
      (t = t.replace(Bt, (o, s) => ((r = !0), `$${je.indexOf(s)}$(`))));
    let n = "",
      e = [];
    for (let o = 0; o < t.length; o++) {
      let s = t[o];
      if (s === "(") {
        n += s;
        let l = o;
        for (let f = o - 1; f >= 0; f--) {
          let d = t.charCodeAt(f);
          if (d >= 48 && d <= 57) l = f;
          else if (d >= 97 && d <= 122) l = f;
          else break;
        }
        let p = t.slice(l, o);
        if (ut.includes(p)) {
          e.unshift(!0);
          continue;
        } else if (e[0] && p === "") {
          e.unshift(!0);
          continue;
        }
        e.unshift(!1);
        continue;
      } else if (s === ")") (n += s), e.shift();
      else if (s === "," && e[0]) {
        n += ", ";
        continue;
      } else {
        if (s === " " && e[0] && n[n.length - 1] === " ") continue;
        if ((s === "+" || s === "*" || s === "/" || s === "-") && e[0]) {
          let l = n.trimEnd(),
            p = l[l.length - 1];
          if (p === "+" || p === "*" || p === "/" || p === "-") {
            n += s;
            continue;
          } else if (p === "(" || p === ",") {
            n += s;
            continue;
          } else t[o - 1] === " " ? (n += `${s} `) : (n += ` ${s} `);
        } else if (e[0] && t.startsWith("to-zero", o)) {
          let l = o;
          (o += 7), (n += t.slice(l, o + 1));
        } else n += s;
      }
    }
    return r ? n.replace(/\$(\d+)\$/g, (o, s) => je[s] ?? o) : n;
  }
  function ne(t) {
    if (t.indexOf("(") === -1) return me(t);
    let r = L(t);
    return ct(r), (t = H(r)), (t = qt(t)), t;
  }
  function me(t, r = !1) {
    let n = "";
    for (let e = 0; e < t.length; e++) {
      let o = t[e];
      o === "\\" && t[e + 1] === "_"
        ? ((n += "_"), (e += 1))
        : o === "_" && !r
        ? (n += " ")
        : (n += o);
    }
    return n;
  }
  function ct(t) {
    for (let r of t)
      switch (r.kind) {
        case "function": {
          if (r.value === "url" || r.value.endsWith("_url")) {
            r.value = me(r.value);
            break;
          }
          if (
            r.value === "var" ||
            r.value.endsWith("_var") ||
            r.value === "theme" ||
            r.value.endsWith("_theme")
          ) {
            r.value = me(r.value);
            for (let n = 0; n < r.nodes.length; n++) {
              if (n == 0 && r.nodes[n].kind === "word") {
                r.nodes[n].value = me(r.nodes[n].value, !0);
                continue;
              }
              ct([r.nodes[n]]);
            }
            break;
          }
          (r.value = me(r.value)), ct(r.nodes);
          break;
        }
        case "separator":
        case "word": {
          r.value = me(r.value);
          break;
        }
        default:
          xn(r);
      }
  }
  function xn(t) {
    throw new Error(`Unexpected value: ${t}`);
  }
  var Le = new Uint8Array(256);
  function O(t, r) {
    let n = 0,
      e = [],
      o = 0,
      s = t.length,
      l = r.charCodeAt(0);
    for (let p = 0; p < s; p++) {
      let f = t.charCodeAt(p);
      if (n === 0 && f === l) {
        e.push(t.slice(o, p)), (o = p + 1);
        continue;
      }
      switch (f) {
        case 92:
          p += 1;
          break;
        case 39:
        case 34:
          for (; ++p < s; ) {
            let d = t.charCodeAt(p);
            if (d === 92) {
              p += 1;
              continue;
            }
            if (d === f) break;
          }
          break;
        case 40:
          (Le[n] = 41), n++;
          break;
        case 91:
          (Le[n] = 93), n++;
          break;
        case 123:
          (Le[n] = 125), n++;
          break;
        case 93:
        case 125:
        case 41:
          n > 0 && f === Le[n - 1] && n--;
          break;
      }
    }
    return e.push(t.slice(o)), e;
  }
  var An = 58,
    Ht = 45,
    Gt = 97,
    Yt = 122;
  function* Jt(t, r) {
    let n = O(t, ":");
    if (r.theme.prefix) {
      if (n.length === 1 || n[0] !== r.theme.prefix) return null;
      n.shift();
    }
    let e = n.pop(),
      o = [];
    for (let m = n.length - 1; m >= 0; --m) {
      let g = r.parseVariant(n[m]);
      if (g === null) return;
      o.push(g);
    }
    let s = !1;
    e[e.length - 1] === "!"
      ? ((s = !0), (e = e.slice(0, -1)))
      : e[0] === "!" && ((s = !0), (e = e.slice(1))),
      r.utilities.has(e, "static") &&
        !e.includes("[") &&
        (yield { kind: "static", root: e, variants: o, important: s, raw: t });
    let [l, p = null, f] = O(e, "/");
    if (f) return;
    let d = p === null ? null : ft(p);
    if (p !== null && d === null) return;
    if (l[0] === "[") {
      if (l[l.length - 1] !== "]") return;
      let m = l.charCodeAt(1);
      if (m !== Ht && !(m >= Gt && m <= Yt)) return;
      l = l.slice(1, -1);
      let g = l.indexOf(":");
      if (g === -1 || g === 0 || g === l.length - 1) return;
      let y = l.slice(0, g),
        b = ne(l.slice(g + 1));
      yield {
        kind: "arbitrary",
        property: y,
        value: b,
        modifier: d,
        variants: o,
        important: s,
        raw: t,
      };
      return;
    }
    let c;
    if (l[l.length - 1] === "]") {
      let m = l.indexOf("-[");
      if (m === -1) return;
      let g = l.slice(0, m);
      if (!r.utilities.has(g, "functional")) return;
      let y = l.slice(m + 1);
      c = [[g, y]];
    } else if (l[l.length - 1] === ")") {
      let m = l.indexOf("-(");
      if (m === -1) return;
      let g = l.slice(0, m);
      if (!r.utilities.has(g, "functional")) return;
      let y = l.slice(m + 2, -1),
        b = O(y, ":"),
        k = null;
      if (
        (b.length === 2 && ((k = b[0]), (y = b[1])),
        y[0] !== "-" && y[1] !== "-")
      )
        return;
      c = [[g, k === null ? `[var(${y})]` : `[${k}:var(${y})]`]];
    } else c = Qt(l, (m) => r.utilities.has(m, "functional"));
    for (let [m, g] of c) {
      let y = {
        kind: "functional",
        root: m,
        modifier: d,
        value: null,
        variants: o,
        important: s,
        raw: t,
      };
      if (g === null) {
        yield y;
        continue;
      }
      {
        let b = g.indexOf("[");
        if (b !== -1) {
          if (g[g.length - 1] !== "]") return;
          let A = ne(g.slice(b + 1, -1)),
            w = "";
          for (let T = 0; T < A.length; T++) {
            let z = A.charCodeAt(T);
            if (z === An) {
              (w = A.slice(0, T)), (A = A.slice(T + 1));
              break;
            }
            if (!(z === Ht || (z >= Gt && z <= Yt))) break;
          }
          if (A.length === 0 || A.trim().length === 0) continue;
          y.value = { kind: "arbitrary", dataType: w || null, value: A };
        } else {
          let A =
            p === null || y.modifier?.kind === "arbitrary" ? null : `${g}/${p}`;
          y.value = { kind: "named", value: g, fraction: A };
        }
      }
      yield y;
    }
  }
  function ft(t) {
    if (t[0] === "[" && t[t.length - 1] === "]") {
      let r = ne(t.slice(1, -1));
      return r.length === 0 || r.trim().length === 0
        ? null
        : { kind: "arbitrary", value: r };
    }
    if (t[0] === "(" && t[t.length - 1] === ")") {
      let r = ne(t.slice(1, -1));
      return r.length === 0 ||
        r.trim().length === 0 ||
        (r[0] !== "-" && r[1] !== "-")
        ? null
        : { kind: "arbitrary", value: `var(${r})` };
    }
    return { kind: "named", value: t };
  }
  function Zt(t, r) {
    if (t[0] === "[" && t[t.length - 1] === "]") {
      if (t[1] === "@" && t.includes("&")) return null;
      let n = ne(t.slice(1, -1));
      if (n.length === 0 || n.trim().length === 0) return null;
      let e = n[0] === ">" || n[0] === "+" || n[0] === "~";
      return (
        !e && n[0] !== "@" && !n.includes("&") && (n = `&:is(${n})`),
        { kind: "arbitrary", selector: n, relative: e }
      );
    }
    {
      let [n, e = null, o] = O(t, "/");
      if (o) return null;
      let s = Qt(n, (l) => r.variants.has(l));
      for (let [l, p] of s)
        switch (r.variants.kind(l)) {
          case "static":
            return p !== null || e !== null
              ? null
              : { kind: "static", root: l };
          case "functional": {
            let f = e === null ? null : ft(e);
            if (e !== null && f === null) return null;
            if (p === null)
              return { kind: "functional", root: l, modifier: f, value: null };
            if (p[p.length - 1] === "]") {
              if (p[0] !== "[") continue;
              let d = ne(p.slice(1, -1));
              return d.length === 0 || d.trim().length === 0
                ? null
                : {
                    kind: "functional",
                    root: l,
                    modifier: f,
                    value: { kind: "arbitrary", value: d },
                  };
            }
            if (p[p.length - 1] === ")") {
              if (p[0] !== "(") continue;
              let d = ne(p.slice(1, -1));
              return d.length === 0 ||
                d.trim().length === 0 ||
                (d[0] !== "-" && d[1] !== "-")
                ? null
                : {
                    kind: "functional",
                    root: l,
                    modifier: f,
                    value: { kind: "arbitrary", value: `var(${d})` },
                  };
            }
            return {
              kind: "functional",
              root: l,
              modifier: f,
              value: { kind: "named", value: p },
            };
          }
          case "compound": {
            if (p === null) return null;
            let f = r.parseVariant(p);
            if (f === null || !r.variants.compoundsWith(l, f)) return null;
            let d = e === null ? null : ft(e);
            return e !== null && d === null
              ? null
              : { kind: "compound", root: l, modifier: d, variant: f };
          }
        }
    }
    return null;
  }
  function* Qt(t, r) {
    r(t) && (yield [t, null]);
    let n = t.lastIndexOf("-");
    if (n === -1) {
      t[0] === "@" && r("@") && (yield ["@", t.slice(1)]);
      return;
    }
    do {
      let e = t.slice(0, n);
      if (r(e)) {
        let o = [e, t.slice(n + 1)];
        if (o[1] === "") break;
        yield o;
      }
      n = t.lastIndexOf("-", n - 1);
    } while (n > 0);
  }
  function ue(t, r, n) {
    if (t === r) return 0;
    let e = t.indexOf("("),
      o = r.indexOf("("),
      s = e === -1 ? t.replace(/[\d.]+/g, "") : t.slice(0, e),
      l = o === -1 ? r.replace(/[\d.]+/g, "") : r.slice(0, o),
      p =
        (s === l ? 0 : s < l ? -1 : 1) ||
        (n === "asc" ? parseInt(t) - parseInt(r) : parseInt(r) - parseInt(t));
    return Number.isNaN(p) ? (t < r ? -1 : 1) : p;
  }
  var Cn = new Set([
      "black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "black",
      "blanchedalmond",
      "blue",
      "blueviolet",
      "brown",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "cyan",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgreen",
      "darkgrey",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkslategrey",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dimgrey",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "fuchsia",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "gray",
      "green",
      "greenyellow",
      "grey",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgreen",
      "lightgrey",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightslategrey",
      "lightsteelblue",
      "lightyellow",
      "lime",
      "limegreen",
      "linen",
      "magenta",
      "maroon",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "navy",
      "oldlace",
      "olive",
      "olivedrab",
      "orange",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "pink",
      "plum",
      "powderblue",
      "purple",
      "rebeccapurple",
      "red",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "silver",
      "skyblue",
      "slateblue",
      "slategray",
      "slategrey",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "teal",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "white",
      "whitesmoke",
      "yellow",
      "yellowgreen",
      "transparent",
      "currentcolor",
      "canvas",
      "canvastext",
      "linktext",
      "visitedtext",
      "activetext",
      "buttonface",
      "buttontext",
      "buttonborder",
      "field",
      "fieldtext",
      "highlight",
      "highlighttext",
      "selecteditem",
      "selecteditemtext",
      "mark",
      "marktext",
      "graytext",
      "accentcolor",
      "accentcolortext",
    ]),
    Sn = /^(rgba?|hsla?|hwb|color|(ok)?(lab|lch)|light-dark|color-mix)\(/i;
  function Xt(t) {
    return t.charCodeAt(0) === 35 || Sn.test(t) || Cn.has(t.toLowerCase());
  }
  var Nn = {
    color: Xt,
    length: pt,
    percentage: dt,
    ratio: Fn,
    number: Dn,
    integer: V,
    url: er,
    position: Mn,
    "bg-size": Wn,
    "line-width": Tn,
    image: Rn,
    "family-name": Kn,
    "generic-name": On,
    "absolute-size": Pn,
    "relative-size": Un,
    angle: Hn,
    vector: Yn,
  };
  function j(t, r) {
    if (t.startsWith("var(")) return null;
    for (let n of r) if (Nn[n]?.(t)) return n;
    return null;
  }
  var $n = /^url\(.*\)$/;
  function er(t) {
    return $n.test(t);
  }
  function Tn(t) {
    return t === "thin" || t === "medium" || t === "thick";
  }
  var Vn = /^(?:element|image|cross-fade|image-set)\(/,
    En = /^(repeating-)?(conic|linear|radial)-gradient\(/;
  function Rn(t) {
    let r = 0;
    for (let n of O(t, ","))
      if (!n.startsWith("var(")) {
        if (er(n)) {
          r += 1;
          continue;
        }
        if (En.test(n)) {
          r += 1;
          continue;
        }
        if (Vn.test(n)) {
          r += 1;
          continue;
        }
        return !1;
      }
    return r > 0;
  }
  function On(t) {
    return (
      t === "serif" ||
      t === "sans-serif" ||
      t === "monospace" ||
      t === "cursive" ||
      t === "fantasy" ||
      t === "system-ui" ||
      t === "ui-serif" ||
      t === "ui-sans-serif" ||
      t === "ui-monospace" ||
      t === "ui-rounded" ||
      t === "math" ||
      t === "emoji" ||
      t === "fangsong"
    );
  }
  function Kn(t) {
    let r = 0;
    for (let n of O(t, ",")) {
      let e = n.charCodeAt(0);
      if (e >= 48 && e <= 57) return !1;
      n.startsWith("var(") || (r += 1);
    }
    return r > 0;
  }
  function Pn(t) {
    return (
      t === "xx-small" ||
      t === "x-small" ||
      t === "small" ||
      t === "medium" ||
      t === "large" ||
      t === "x-large" ||
      t === "xx-large" ||
      t === "xxx-large"
    );
  }
  function Un(t) {
    return t === "larger" || t === "smaller";
  }
  var te = /[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?/,
    _n = new RegExp(`^${te.source}$`);
  function Dn(t) {
    return _n.test(t) || Ce(t);
  }
  var zn = new RegExp(`^${te.source}%$`);
  function dt(t) {
    return zn.test(t) || Ce(t);
  }
  var In = new RegExp(`^${te.source}s*/s*${te.source}$`);
  function Fn(t) {
    return In.test(t) || Ce(t);
  }
  var jn = [
      "cm",
      "mm",
      "Q",
      "in",
      "pc",
      "pt",
      "px",
      "em",
      "ex",
      "ch",
      "rem",
      "lh",
      "rlh",
      "vw",
      "vh",
      "vmin",
      "vmax",
      "vb",
      "vi",
      "svw",
      "svh",
      "lvw",
      "lvh",
      "dvw",
      "dvh",
      "cqw",
      "cqh",
      "cqi",
      "cqb",
      "cqmin",
      "cqmax",
    ],
    Ln = new RegExp(`^${te.source}(${jn.join("|")})$`);
  function pt(t) {
    return Ln.test(t) || Ce(t);
  }
  function Mn(t) {
    let r = 0;
    for (let n of O(t, " ")) {
      if (
        n === "center" ||
        n === "top" ||
        n === "right" ||
        n === "bottom" ||
        n === "left"
      ) {
        r += 1;
        continue;
      }
      if (!n.startsWith("var(")) {
        if (pt(n) || dt(n)) {
          r += 1;
          continue;
        }
        return !1;
      }
    }
    return r > 0;
  }
  function Wn(t) {
    let r = 0;
    for (let n of O(t, ",")) {
      if (n === "cover" || n === "contain") {
        r += 1;
        continue;
      }
      let e = O(n, " ");
      if (e.length !== 1 && e.length !== 2) return !1;
      if (e.every((o) => o === "auto" || pt(o) || dt(o))) {
        r += 1;
        continue;
      }
    }
    return r > 0;
  }
  var Bn = ["deg", "rad", "grad", "turn"],
    qn = new RegExp(`^${te.source}(${Bn.join("|")})$`);
  function Hn(t) {
    return qn.test(t);
  }
  var Gn = new RegExp(`^${te.source} +${te.source} +${te.source}$`);
  function Yn(t) {
    return Gn.test(t);
  }
  function V(t) {
    let r = Number(t);
    return Number.isInteger(r) && r >= 0 && String(r) === String(t);
  }
  function mt(t) {
    let r = Number(t);
    return Number.isInteger(r) && r > 0 && String(r) === String(t);
  }
  function ge(t) {
    return tr(t, 0.25);
  }
  function Me(t) {
    return tr(t, 0.25);
  }
  function tr(t, r) {
    let n = Number(t);
    return n >= 0 && n % r === 0 && String(n) === String(t);
  }
  var Jn = new Set(["inset", "inherit", "initial", "revert", "unset"]),
    rr = /^-?(\d+|\.\d+)(.*?)$/g;
  function ce(t, r) {
    return O(t, ",")
      .map((e) => {
        e = e.trim();
        let o = O(e, " ").filter((d) => d.trim() !== ""),
          s = null,
          l = null,
          p = null;
        for (let d of o)
          Jn.has(d) ||
            (rr.test(d)
              ? (l === null ? (l = d) : p === null && (p = d),
                (rr.lastIndex = 0))
              : s === null && (s = d));
        if (l === null || p === null) return e;
        let f = r(s ?? "currentcolor");
        return s !== null ? e.replace(s, f) : `${e} ${f}`;
      })
      .join(", ");
  }
  var Qn = /^-?[a-z][a-zA-Z0-9/%._-]*$/,
    Xn = /^-?[a-z][a-zA-Z0-9/%._-]*-\*$/,
    gt = class {
      utilities = new F(() => []);
      completions = new Map();
      static(r, n) {
        this.utilities.get(r).push({ kind: "static", compileFn: n });
      }
      functional(r, n, e) {
        this.utilities
          .get(r)
          .push({ kind: "functional", compileFn: n, options: e });
      }
      has(r, n) {
        return (
          this.utilities.has(r) &&
          this.utilities.get(r).some((e) => e.kind === n)
        );
      }
      get(r) {
        return this.utilities.has(r) ? this.utilities.get(r) : [];
      }
      getCompletions(r) {
        return this.completions.get(r)?.() ?? [];
      }
      suggest(r, n) {
        this.completions.set(r, n);
      }
      keys(r) {
        let n = [];
        for (let [e, o] of this.utilities.entries())
          for (let s of o)
            if (s.kind === r) {
              n.push(e);
              break;
            }
        return n;
      }
    };
  function $(t, r, n) {
    return K("@property", t, [
      a("syntax", n ? `"${n}"` : '"*"'),
      a("inherits", "false"),
      ...(r ? [a("initial-value", r)] : []),
    ]);
  }
  function J(t, r) {
    if (r === null) return t;
    let n = Number(r);
    return (
      Number.isNaN(n) || (r = `${n * 100}%`),
      `color-mix(in oklab, ${t} ${r}, transparent)`
    );
  }
  function W(t, r, n) {
    if (!r) return t;
    if (r.kind === "arbitrary") return J(t, r.value);
    let e = n.resolve(r.value, ["--opacity"]);
    return e ? J(t, e) : Me(r.value) ? J(t, `${r.value}%`) : null;
  }
  function G(t, r, n) {
    let e = null;
    switch (t.value.value) {
      case "inherit": {
        e = "inherit";
        break;
      }
      case "transparent": {
        e = "transparent";
        break;
      }
      case "current": {
        e = "currentColor";
        break;
      }
      default: {
        e = r.resolve(t.value.value, n);
        break;
      }
    }
    return e ? W(e, t.modifier, r) : null;
  }
  function or(t) {
    let r = new gt();
    function n(i, u) {
      let h = /(\d+)_(\d+)/g;
      function* x(N) {
        for (let E of t.keysInNamespaces(N))
          yield E.replace(h, (S, C, I) => `${C}.${I}`);
      }
      let v = [
        "1/2",
        "1/3",
        "2/3",
        "1/4",
        "2/4",
        "3/4",
        "1/5",
        "2/5",
        "3/5",
        "4/5",
        "1/6",
        "2/6",
        "3/6",
        "4/6",
        "5/6",
        "1/12",
        "2/12",
        "3/12",
        "4/12",
        "5/12",
        "6/12",
        "7/12",
        "8/12",
        "9/12",
        "10/12",
        "11/12",
      ];
      r.suggest(i, () => {
        let N = [];
        for (let E of u()) {
          if (typeof E == "string") {
            N.push({ values: [E], modifiers: [] });
            continue;
          }
          let S = [...(E.values ?? []), ...x(E.valueThemeKeys ?? [])],
            C = [...(E.modifiers ?? []), ...x(E.modifierThemeKeys ?? [])];
          E.supportsFractions && S.push(...v),
            E.hasDefaultValue && S.unshift(null),
            N.push({
              supportsNegative: E.supportsNegative,
              values: S,
              modifiers: C,
            });
        }
        return N;
      });
    }
    function e(i, u) {
      r.static(i, () =>
        u.map((h) => (typeof h == "function" ? h() : a(h[0], h[1])))
      );
    }
    function o(i, u) {
      function h({ negative: x }) {
        return (v) => {
          let N = null;
          if (v.value)
            if (v.value.kind === "arbitrary") {
              if (v.modifier) return;
              N = v.value.value;
            } else {
              if (
                ((N = t.resolve(
                  v.value.fraction ?? v.value.value,
                  u.themeKeys ?? []
                )),
                N === null && u.supportsFractions && v.value.fraction)
              ) {
                let [E, S] = O(v.value.fraction, "/");
                if (!V(E) || !V(S)) return;
                N = `calc(${v.value.fraction} * 100%)`;
              }
              if (N === null && x && u.handleNegativeBareValue) {
                if (
                  ((N = u.handleNegativeBareValue(v.value)),
                  !N?.includes("/") && v.modifier)
                )
                  return;
                if (N !== null) return u.handle(N);
              }
              if (
                N === null &&
                u.handleBareValue &&
                ((N = u.handleBareValue(v.value)),
                !N?.includes("/") && v.modifier)
              )
                return;
            }
          else {
            if (v.modifier) return;
            N =
              u.defaultValue !== void 0
                ? u.defaultValue
                : t.resolve(null, u.themeKeys ?? []);
          }
          if (N !== null) return u.handle(x ? `calc(${N} * -1)` : N);
        };
      }
      u.supportsNegative && r.functional(`-${i}`, h({ negative: !0 })),
        r.functional(i, h({ negative: !1 })),
        n(i, () => [
          {
            supportsNegative: u.supportsNegative,
            valueThemeKeys: u.themeKeys ?? [],
            hasDefaultValue:
              u.defaultValue !== void 0 && u.defaultValue !== null,
            supportsFractions: u.supportsFractions,
          },
        ]);
    }
    function s(i, u) {
      r.functional(i, (h) => {
        if (!h.value) return;
        let x = null;
        if (
          (h.value.kind === "arbitrary"
            ? ((x = h.value.value), (x = W(x, h.modifier, t)))
            : (x = G(h, t, u.themeKeys)),
          x !== null)
        )
          return u.handle(x);
      }),
        n(i, () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: u.themeKeys,
            modifiers: Array.from({ length: 21 }, (h, x) => `${x * 5}`),
          },
        ]);
    }
    function l(
      i,
      u,
      h,
      { supportsNegative: x = !1, supportsFractions: v = !1 } = {}
    ) {
      x && r.static(`-${i}-px`, () => h("-1px")),
        r.static(`${i}-px`, () => h("1px")),
        o(i, {
          themeKeys: u,
          supportsFractions: v,
          supportsNegative: x,
          defaultValue: null,
          handleBareValue: ({ value: N }) => {
            let E = t.resolve(null, ["--spacing"]);
            return !E || !ge(N) ? null : `calc(${E} * ${N})`;
          },
          handleNegativeBareValue: ({ value: N }) => {
            let E = t.resolve(null, ["--spacing"]);
            return !E || !ge(N) ? null : `calc(${E} * -${N})`;
          },
          handle: h,
        }),
        n(i, () => [
          {
            values: t.get(["--spacing"])
              ? [
                  "0",
                  "0.5",
                  "1",
                  "1.5",
                  "2",
                  "2.5",
                  "3",
                  "3.5",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "14",
                  "16",
                  "20",
                  "24",
                  "28",
                  "32",
                  "36",
                  "40",
                  "44",
                  "48",
                  "52",
                  "56",
                  "60",
                  "64",
                  "72",
                  "80",
                  "96",
                ]
              : [],
            supportsNegative: x,
            supportsFractions: v,
            valueThemeKeys: u,
          },
        ]);
    }
    e("sr-only", [
      ["position", "absolute"],
      ["width", "1px"],
      ["height", "1px"],
      ["padding", "0"],
      ["margin", "-1px"],
      ["overflow", "hidden"],
      ["clip", "rect(0, 0, 0, 0)"],
      ["white-space", "nowrap"],
      ["border-width", "0"],
    ]),
      e("not-sr-only", [
        ["position", "static"],
        ["width", "auto"],
        ["height", "auto"],
        ["padding", "0"],
        ["margin", "0"],
        ["overflow", "visible"],
        ["clip", "auto"],
        ["white-space", "normal"],
      ]),
      e("pointer-events-none", [["pointer-events", "none"]]),
      e("pointer-events-auto", [["pointer-events", "auto"]]),
      e("visible", [["visibility", "visible"]]),
      e("invisible", [["visibility", "hidden"]]),
      e("collapse", [["visibility", "collapse"]]),
      e("static", [["position", "static"]]),
      e("fixed", [["position", "fixed"]]),
      e("absolute", [["position", "absolute"]]),
      e("relative", [["position", "relative"]]),
      e("sticky", [["position", "sticky"]]);
    for (let [i, u] of [
      ["inset", "inset"],
      ["inset-x", "inset-inline"],
      ["inset-y", "inset-block"],
      ["start", "inset-inline-start"],
      ["end", "inset-inline-end"],
      ["top", "top"],
      ["right", "right"],
      ["bottom", "bottom"],
      ["left", "left"],
    ])
      e(`${i}-auto`, [[u, "auto"]]),
        e(`${i}-full`, [[u, "100%"]]),
        e(`-${i}-full`, [[u, "-100%"]]),
        l(i, ["--inset", "--spacing"], (h) => [a(u, h)], {
          supportsNegative: !0,
          supportsFractions: !0,
        });
    e("isolate", [["isolation", "isolate"]]),
      e("isolation-auto", [["isolation", "auto"]]),
      e("z-auto", [["z-index", "auto"]]),
      o("z", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--z-index"],
        handle: (i) => [a("z-index", i)],
      }),
      n("z", () => [
        {
          supportsNegative: !0,
          values: ["0", "10", "20", "30", "40", "50"],
          valueThemeKeys: ["--z-index"],
        },
      ]),
      e("order-first", [["order", "-9999"]]),
      e("order-last", [["order", "9999"]]),
      e("order-none", [["order", "0"]]),
      o("order", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--order"],
        handle: (i) => [a("order", i)],
      }),
      n("order", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--order"],
        },
      ]),
      e("col-auto", [["grid-column", "auto"]]),
      o("col", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-column"],
        handle: (i) => [a("grid-column", i)],
      }),
      e("col-span-full", [["grid-column", "1 / -1"]]),
      o("col-span", {
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [a("grid-column", `span ${i} / span ${i}`)],
      }),
      e("col-start-auto", [["grid-column-start", "auto"]]),
      o("col-start", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-column-start"],
        handle: (i) => [a("grid-column-start", i)],
      }),
      e("col-end-auto", [["grid-column-end", "auto"]]),
      o("col-end", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-column-end"],
        handle: (i) => [a("grid-column-end", i)],
      }),
      n("col-span", () => [
        {
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: [],
        },
      ]),
      n("col-start", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-column-start"],
        },
      ]),
      n("col-end", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-column-end"],
        },
      ]),
      e("row-auto", [["grid-row", "auto"]]),
      o("row", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-row"],
        handle: (i) => [a("grid-row", i)],
      }),
      e("row-span-full", [["grid-row", "1 / -1"]]),
      o("row-span", {
        themeKeys: [],
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [a("grid-row", `span ${i} / span ${i}`)],
      }),
      e("row-start-auto", [["grid-row-start", "auto"]]),
      o("row-start", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-row-start"],
        handle: (i) => [a("grid-row-start", i)],
      }),
      e("row-end-auto", [["grid-row-end", "auto"]]),
      o("row-end", {
        supportsNegative: !0,
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        themeKeys: ["--grid-row-end"],
        handle: (i) => [a("grid-row-end", i)],
      }),
      n("row-span", () => [
        {
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: [],
        },
      ]),
      n("row-start", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-row-start"],
        },
      ]),
      n("row-end", () => [
        {
          supportsNegative: !0,
          values: Array.from({ length: 13 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-row-end"],
        },
      ]),
      e("float-start", [["float", "inline-start"]]),
      e("float-end", [["float", "inline-end"]]),
      e("float-right", [["float", "right"]]),
      e("float-left", [["float", "left"]]),
      e("float-none", [["float", "none"]]),
      e("clear-start", [["clear", "inline-start"]]),
      e("clear-end", [["clear", "inline-end"]]),
      e("clear-right", [["clear", "right"]]),
      e("clear-left", [["clear", "left"]]),
      e("clear-both", [["clear", "both"]]),
      e("clear-none", [["clear", "none"]]);
    for (let [i, u] of [
      ["m", "margin"],
      ["mx", "margin-inline"],
      ["my", "margin-block"],
      ["ms", "margin-inline-start"],
      ["me", "margin-inline-end"],
      ["mt", "margin-top"],
      ["mr", "margin-right"],
      ["mb", "margin-bottom"],
      ["ml", "margin-left"],
    ])
      e(`${i}-auto`, [[u, "auto"]]),
        l(i, ["--margin", "--spacing"], (h) => [a(u, h)], {
          supportsNegative: !0,
        });
    e("box-border", [["box-sizing", "border-box"]]),
      e("box-content", [["box-sizing", "content-box"]]),
      e("line-clamp-none", [
        ["overflow", "visible"],
        ["display", "block"],
        ["-webkit-box-orient", "horizontal"],
        ["-webkit-line-clamp", "unset"],
      ]),
      o("line-clamp", {
        themeKeys: ["--line-clamp"],
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [
          a("overflow", "hidden"),
          a("display", "-webkit-box"),
          a("-webkit-box-orient", "vertical"),
          a("-webkit-line-clamp", i),
        ],
      }),
      n("line-clamp", () => [
        {
          values: ["1", "2", "3", "4", "5", "6"],
          valueThemeKeys: ["--line-clamp"],
        },
      ]),
      e("block", [["display", "block"]]),
      e("inline-block", [["display", "inline-block"]]),
      e("inline", [["display", "inline"]]),
      e("hidden", [["display", "none"]]),
      e("inline-flex", [["display", "inline-flex"]]),
      e("table", [["display", "table"]]),
      e("inline-table", [["display", "inline-table"]]),
      e("table-caption", [["display", "table-caption"]]),
      e("table-cell", [["display", "table-cell"]]),
      e("table-column", [["display", "table-column"]]),
      e("table-column-group", [["display", "table-column-group"]]),
      e("table-footer-group", [["display", "table-footer-group"]]),
      e("table-header-group", [["display", "table-header-group"]]),
      e("table-row-group", [["display", "table-row-group"]]),
      e("table-row", [["display", "table-row"]]),
      e("flow-root", [["display", "flow-root"]]),
      e("flex", [["display", "flex"]]),
      e("grid", [["display", "grid"]]),
      e("inline-grid", [["display", "inline-grid"]]),
      e("contents", [["display", "contents"]]),
      e("list-item", [["display", "list-item"]]),
      e("field-sizing-content", [["field-sizing", "content"]]),
      e("field-sizing-fixed", [["field-sizing", "fixed"]]),
      e("aspect-auto", [["aspect-ratio", "auto"]]),
      e("aspect-square", [["aspect-ratio", "1 / 1"]]),
      o("aspect", {
        themeKeys: ["--aspect"],
        handleBareValue: ({ fraction: i }) => {
          if (i === null) return null;
          let [u, h] = O(i, "/");
          return !V(u) || !V(h) ? null : i;
        },
        handle: (i) => [a("aspect-ratio", i)],
      });
    for (let [i, u] of [
      ["auto", "auto"],
      ["full", "100%"],
      ["svw", "100svw"],
      ["lvw", "100lvw"],
      ["dvw", "100dvw"],
      ["svh", "100svh"],
      ["lvh", "100lvh"],
      ["dvh", "100dvh"],
      ["min", "min-content"],
      ["max", "max-content"],
      ["fit", "fit-content"],
    ])
      e(`size-${i}`, [
        ["--tw-sort", "size"],
        ["width", u],
        ["height", u],
      ]),
        e(`w-${i}`, [["width", u]]),
        e(`h-${i}`, [["height", u]]),
        e(`min-w-${i}`, [["min-width", u]]),
        e(`min-h-${i}`, [["min-height", u]]),
        i !== "auto" &&
          (e(`max-w-${i}`, [["max-width", u]]),
          e(`max-h-${i}`, [["max-height", u]]));
    e("w-screen", [["width", "100vw"]]),
      e("min-w-screen", [["min-width", "100vw"]]),
      e("max-w-screen", [["max-width", "100vw"]]),
      e("h-screen", [["height", "100vh"]]),
      e("min-h-screen", [["min-height", "100vh"]]),
      e("max-h-screen", [["max-height", "100vh"]]),
      e("max-w-none", [["max-width", "none"]]),
      e("max-h-none", [["max-height", "none"]]),
      l(
        "size",
        ["--size", "--spacing"],
        (i) => [a("--tw-sort", "size"), a("width", i), a("height", i)],
        { supportsFractions: !0 }
      );
    for (let [i, u, h] of [
      ["w", ["--width", "--spacing", "--container"], "width"],
      ["min-w", ["--min-width", "--spacing", "--container"], "min-width"],
      ["max-w", ["--max-width", "--spacing", "--container"], "max-width"],
      ["h", ["--height", "--spacing"], "height"],
      ["min-h", ["--min-height", "--height", "--spacing"], "min-height"],
      ["max-h", ["--max-height", "--height", "--spacing"], "max-height"],
    ])
      l(i, u, (x) => [a(h, x)], { supportsFractions: !0 });
    r.static("container", () => {
      let i = [...t.namespace("--breakpoint").values()];
      i.sort((h, x) => ue(h, x, "asc"));
      let u = [a("--tw-sort", "--tw-container-component"), a("width", "100%")];
      for (let h of i)
        u.push(K("@media", `(width >= ${h})`, [a("max-width", h)]));
      return u;
    }),
      e("flex-auto", [["flex", "auto"]]),
      e("flex-initial", [["flex", "0 auto"]]),
      e("flex-none", [["flex", "none"]]),
      r.functional("flex", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary")
            return i.modifier ? void 0 : [a("flex", i.value.value)];
          if (i.value.fraction) {
            let [u, h] = O(i.value.fraction, "/");
            return !V(u) || !V(h)
              ? void 0
              : [a("flex", `calc(${i.value.fraction} * 100%)`)];
          }
          if (V(i.value.value))
            return i.modifier ? void 0 : [a("flex", i.value.value)];
        }
      }),
      n("flex", () => [{ supportsFractions: !0 }]),
      o("shrink", {
        defaultValue: "1",
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [a("flex-shrink", i)],
      }),
      o("grow", {
        defaultValue: "1",
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [a("flex-grow", i)],
      }),
      n("shrink", () => [
        { values: ["0"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      n("grow", () => [
        { values: ["0"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      e("basis-auto", [["flex-basis", "auto"]]),
      e("basis-full", [["flex-basis", "100%"]]),
      l(
        "basis",
        ["--flex-basis", "--spacing", "--container"],
        (i) => [a("flex-basis", i)],
        { supportsFractions: !0 }
      ),
      e("table-auto", [["table-layout", "auto"]]),
      e("table-fixed", [["table-layout", "fixed"]]),
      e("caption-top", [["caption-side", "top"]]),
      e("caption-bottom", [["caption-side", "bottom"]]),
      e("border-collapse", [["border-collapse", "collapse"]]),
      e("border-separate", [["border-collapse", "separate"]]);
    let p = () =>
      U([
        $("--tw-border-spacing-x", "0", "<length>"),
        $("--tw-border-spacing-y", "0", "<length>"),
      ]);
    l("border-spacing", ["--border-spacing", "--spacing"], (i) => [
      p(),
      a("--tw-border-spacing-x", i),
      a("--tw-border-spacing-y", i),
      a(
        "border-spacing",
        "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
      ),
    ]),
      l("border-spacing-x", ["--border-spacing", "--spacing"], (i) => [
        p(),
        a("--tw-border-spacing-x", i),
        a(
          "border-spacing",
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
        ),
      ]),
      l("border-spacing-y", ["--border-spacing", "--spacing"], (i) => [
        p(),
        a("--tw-border-spacing-y", i),
        a(
          "border-spacing",
          "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
        ),
      ]),
      e("origin-center", [["transform-origin", "center"]]),
      e("origin-top", [["transform-origin", "top"]]),
      e("origin-top-right", [["transform-origin", "top right"]]),
      e("origin-right", [["transform-origin", "right"]]),
      e("origin-bottom-right", [["transform-origin", "bottom right"]]),
      e("origin-bottom", [["transform-origin", "bottom"]]),
      e("origin-bottom-left", [["transform-origin", "bottom left"]]),
      e("origin-left", [["transform-origin", "left"]]),
      e("origin-top-left", [["transform-origin", "top left"]]),
      o("origin", {
        themeKeys: ["--transform-origin"],
        handle: (i) => [a("transform-origin", i)],
      }),
      e("perspective-origin-center", [["perspective-origin", "center"]]),
      e("perspective-origin-top", [["perspective-origin", "top"]]),
      e("perspective-origin-top-right", [["perspective-origin", "top right"]]),
      e("perspective-origin-right", [["perspective-origin", "right"]]),
      e("perspective-origin-bottom-right", [
        ["perspective-origin", "bottom right"],
      ]),
      e("perspective-origin-bottom", [["perspective-origin", "bottom"]]),
      e("perspective-origin-bottom-left", [
        ["perspective-origin", "bottom left"],
      ]),
      e("perspective-origin-left", [["perspective-origin", "left"]]),
      e("perspective-origin-top-left", [["perspective-origin", "top left"]]),
      o("perspective-origin", {
        themeKeys: ["--perspective-origin"],
        handle: (i) => [a("perspective-origin", i)],
      }),
      e("perspective-none", [["perspective", "none"]]),
      o("perspective", {
        themeKeys: ["--perspective"],
        handle: (i) => [a("perspective", i)],
      });
    let f = () =>
      U([
        $("--tw-translate-x", "0"),
        $("--tw-translate-y", "0"),
        $("--tw-translate-z", "0"),
      ]);
    e("translate-none", [["translate", "none"]]),
      e("-translate-full", [
        f,
        ["--tw-translate-x", "-100%"],
        ["--tw-translate-y", "-100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
      e("translate-full", [
        f,
        ["--tw-translate-x", "100%"],
        ["--tw-translate-y", "100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
      l(
        "translate",
        ["--translate", "--spacing"],
        (i) => [
          f(),
          a("--tw-translate-x", i),
          a("--tw-translate-y", i),
          a("translate", "var(--tw-translate-x) var(--tw-translate-y)"),
        ],
        { supportsNegative: !0, supportsFractions: !0 }
      );
    for (let i of ["x", "y"])
      e(`-translate-${i}-full`, [
        f,
        [`--tw-translate-${i}`, "-100%"],
        ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
      ]),
        e(`translate-${i}-full`, [
          f,
          [`--tw-translate-${i}`, "100%"],
          ["translate", "var(--tw-translate-x) var(--tw-translate-y)"],
        ]),
        l(
          `translate-${i}`,
          ["--translate", "--spacing"],
          (u) => [
            f(),
            a(`--tw-translate-${i}`, u),
            a("translate", "var(--tw-translate-x) var(--tw-translate-y)"),
          ],
          { supportsNegative: !0, supportsFractions: !0 }
        );
    l(
      "translate-z",
      ["--translate", "--spacing"],
      (i) => [
        f(),
        a("--tw-translate-z", i),
        a(
          "translate",
          "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)"
        ),
      ],
      { supportsNegative: !0 }
    ),
      e("translate-3d", [
        f,
        [
          "translate",
          "var(--tw-translate-x) var(--tw-translate-y) var(--tw-translate-z)",
        ],
      ]);
    let d = () =>
      U([
        $("--tw-scale-x", "1"),
        $("--tw-scale-y", "1"),
        $("--tw-scale-z", "1"),
      ]);
    e("scale-none", [["scale", "none"]]);
    function c({ negative: i }) {
      return (u) => {
        if (!u.value || u.modifier) return;
        let h;
        return u.value.kind === "arbitrary"
          ? ((h = u.value.value), [a("scale", h)])
          : ((h = t.resolve(u.value.value, ["--scale"])),
            !h && V(u.value.value) && (h = `${u.value.value}%`),
            h
              ? ((h = i ? `calc(${h} * -1)` : h),
                [
                  d(),
                  a("--tw-scale-x", h),
                  a("--tw-scale-y", h),
                  a("--tw-scale-z", h),
                  a("scale", "var(--tw-scale-x) var(--tw-scale-y)"),
                ])
              : void 0);
      };
    }
    r.functional("-scale", c({ negative: !0 })),
      r.functional("scale", c({ negative: !1 })),
      n("scale", () => [
        {
          supportsNegative: !0,
          values: [
            "0",
            "50",
            "75",
            "90",
            "95",
            "100",
            "105",
            "110",
            "125",
            "150",
            "200",
          ],
          valueThemeKeys: ["--scale"],
        },
      ]);
    for (let i of ["x", "y", "z"])
      o(`scale-${i}`, {
        supportsNegative: !0,
        themeKeys: ["--scale"],
        handleBareValue: ({ value: u }) => (V(u) ? `${u}%` : null),
        handle: (u) => [
          d(),
          a(`--tw-scale-${i}`, u),
          a(
            "scale",
            `var(--tw-scale-x) var(--tw-scale-y)${
              i === "z" ? " var(--tw-scale-z)" : ""
            }`
          ),
        ],
      }),
        n(`scale-${i}`, () => [
          {
            supportsNegative: !0,
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--scale"],
          },
        ]);
    e("scale-3d", [
      d,
      ["scale", "var(--tw-scale-x) var(--tw-scale-y) var(--tw-scale-z)"],
    ]),
      e("rotate-none", [["rotate", "none"]]);
    function m({ negative: i }) {
      return (u) => {
        if (!u.value || u.modifier) return;
        let h;
        if (u.value.kind === "arbitrary") {
          h = u.value.value;
          let x = u.value.dataType ?? j(h, ["angle", "vector"]);
          if (x === "vector") return [a("rotate", `${h} var(--tw-rotate)`)];
          if (x !== "angle") return [a("rotate", h)];
        } else if (
          ((h = t.resolve(u.value.value, ["--rotate"])),
          !h && V(u.value.value) && (h = `${u.value.value}deg`),
          !h)
        )
          return;
        return [a("rotate", i ? `calc(${h} * -1)` : h)];
      };
    }
    r.functional("-rotate", m({ negative: !0 })),
      r.functional("rotate", m({ negative: !1 })),
      n("rotate", () => [
        {
          supportsNegative: !0,
          values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
          valueThemeKeys: ["--rotate"],
        },
      ]);
    {
      let i = [
          "var(--tw-rotate-x)",
          "var(--tw-rotate-y)",
          "var(--tw-rotate-z)",
          "var(--tw-skew-x)",
          "var(--tw-skew-y)",
        ].join(" "),
        u = () =>
          U([
            $("--tw-rotate-x", "rotateX(0)"),
            $("--tw-rotate-y", "rotateY(0)"),
            $("--tw-rotate-z", "rotateZ(0)"),
            $("--tw-skew-x", "skewX(0)"),
            $("--tw-skew-y", "skewY(0)"),
          ]);
      for (let h of ["x", "y", "z"])
        o(`rotate-${h}`, {
          supportsNegative: !0,
          themeKeys: ["--rotate"],
          handleBareValue: ({ value: x }) => (V(x) ? `${x}deg` : null),
          handle: (x) => [
            u(),
            a(`--tw-rotate-${h}`, `rotate${h.toUpperCase()}(${x})`),
            a("transform", i),
          ],
        }),
          n(`rotate-${h}`, () => [
            {
              supportsNegative: !0,
              values: ["0", "1", "2", "3", "6", "12", "45", "90", "180"],
              valueThemeKeys: ["--rotate"],
            },
          ]);
      o("skew", {
        supportsNegative: !0,
        themeKeys: ["--skew"],
        handleBareValue: ({ value: h }) => (V(h) ? `${h}deg` : null),
        handle: (h) => [
          u(),
          a("--tw-skew-x", `skewX(${h})`),
          a("--tw-skew-y", `skewY(${h})`),
          a("transform", i),
        ],
      }),
        o("skew-x", {
          supportsNegative: !0,
          themeKeys: ["--skew"],
          handleBareValue: ({ value: h }) => (V(h) ? `${h}deg` : null),
          handle: (h) => [
            u(),
            a("--tw-skew-x", `skewX(${h})`),
            a("transform", i),
          ],
        }),
        o("skew-y", {
          supportsNegative: !0,
          themeKeys: ["--skew"],
          handleBareValue: ({ value: h }) => (V(h) ? `${h}deg` : null),
          handle: (h) => [
            u(),
            a("--tw-skew-y", `skewY(${h})`),
            a("transform", i),
          ],
        }),
        n("skew", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        n("skew-x", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        n("skew-y", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "3", "6", "12"],
            valueThemeKeys: ["--skew"],
          },
        ]),
        r.functional("transform", (h) => {
          if (h.modifier) return;
          let x = null;
          if (
            (h.value
              ? h.value.kind === "arbitrary" && (x = h.value.value)
              : (x = i),
            x !== null)
          )
            return [u(), a("transform", x)];
        }),
        n("transform", () => [{ hasDefaultValue: !0 }]),
        e("transform-cpu", [["transform", i]]),
        e("transform-gpu", [["transform", `translateZ(0) ${i}`]]),
        e("transform-none", [["transform", "none"]]);
    }
    e("transform-flat", [["transform-style", "flat"]]),
      e("transform-3d", [["transform-style", "preserve-3d"]]),
      e("transform-content", [["transform-box", "content-box"]]),
      e("transform-border", [["transform-box", "border-box"]]),
      e("transform-fill", [["transform-box", "fill-box"]]),
      e("transform-stroke", [["transform-box", "stroke-box"]]),
      e("transform-view", [["transform-box", "view-box"]]),
      e("backface-visible", [["backface-visibility", "visible"]]),
      e("backface-hidden", [["backface-visibility", "hidden"]]);
    for (let i of [
      "auto",
      "default",
      "pointer",
      "wait",
      "text",
      "move",
      "help",
      "not-allowed",
      "none",
      "context-menu",
      "progress",
      "cell",
      "crosshair",
      "vertical-text",
      "alias",
      "copy",
      "no-drop",
      "grab",
      "grabbing",
      "all-scroll",
      "col-resize",
      "row-resize",
      "n-resize",
      "e-resize",
      "s-resize",
      "w-resize",
      "ne-resize",
      "nw-resize",
      "se-resize",
      "sw-resize",
      "ew-resize",
      "ns-resize",
      "nesw-resize",
      "nwse-resize",
      "zoom-in",
      "zoom-out",
    ])
      e(`cursor-${i}`, [["cursor", i]]);
    o("cursor", { themeKeys: ["--cursor"], handle: (i) => [a("cursor", i)] });
    for (let i of ["auto", "none", "manipulation"])
      e(`touch-${i}`, [["touch-action", i]]);
    let g = () => U([$("--tw-pan-x"), $("--tw-pan-y"), $("--tw-pinch-zoom")]);
    for (let i of ["x", "left", "right"])
      e(`touch-pan-${i}`, [
        g,
        ["--tw-pan-x", `pan-${i}`],
        [
          "touch-action",
          "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
        ],
      ]);
    for (let i of ["y", "up", "down"])
      e(`touch-pan-${i}`, [
        g,
        ["--tw-pan-y", `pan-${i}`],
        [
          "touch-action",
          "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
        ],
      ]);
    e("touch-pinch-zoom", [
      g,
      ["--tw-pinch-zoom", "pinch-zoom"],
      [
        "touch-action",
        "var(--tw-pan-x,) var(--tw-pan-y,) var(--tw-pinch-zoom,)",
      ],
    ]);
    for (let i of ["none", "text", "all", "auto"])
      e(`select-${i}`, [
        ["-webkit-user-select", i],
        ["user-select", i],
      ]);
    e("resize-none", [["resize", "none"]]),
      e("resize-x", [["resize", "horizontal"]]),
      e("resize-y", [["resize", "vertical"]]),
      e("resize", [["resize", "both"]]),
      e("snap-none", [["scroll-snap-type", "none"]]);
    let y = () => U([$("--tw-scroll-snap-strictness", "proximity", "*")]);
    for (let i of ["x", "y", "both"])
      e(`snap-${i}`, [
        y,
        ["scroll-snap-type", `${i} var(--tw-scroll-snap-strictness)`],
      ]);
    e("snap-mandatory", [y, ["--tw-scroll-snap-strictness", "mandatory"]]),
      e("snap-proximity", [y, ["--tw-scroll-snap-strictness", "proximity"]]),
      e("snap-align-none", [["scroll-snap-align", "none"]]),
      e("snap-start", [["scroll-snap-align", "start"]]),
      e("snap-end", [["scroll-snap-align", "end"]]),
      e("snap-center", [["scroll-snap-align", "center"]]),
      e("snap-normal", [["scroll-snap-stop", "normal"]]),
      e("snap-always", [["scroll-snap-stop", "always"]]);
    for (let [i, u] of [
      ["scroll-m", "scroll-margin"],
      ["scroll-mx", "scroll-margin-inline"],
      ["scroll-my", "scroll-margin-block"],
      ["scroll-ms", "scroll-margin-inline-start"],
      ["scroll-me", "scroll-margin-inline-end"],
      ["scroll-mt", "scroll-margin-top"],
      ["scroll-mr", "scroll-margin-right"],
      ["scroll-mb", "scroll-margin-bottom"],
      ["scroll-ml", "scroll-margin-left"],
    ])
      l(i, ["--scroll-margin", "--spacing"], (h) => [a(u, h)], {
        supportsNegative: !0,
      });
    for (let [i, u] of [
      ["scroll-p", "scroll-padding"],
      ["scroll-px", "scroll-padding-inline"],
      ["scroll-py", "scroll-padding-block"],
      ["scroll-ps", "scroll-padding-inline-start"],
      ["scroll-pe", "scroll-padding-inline-end"],
      ["scroll-pt", "scroll-padding-top"],
      ["scroll-pr", "scroll-padding-right"],
      ["scroll-pb", "scroll-padding-bottom"],
      ["scroll-pl", "scroll-padding-left"],
    ])
      l(i, ["--scroll-padding", "--spacing"], (h) => [a(u, h)]);
    e("list-inside", [["list-style-position", "inside"]]),
      e("list-outside", [["list-style-position", "outside"]]),
      e("list-none", [["list-style-type", "none"]]),
      e("list-disc", [["list-style-type", "disc"]]),
      e("list-decimal", [["list-style-type", "decimal"]]),
      o("list", {
        themeKeys: ["--list-style-type"],
        handle: (i) => [a("list-style-type", i)],
      }),
      e("list-image-none", [["list-style-image", "none"]]),
      o("list-image", {
        themeKeys: ["--list-style-image"],
        handle: (i) => [a("list-style-image", i)],
      }),
      e("appearance-none", [["appearance", "none"]]),
      e("appearance-auto", [["appearance", "auto"]]),
      e("scheme-normal", [["color-scheme", "normal"]]),
      e("scheme-dark", [["color-scheme", "dark"]]),
      e("scheme-light", [["color-scheme", "light"]]),
      e("scheme-light-dark", [["color-scheme", "light dark"]]),
      e("scheme-only-dark", [["color-scheme", "only dark"]]),
      e("scheme-only-light", [["color-scheme", "only light"]]),
      e("columns-auto", [["columns", "auto"]]),
      o("columns", {
        themeKeys: ["--columns", "--container"],
        handleBareValue: ({ value: i }) => (V(i) ? i : null),
        handle: (i) => [a("columns", i)],
      }),
      n("columns", () => [
        {
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--columns", "--container"],
        },
      ]);
    for (let i of [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column",
    ])
      e(`break-before-${i}`, [["break-before", i]]);
    for (let i of ["auto", "avoid", "avoid-page", "avoid-column"])
      e(`break-inside-${i}`, [["break-inside", i]]);
    for (let i of [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column",
    ])
      e(`break-after-${i}`, [["break-after", i]]);
    e("grid-flow-row", [["grid-auto-flow", "row"]]),
      e("grid-flow-col", [["grid-auto-flow", "column"]]),
      e("grid-flow-dense", [["grid-auto-flow", "dense"]]),
      e("grid-flow-row-dense", [["grid-auto-flow", "row dense"]]),
      e("grid-flow-col-dense", [["grid-auto-flow", "column dense"]]),
      e("auto-cols-auto", [["grid-auto-columns", "auto"]]),
      e("auto-cols-min", [["grid-auto-columns", "min-content"]]),
      e("auto-cols-max", [["grid-auto-columns", "max-content"]]),
      e("auto-cols-fr", [["grid-auto-columns", "minmax(0, 1fr)"]]),
      o("auto-cols", {
        themeKeys: ["--grid-auto-columns"],
        handle: (i) => [a("grid-auto-columns", i)],
      }),
      e("auto-rows-auto", [["grid-auto-rows", "auto"]]),
      e("auto-rows-min", [["grid-auto-rows", "min-content"]]),
      e("auto-rows-max", [["grid-auto-rows", "max-content"]]),
      e("auto-rows-fr", [["grid-auto-rows", "minmax(0, 1fr)"]]),
      o("auto-rows", {
        themeKeys: ["--grid-auto-rows"],
        handle: (i) => [a("grid-auto-rows", i)],
      }),
      e("grid-cols-none", [["grid-template-columns", "none"]]),
      e("grid-cols-subgrid", [["grid-template-columns", "subgrid"]]),
      o("grid-cols", {
        themeKeys: ["--grid-template-columns"],
        handleBareValue: ({ value: i }) =>
          mt(i) ? `repeat(${i}, minmax(0, 1fr))` : null,
        handle: (i) => [a("grid-template-columns", i)],
      }),
      e("grid-rows-none", [["grid-template-rows", "none"]]),
      e("grid-rows-subgrid", [["grid-template-rows", "subgrid"]]),
      o("grid-rows", {
        themeKeys: ["--grid-template-rows"],
        handleBareValue: ({ value: i }) =>
          mt(i) ? `repeat(${i}, minmax(0, 1fr))` : null,
        handle: (i) => [a("grid-template-rows", i)],
      }),
      n("grid-cols", () => [
        {
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-template-columns"],
        },
      ]),
      n("grid-rows", () => [
        {
          values: Array.from({ length: 12 }, (i, u) => `${u + 1}`),
          valueThemeKeys: ["--grid-template-rows"],
        },
      ]),
      e("flex-row", [["flex-direction", "row"]]),
      e("flex-row-reverse", [["flex-direction", "row-reverse"]]),
      e("flex-col", [["flex-direction", "column"]]),
      e("flex-col-reverse", [["flex-direction", "column-reverse"]]),
      e("flex-wrap", [["flex-wrap", "wrap"]]),
      e("flex-nowrap", [["flex-wrap", "nowrap"]]),
      e("flex-wrap-reverse", [["flex-wrap", "wrap-reverse"]]),
      e("place-content-center", [["place-content", "center"]]),
      e("place-content-start", [["place-content", "start"]]),
      e("place-content-end", [["place-content", "end"]]),
      e("place-content-between", [["place-content", "space-between"]]),
      e("place-content-around", [["place-content", "space-around"]]),
      e("place-content-evenly", [["place-content", "space-evenly"]]),
      e("place-content-baseline", [["place-content", "baseline"]]),
      e("place-content-stretch", [["place-content", "stretch"]]),
      e("place-items-center", [["place-items", "center"]]),
      e("place-items-start", [["place-items", "start"]]),
      e("place-items-end", [["place-items", "end"]]),
      e("place-items-baseline", [["place-items", "baseline"]]),
      e("place-items-stretch", [["place-items", "stretch"]]),
      e("content-normal", [["align-content", "normal"]]),
      e("content-center", [["align-content", "center"]]),
      e("content-start", [["align-content", "flex-start"]]),
      e("content-end", [["align-content", "flex-end"]]),
      e("content-between", [["align-content", "space-between"]]),
      e("content-around", [["align-content", "space-around"]]),
      e("content-evenly", [["align-content", "space-evenly"]]),
      e("content-baseline", [["align-content", "baseline"]]),
      e("content-stretch", [["align-content", "stretch"]]),
      e("items-center", [["align-items", "center"]]),
      e("items-start", [["align-items", "flex-start"]]),
      e("items-end", [["align-items", "flex-end"]]),
      e("items-baseline", [["align-items", "baseline"]]),
      e("items-stretch", [["align-items", "stretch"]]),
      e("justify-normal", [["justify-content", "normal"]]),
      e("justify-center", [["justify-content", "center"]]),
      e("justify-start", [["justify-content", "flex-start"]]),
      e("justify-end", [["justify-content", "flex-end"]]),
      e("justify-between", [["justify-content", "space-between"]]),
      e("justify-around", [["justify-content", "space-around"]]),
      e("justify-evenly", [["justify-content", "space-evenly"]]),
      e("justify-baseline", [["justify-content", "baseline"]]),
      e("justify-stretch", [["justify-content", "stretch"]]),
      e("justify-items-normal", [["justify-items", "normal"]]),
      e("justify-items-center", [["justify-items", "center"]]),
      e("justify-items-start", [["justify-items", "start"]]),
      e("justify-items-end", [["justify-items", "end"]]),
      e("justify-items-stretch", [["justify-items", "stretch"]]),
      l("gap", ["--gap", "--spacing"], (i) => [a("gap", i)]),
      l("gap-x", ["--gap", "--spacing"], (i) => [a("column-gap", i)]),
      l("gap-y", ["--gap", "--spacing"], (i) => [a("row-gap", i)]),
      l(
        "space-x",
        ["--space", "--spacing"],
        (i) => [
          U([$("--tw-space-x-reverse", "0")]),
          _(":where(& > :not(:last-child))", [
            a("--tw-sort", "row-gap"),
            a("--tw-space-x-reverse", "0"),
            a("margin-inline-start", `calc(${i} * var(--tw-space-x-reverse))`),
            a(
              "margin-inline-end",
              `calc(${i} * calc(1 - var(--tw-space-x-reverse)))`
            ),
          ]),
        ],
        { supportsNegative: !0 }
      ),
      l(
        "space-y",
        ["--space", "--spacing"],
        (i) => [
          U([$("--tw-space-y-reverse", "0")]),
          _(":where(& > :not(:last-child))", [
            a("--tw-sort", "column-gap"),
            a("--tw-space-y-reverse", "0"),
            a("margin-block-start", `calc(${i} * var(--tw-space-y-reverse))`),
            a(
              "margin-block-end",
              `calc(${i} * calc(1 - var(--tw-space-y-reverse)))`
            ),
          ]),
        ],
        { supportsNegative: !0 }
      ),
      e("space-x-reverse", [
        () => U([$("--tw-space-x-reverse", "0")]),
        () =>
          _(":where(& > :not(:last-child))", [
            a("--tw-sort", "row-gap"),
            a("--tw-space-x-reverse", "1"),
          ]),
      ]),
      e("space-y-reverse", [
        () => U([$("--tw-space-y-reverse", "0")]),
        () =>
          _(":where(& > :not(:last-child))", [
            a("--tw-sort", "column-gap"),
            a("--tw-space-y-reverse", "1"),
          ]),
      ]),
      e("accent-auto", [["accent-color", "auto"]]),
      s("accent", {
        themeKeys: ["--accent-color", "--color"],
        handle: (i) => [a("accent-color", i)],
      }),
      s("caret", {
        themeKeys: ["--caret-color", "--color"],
        handle: (i) => [a("caret-color", i)],
      }),
      s("divide", {
        themeKeys: ["--divide-color", "--color"],
        handle: (i) => [
          _(":where(& > :not(:last-child))", [
            a("--tw-sort", "divide-color"),
            a("border-color", i),
          ]),
        ],
      }),
      e("place-self-auto", [["place-self", "auto"]]),
      e("place-self-start", [["place-self", "start"]]),
      e("place-self-end", [["place-self", "end"]]),
      e("place-self-center", [["place-self", "center"]]),
      e("place-self-stretch", [["place-self", "stretch"]]),
      e("self-auto", [["align-self", "auto"]]),
      e("self-start", [["align-self", "flex-start"]]),
      e("self-end", [["align-self", "flex-end"]]),
      e("self-center", [["align-self", "center"]]),
      e("self-stretch", [["align-self", "stretch"]]),
      e("self-baseline", [["align-self", "baseline"]]),
      e("justify-self-auto", [["justify-self", "auto"]]),
      e("justify-self-start", [["justify-self", "flex-start"]]),
      e("justify-self-end", [["justify-self", "flex-end"]]),
      e("justify-self-center", [["justify-self", "center"]]),
      e("justify-self-stretch", [["justify-self", "stretch"]]);
    for (let i of ["auto", "hidden", "clip", "visible", "scroll"])
      e(`overflow-${i}`, [["overflow", i]]),
        e(`overflow-x-${i}`, [["overflow-x", i]]),
        e(`overflow-y-${i}`, [["overflow-y", i]]);
    for (let i of ["auto", "contain", "none"])
      e(`overscroll-${i}`, [["overscroll-behavior", i]]),
        e(`overscroll-x-${i}`, [["overscroll-behavior-x", i]]),
        e(`overscroll-y-${i}`, [["overscroll-behavior-y", i]]);
    e("scroll-auto", [["scroll-behavior", "auto"]]),
      e("scroll-smooth", [["scroll-behavior", "smooth"]]),
      e("truncate", [
        ["overflow", "hidden"],
        ["text-overflow", "ellipsis"],
        ["white-space", "nowrap"],
      ]),
      e("text-ellipsis", [["text-overflow", "ellipsis"]]),
      e("text-clip", [["text-overflow", "clip"]]),
      e("hyphens-none", [
        ["-webkit-hyphens", "none"],
        ["hyphens", "none"],
      ]),
      e("hyphens-manual", [
        ["-webkit-hyphens", "manual"],
        ["hyphens", "manual"],
      ]),
      e("hyphens-auto", [
        ["-webkit-hyphens", "auto"],
        ["hyphens", "auto"],
      ]),
      e("whitespace-normal", [["white-space", "normal"]]),
      e("whitespace-nowrap", [["white-space", "nowrap"]]),
      e("whitespace-pre", [["white-space", "pre"]]),
      e("whitespace-pre-line", [["white-space", "pre-line"]]),
      e("whitespace-pre-wrap", [["white-space", "pre-wrap"]]),
      e("whitespace-break-spaces", [["white-space", "break-spaces"]]),
      e("text-wrap", [["text-wrap", "wrap"]]),
      e("text-nowrap", [["text-wrap", "nowrap"]]),
      e("text-balance", [["text-wrap", "balance"]]),
      e("text-pretty", [["text-wrap", "pretty"]]),
      e("break-normal", [
        ["overflow-wrap", "normal"],
        ["word-break", "normal"],
      ]),
      e("break-words", [["overflow-wrap", "break-word"]]),
      e("break-all", [["word-break", "break-all"]]),
      e("break-keep", [["word-break", "keep-all"]]),
      !1;
    for (let [i, u] of [
      ["rounded", ["border-radius"]],
      ["rounded-s", ["border-start-start-radius", "border-end-start-radius"]],
      ["rounded-e", ["border-start-end-radius", "border-end-end-radius"]],
      ["rounded-t", ["border-top-left-radius", "border-top-right-radius"]],
      ["rounded-r", ["border-top-right-radius", "border-bottom-right-radius"]],
      [
        "rounded-b",
        ["border-bottom-right-radius", "border-bottom-left-radius"],
      ],
      ["rounded-l", ["border-top-left-radius", "border-bottom-left-radius"]],
      ["rounded-ss", ["border-start-start-radius"]],
      ["rounded-se", ["border-start-end-radius"]],
      ["rounded-ee", ["border-end-end-radius"]],
      ["rounded-es", ["border-end-start-radius"]],
      ["rounded-tl", ["border-top-left-radius"]],
      ["rounded-tr", ["border-top-right-radius"]],
      ["rounded-br", ["border-bottom-right-radius"]],
      ["rounded-bl", ["border-bottom-left-radius"]],
    ])
      e(
        `${i}-none`,
        u.map((h) => [h, "0"])
      ),
        e(
          `${i}-full`,
          u.map((h) => [h, "calc(infinity * 1px)"])
        ),
        o(i, { themeKeys: ["--radius"], handle: (h) => u.map((x) => a(x, h)) });
    e("border-solid", [
      ["--tw-border-style", "solid"],
      ["border-style", "solid"],
    ]),
      e("border-dashed", [
        ["--tw-border-style", "dashed"],
        ["border-style", "dashed"],
      ]),
      e("border-dotted", [
        ["--tw-border-style", "dotted"],
        ["border-style", "dotted"],
      ]),
      e("border-double", [
        ["--tw-border-style", "double"],
        ["border-style", "double"],
      ]),
      e("border-hidden", [
        ["--tw-border-style", "hidden"],
        ["border-style", "hidden"],
      ]),
      e("border-none", [
        ["--tw-border-style", "none"],
        ["border-style", "none"],
      ]);
    {
      let u = function (h, x) {
        r.functional(h, (v) => {
          if (!v.value) {
            if (v.modifier) return;
            let N = t.get(["--default-border-width"]) ?? "1px",
              E = x.width(N);
            return E ? [i(), ...E] : void 0;
          }
          if (v.value.kind === "arbitrary") {
            let N = v.value.value;
            switch (
              v.value.dataType ??
              j(N, ["color", "line-width", "length"])
            ) {
              case "line-width":
              case "length": {
                if (v.modifier) return;
                let S = x.width(N);
                return S ? [i(), ...S] : void 0;
              }
              default:
                return (
                  (N = W(N, v.modifier, t)), N === null ? void 0 : x.color(N)
                );
            }
          }
          {
            let N = G(v, t, ["--border-color", "--color"]);
            if (N) return x.color(N);
          }
          {
            if (v.modifier) return;
            let N = t.resolve(v.value.value, ["--border-width"]);
            if (N) {
              let E = x.width(N);
              return E ? [i(), ...E] : void 0;
            }
            if (V(v.value.value)) {
              let E = x.width(`${v.value.value}px`);
              return E ? [i(), ...E] : void 0;
            }
          }
        }),
          n(h, () => [
            {
              values: ["current", "inherit", "transparent"],
              valueThemeKeys: ["--border-color", "--color"],
              modifiers: Array.from({ length: 21 }, (v, N) => `${N * 5}`),
              hasDefaultValue: !0,
            },
            {
              values: ["0", "2", "4", "8"],
              valueThemeKeys: ["--border-width"],
            },
          ]);
      };
      var A = u;
      let i = () => U([$("--tw-border-style", "solid")]);
      u("border", {
        width: (h) => [
          a("border-style", "var(--tw-border-style)"),
          a("border-width", h),
        ],
        color: (h) => [a("border-color", h)],
      }),
        u("border-x", {
          width: (h) => [
            a("border-inline-style", "var(--tw-border-style)"),
            a("border-inline-width", h),
          ],
          color: (h) => [a("border-inline-color", h)],
        }),
        u("border-y", {
          width: (h) => [
            a("border-block-style", "var(--tw-border-style)"),
            a("border-block-width", h),
          ],
          color: (h) => [a("border-block-color", h)],
        }),
        u("border-s", {
          width: (h) => [
            a("border-inline-start-style", "var(--tw-border-style)"),
            a("border-inline-start-width", h),
          ],
          color: (h) => [a("border-inline-start-color", h)],
        }),
        u("border-e", {
          width: (h) => [
            a("border-inline-end-style", "var(--tw-border-style)"),
            a("border-inline-end-width", h),
          ],
          color: (h) => [a("border-inline-end-color", h)],
        }),
        u("border-t", {
          width: (h) => [
            a("border-top-style", "var(--tw-border-style)"),
            a("border-top-width", h),
          ],
          color: (h) => [a("border-top-color", h)],
        }),
        u("border-r", {
          width: (h) => [
            a("border-right-style", "var(--tw-border-style)"),
            a("border-right-width", h),
          ],
          color: (h) => [a("border-right-color", h)],
        }),
        u("border-b", {
          width: (h) => [
            a("border-bottom-style", "var(--tw-border-style)"),
            a("border-bottom-width", h),
          ],
          color: (h) => [a("border-bottom-color", h)],
        }),
        u("border-l", {
          width: (h) => [
            a("border-left-style", "var(--tw-border-style)"),
            a("border-left-width", h),
          ],
          color: (h) => [a("border-left-color", h)],
        }),
        o("divide-x", {
          defaultValue: t.get(["--default-border-width"]) ?? "1px",
          themeKeys: ["--divide-width", "--border-width"],
          handleBareValue: ({ value: h }) => (V(h) ? `${h}px` : null),
          handle: (h) => [
            U([$("--tw-divide-x-reverse", "0")]),
            _(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-x-width"),
              i(),
              a("--tw-divide-x-reverse", "0"),
              a("border-inline-style", "var(--tw-border-style)"),
              a(
                "border-inline-start-width",
                `calc(${h} * var(--tw-divide-x-reverse))`
              ),
              a(
                "border-inline-end-width",
                `calc(${h} * calc(1 - var(--tw-divide-x-reverse)))`
              ),
            ]),
          ],
        }),
        o("divide-y", {
          defaultValue: t.get(["--default-border-width"]) ?? "1px",
          themeKeys: ["--divide-width", "--border-width"],
          handleBareValue: ({ value: h }) => (V(h) ? `${h}px` : null),
          handle: (h) => [
            U([$("--tw-divide-y-reverse", "0")]),
            _(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-y-width"),
              i(),
              a("--tw-divide-y-reverse", "0"),
              a("border-bottom-style", "var(--tw-border-style)"),
              a("border-top-style", "var(--tw-border-style)"),
              a("border-top-width", `calc(${h} * var(--tw-divide-y-reverse))`),
              a(
                "border-bottom-width",
                `calc(${h} * calc(1 - var(--tw-divide-y-reverse)))`
              ),
            ]),
          ],
        }),
        n("divide-x", () => [
          {
            values: ["0", "2", "4", "8"],
            valueThemeKeys: ["--divide-width", "--border-width"],
            hasDefaultValue: !0,
          },
        ]),
        n("divide-y", () => [
          {
            values: ["0", "2", "4", "8"],
            valueThemeKeys: ["--divide-width", "--border-width"],
            hasDefaultValue: !0,
          },
        ]),
        e("divide-x-reverse", [
          () => U([$("--tw-divide-x-reverse", "0")]),
          () =>
            _(":where(& > :not(:last-child))", [
              a("--tw-divide-x-reverse", "1"),
            ]),
        ]),
        e("divide-y-reverse", [
          () => U([$("--tw-divide-y-reverse", "0")]),
          () =>
            _(":where(& > :not(:last-child))", [
              a("--tw-divide-y-reverse", "1"),
            ]),
        ]);
      for (let h of ["solid", "dashed", "dotted", "double", "none"])
        e(`divide-${h}`, [
          () =>
            _(":where(& > :not(:last-child))", [
              a("--tw-sort", "divide-style"),
              a("--tw-border-style", h),
              a("border-style", h),
            ]),
        ]);
    }
    e("bg-auto", [["background-size", "auto"]]),
      e("bg-cover", [["background-size", "cover"]]),
      e("bg-contain", [["background-size", "contain"]]),
      e("bg-fixed", [["background-attachment", "fixed"]]),
      e("bg-local", [["background-attachment", "local"]]),
      e("bg-scroll", [["background-attachment", "scroll"]]),
      e("bg-center", [["background-position", "center"]]),
      e("bg-top", [["background-position", "top"]]),
      e("bg-right-top", [["background-position", "right top"]]),
      e("bg-right", [["background-position", "right"]]),
      e("bg-right-bottom", [["background-position", "right bottom"]]),
      e("bg-bottom", [["background-position", "bottom"]]),
      e("bg-left-bottom", [["background-position", "left bottom"]]),
      e("bg-left", [["background-position", "left"]]),
      e("bg-left-top", [["background-position", "left top"]]),
      e("bg-repeat", [["background-repeat", "repeat"]]),
      e("bg-no-repeat", [["background-repeat", "no-repeat"]]),
      e("bg-repeat-x", [["background-repeat", "repeat-x"]]),
      e("bg-repeat-y", [["background-repeat", "repeat-y"]]),
      e("bg-repeat-round", [["background-repeat", "round"]]),
      e("bg-repeat-space", [["background-repeat", "space"]]),
      e("bg-none", [["background-image", "none"]]);
    {
      let h = function (N) {
          let E = "in oklab";
          if (N?.kind === "named")
            switch (N.value) {
              case "longer":
              case "shorter":
              case "increasing":
              case "decreasing":
                E = `in oklch ${N.value} hue`;
                break;
              default:
                E = `in ${N.value}`;
            }
          else N?.kind === "arbitrary" && (E = N.value);
          return E;
        },
        x = function ({ negative: N }) {
          return (E) => {
            if (!E.value) return;
            if (E.value.kind === "arbitrary") {
              if (E.modifier) return;
              let I = E.value.value;
              switch (E.value.dataType ?? j(I, ["angle"])) {
                case "angle":
                  return (
                    (I = N ? `calc(${I} * -1)` : `${I}`),
                    [
                      a("--tw-gradient-position", I),
                      a(
                        "background-image",
                        `linear-gradient(var(--tw-gradient-stops,${I}))`
                      ),
                    ]
                  );
                default:
                  return N
                    ? void 0
                    : [
                        a("--tw-gradient-position", I),
                        a(
                          "background-image",
                          `linear-gradient(var(--tw-gradient-stops,${I}))`
                        ),
                      ];
              }
            }
            let S = E.value.value;
            if (!N && u.has(S)) S = u.get(S);
            else if (V(S)) S = N ? `calc(${S}deg * -1)` : `${S}deg`;
            else return;
            let C = h(E.modifier);
            return [
              a("--tw-gradient-position", `${S} ${C}`),
              a(
                "background-image",
                "linear-gradient(var(--tw-gradient-stops))"
              ),
            ];
          };
        },
        v = function ({ negative: N }) {
          return (E) => {
            if (E.value?.kind === "arbitrary") {
              if (E.modifier) return;
              let I = E.value.value;
              return [
                a("--tw-gradient-position", I),
                a(
                  "background-image",
                  `conic-gradient(var(--tw-gradient-stops,${I}))`
                ),
              ];
            }
            let S = h(E.modifier);
            if (!E.value)
              return [
                a("--tw-gradient-position", S),
                a(
                  "background-image",
                  "conic-gradient(var(--tw-gradient-stops))"
                ),
              ];
            let C = E.value.value;
            if (V(C))
              return (
                (C = N ? `calc(${C} * -1)` : `${C}deg`),
                [
                  a("--tw-gradient-position", `from ${C} ${S}`),
                  a(
                    "background-image",
                    "conic-gradient(var(--tw-gradient-stops))"
                  ),
                ]
              );
          };
        };
      var w = h,
        T = x,
        z = v;
      let i = [
          "oklab",
          "oklch",
          "srgb",
          "hsl",
          "longer",
          "shorter",
          "increasing",
          "decreasing",
        ],
        u = new Map([
          ["to-t", "to top"],
          ["to-tr", "to top right"],
          ["to-r", "to right"],
          ["to-br", "to bottom right"],
          ["to-b", "to bottom"],
          ["to-bl", "to bottom left"],
          ["to-l", "to left"],
          ["to-tl", "to top left"],
        ]);
      r.functional("-bg-linear", x({ negative: !0 })),
        r.functional("bg-linear", x({ negative: !1 })),
        n("bg-linear", () => [
          { values: [...u.keys()], modifiers: i },
          {
            values: [
              "0",
              "30",
              "60",
              "90",
              "120",
              "150",
              "180",
              "210",
              "240",
              "270",
              "300",
              "330",
            ],
            supportsNegative: !0,
            modifiers: i,
          },
        ]),
        r.functional("-bg-conic", v({ negative: !0 })),
        r.functional("bg-conic", v({ negative: !1 })),
        n("bg-conic", () => [
          { hasDefaultValue: !0, modifiers: i },
          {
            values: [
              "0",
              "30",
              "60",
              "90",
              "120",
              "150",
              "180",
              "210",
              "240",
              "270",
              "300",
              "330",
            ],
            supportsNegative: !0,
            modifiers: i,
          },
        ]),
        r.functional("bg-radial", (N) => {
          if (!N.value) {
            let E = h(N.modifier);
            return [
              a("--tw-gradient-position", E),
              a(
                "background-image",
                "radial-gradient(var(--tw-gradient-stops))"
              ),
            ];
          }
          if (N.value.kind === "arbitrary") {
            if (N.modifier) return;
            let E = N.value.value;
            return [
              a("--tw-gradient-position", E),
              a(
                "background-image",
                `radial-gradient(var(--tw-gradient-stops,${E}))`
              ),
            ];
          }
        }),
        n("bg-radial", () => [{ hasDefaultValue: !0, modifiers: i }]);
    }
    r.functional("bg", (i) => {
      if (i.value) {
        if (i.value.kind === "arbitrary") {
          let u = i.value.value;
          switch (
            i.value.dataType ??
            j(u, [
              "image",
              "color",
              "percentage",
              "position",
              "bg-size",
              "length",
              "url",
            ])
          ) {
            case "percentage":
            case "position":
              return i.modifier ? void 0 : [a("background-position", u)];
            case "bg-size":
            case "length":
            case "size":
              return i.modifier ? void 0 : [a("background-size", u)];
            case "image":
            case "url":
              return i.modifier ? void 0 : [a("background-image", u)];
            default:
              return (
                (u = W(u, i.modifier, t)),
                u === null ? void 0 : [a("background-color", u)]
              );
          }
        }
        {
          let u = G(i, t, ["--background-color", "--color"]);
          if (u) return [a("background-color", u)];
        }
        {
          if (i.modifier) return;
          let u = t.resolve(i.value.value, ["--background-image"]);
          if (u) return [a("background-image", u)];
        }
      }
    }),
      n("bg", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--background-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
        { values: [], valueThemeKeys: ["--background-image"] },
      ]);
    let b = () =>
      U([
        $("--tw-gradient-position"),
        $("--tw-gradient-from", "#0000", "<color>"),
        $("--tw-gradient-via", "#0000", "<color>"),
        $("--tw-gradient-to", "#0000", "<color>"),
        $("--tw-gradient-stops"),
        $("--tw-gradient-via-stops"),
        $("--tw-gradient-from-position", "0%", "<length-percentage>"),
        $("--tw-gradient-via-position", "50%", "<length-percentage>"),
        $("--tw-gradient-to-position", "100%", "<length-percentage>"),
      ]);
    function k(i, u) {
      r.functional(i, (h) => {
        if (h.value) {
          if (h.value.kind === "arbitrary") {
            let x = h.value.value;
            switch (
              h.value.dataType ??
              j(x, ["color", "length", "percentage"])
            ) {
              case "length":
              case "percentage":
                return h.modifier ? void 0 : u.position(x);
              default:
                return (
                  (x = W(x, h.modifier, t)), x === null ? void 0 : u.color(x)
                );
            }
          }
          {
            let x = G(h, t, ["--background-color", "--color"]);
            if (x) return u.color(x);
          }
          {
            if (h.modifier) return;
            let x = t.resolve(h.value.value, [
              "--gradient-color-stop-positions",
            ]);
            if (x) return u.position(x);
            if (
              h.value.value[h.value.value.length - 1] === "%" &&
              V(h.value.value.slice(0, -1))
            )
              return u.position(h.value.value);
          }
        }
      }),
        n(i, () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--background-color", "--color"],
            modifiers: Array.from({ length: 21 }, (h, x) => `${x * 5}`),
          },
          {
            values: Array.from({ length: 21 }, (h, x) => `${x * 5}%`),
            valueThemeKeys: ["--gradient-color-stop-positions"],
          },
        ]);
    }
    k("from", {
      color: (i) => [
        b(),
        a("--tw-sort", "--tw-gradient-from"),
        a("--tw-gradient-from", i),
        a(
          "--tw-gradient-stops",
          "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))"
        ),
      ],
      position: (i) => [b(), a("--tw-gradient-from-position", i)],
    }),
      e("via-none", [["--tw-gradient-via-stops", "initial"]]),
      k("via", {
        color: (i) => [
          b(),
          a("--tw-sort", "--tw-gradient-via"),
          a("--tw-gradient-via", i),
          a(
            "--tw-gradient-via-stops",
            "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)"
          ),
          a("--tw-gradient-stops", "var(--tw-gradient-via-stops)"),
        ],
        position: (i) => [b(), a("--tw-gradient-via-position", i)],
      }),
      k("to", {
        color: (i) => [
          b(),
          a("--tw-sort", "--tw-gradient-to"),
          a("--tw-gradient-to", i),
          a(
            "--tw-gradient-stops",
            "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))"
          ),
        ],
        position: (i) => [b(), a("--tw-gradient-to-position", i)],
      }),
      e("box-decoration-slice", [
        ["-webkit-box-decoration-break", "slice"],
        ["box-decoration-break", "slice"],
      ]),
      e("box-decoration-clone", [
        ["-webkit-box-decoration-break", "clone"],
        ["box-decoration-break", "clone"],
      ]),
      e("bg-clip-text", [["background-clip", "text"]]),
      e("bg-clip-border", [["background-clip", "border-box"]]),
      e("bg-clip-padding", [["background-clip", "padding-box"]]),
      e("bg-clip-content", [["background-clip", "content-box"]]),
      e("bg-origin-border", [["background-origin", "border-box"]]),
      e("bg-origin-padding", [["background-origin", "padding-box"]]),
      e("bg-origin-content", [["background-origin", "content-box"]]);
    for (let i of [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
    ])
      e(`bg-blend-${i}`, [["background-blend-mode", i]]),
        e(`mix-blend-${i}`, [["mix-blend-mode", i]]);
    e("mix-blend-plus-darker", [["mix-blend-mode", "plus-darker"]]),
      e("mix-blend-plus-lighter", [["mix-blend-mode", "plus-lighter"]]),
      e("fill-none", [["fill", "none"]]),
      r.functional("fill", (i) => {
        if (!i.value) return;
        if (i.value.kind === "arbitrary") {
          let h = W(i.value.value, i.modifier, t);
          return h === null ? void 0 : [a("fill", h)];
        }
        let u = G(i, t, ["--fill", "--color"]);
        if (u) return [a("fill", u)];
      }),
      n("fill", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--fill", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
      ]),
      e("stroke-none", [["stroke", "none"]]),
      r.functional("stroke", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let u = i.value.value;
            switch (
              i.value.dataType ??
              j(u, ["color", "number", "length", "percentage"])
            ) {
              case "number":
              case "length":
              case "percentage":
                return i.modifier ? void 0 : [a("stroke-width", u)];
              default:
                return (
                  (u = W(i.value.value, i.modifier, t)),
                  u === null ? void 0 : [a("stroke", u)]
                );
            }
          }
          {
            let u = G(i, t, ["--stroke", "--color"]);
            if (u) return [a("stroke", u)];
          }
          {
            let u = t.resolve(i.value.value, ["--stroke-width"]);
            if (u) return [a("stroke-width", u)];
            if (V(i.value.value)) return [a("stroke-width", i.value.value)];
          }
        }
      }),
      n("stroke", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--stroke", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
        { values: ["0", "1", "2", "3"], valueThemeKeys: ["--stroke-width"] },
      ]),
      e("object-contain", [["object-fit", "contain"]]),
      e("object-cover", [["object-fit", "cover"]]),
      e("object-fill", [["object-fit", "fill"]]),
      e("object-none", [["object-fit", "none"]]),
      e("object-scale-down", [["object-fit", "scale-down"]]),
      e("object-bottom", [["object-position", "bottom"]]),
      e("object-center", [["object-position", "center"]]),
      e("object-left", [["object-position", "left"]]),
      e("object-left-bottom", [["object-position", "left bottom"]]),
      e("object-left-top", [["object-position", "left top"]]),
      e("object-right", [["object-position", "right"]]),
      e("object-right-bottom", [["object-position", "right bottom"]]),
      e("object-right-top", [["object-position", "right top"]]),
      e("object-top", [["object-position", "top"]]),
      o("object", {
        themeKeys: ["--object-position"],
        handle: (i) => [a("object-position", i)],
      });
    for (let [i, u] of [
      ["p", "padding"],
      ["px", "padding-inline"],
      ["py", "padding-block"],
      ["ps", "padding-inline-start"],
      ["pe", "padding-inline-end"],
      ["pt", "padding-top"],
      ["pr", "padding-right"],
      ["pb", "padding-bottom"],
      ["pl", "padding-left"],
    ])
      l(i, ["--padding", "--spacing"], (h) => [a(u, h)]);
    e("text-left", [["text-align", "left"]]),
      e("text-center", [["text-align", "center"]]),
      e("text-right", [["text-align", "right"]]),
      e("text-justify", [["text-align", "justify"]]),
      e("text-start", [["text-align", "start"]]),
      e("text-end", [["text-align", "end"]]),
      l(
        "indent",
        ["--text-indent", "--spacing"],
        (i) => [a("text-indent", i)],
        { supportsNegative: !0 }
      ),
      e("align-baseline", [["vertical-align", "baseline"]]),
      e("align-top", [["vertical-align", "top"]]),
      e("align-middle", [["vertical-align", "middle"]]),
      e("align-bottom", [["vertical-align", "bottom"]]),
      e("align-text-top", [["vertical-align", "text-top"]]),
      e("align-text-bottom", [["vertical-align", "text-bottom"]]),
      e("align-sub", [["vertical-align", "sub"]]),
      e("align-super", [["vertical-align", "super"]]),
      o("align", { themeKeys: [], handle: (i) => [a("vertical-align", i)] }),
      r.functional("font", (i) => {
        if (!(!i.value || i.modifier)) {
          if (i.value.kind === "arbitrary") {
            let u = i.value.value;
            switch (
              i.value.dataType ??
              j(u, ["number", "generic-name", "family-name"])
            ) {
              case "generic-name":
              case "family-name":
                return [a("font-family", u)];
              default:
                return [
                  U([$("--tw-font-weight")]),
                  a("--tw-font-weight", u),
                  a("font-weight", u),
                ];
            }
          }
          {
            let u = t.resolveWith(
              i.value.value,
              ["--font"],
              ["--font-feature-settings", "--font-variation-settings"]
            );
            if (u) {
              let [h, x = {}] = u;
              return [
                a("font-family", h),
                a("font-feature-settings", x["--font-feature-settings"]),
                a("font-variation-settings", x["--font-variation-settings"]),
              ];
            }
          }
          {
            let u = t.resolve(i.value.value, ["--font-weight"]);
            if (u)
              return [
                U([$("--tw-font-weight")]),
                a("--tw-font-weight", u),
                a("font-weight", u),
              ];
          }
        }
      }),
      n("font", () => [
        { values: [], valueThemeKeys: ["--font"] },
        { values: [], valueThemeKeys: ["--font-weight"] },
      ]),
      e("uppercase", [["text-transform", "uppercase"]]),
      e("lowercase", [["text-transform", "lowercase"]]),
      e("capitalize", [["text-transform", "capitalize"]]),
      e("normal-case", [["text-transform", "none"]]),
      e("italic", [["font-style", "italic"]]),
      e("not-italic", [["font-style", "normal"]]),
      e("underline", [["text-decoration-line", "underline"]]),
      e("overline", [["text-decoration-line", "overline"]]),
      e("line-through", [["text-decoration-line", "line-through"]]),
      e("no-underline", [["text-decoration-line", "none"]]),
      e("font-stretch-normal", [["font-stretch", "normal"]]),
      e("font-stretch-ultra-condensed", [["font-stretch", "ultra-condensed"]]),
      e("font-stretch-extra-condensed", [["font-stretch", "extra-condensed"]]),
      e("font-stretch-condensed", [["font-stretch", "condensed"]]),
      e("font-stretch-semi-condensed", [["font-stretch", "semi-condensed"]]),
      e("font-stretch-semi-expanded", [["font-stretch", "semi-expanded"]]),
      e("font-stretch-expanded", [["font-stretch", "expanded"]]),
      e("font-stretch-extra-expanded", [["font-stretch", "extra-expanded"]]),
      e("font-stretch-ultra-expanded", [["font-stretch", "ultra-expanded"]]),
      o("font-stretch", {
        handleBareValue: ({ value: i }) => {
          if (!i.endsWith("%")) return null;
          let u = Number(i.slice(0, -1));
          return !V(u) || Number.isNaN(u) || u < 50 || u > 200 ? null : i;
        },
        handle: (i) => [a("font-stretch", i)],
      }),
      n("font-stretch", () => [
        {
          values: [
            "50%",
            "75%",
            "90%",
            "95%",
            "100%",
            "105%",
            "110%",
            "125%",
            "150%",
            "200%",
          ],
        },
      ]),
      s("placeholder", {
        themeKeys: ["--background-color", "--color"],
        handle: (i) => [
          _("&::placeholder", [
            a("--tw-sort", "placeholder-color"),
            a("color", i),
          ]),
        ],
      }),
      e("decoration-solid", [["text-decoration-style", "solid"]]),
      e("decoration-double", [["text-decoration-style", "double"]]),
      e("decoration-dotted", [["text-decoration-style", "dotted"]]),
      e("decoration-dashed", [["text-decoration-style", "dashed"]]),
      e("decoration-wavy", [["text-decoration-style", "wavy"]]),
      e("decoration-auto", [["text-decoration-thickness", "auto"]]),
      e("decoration-from-font", [["text-decoration-thickness", "from-font"]]),
      r.functional("decoration", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let u = i.value.value;
            switch (
              i.value.dataType ??
              j(u, ["color", "length", "percentage"])
            ) {
              case "length":
              case "percentage":
                return i.modifier
                  ? void 0
                  : [a("text-decoration-thickness", u)];
              default:
                return (
                  (u = W(u, i.modifier, t)),
                  u === null ? void 0 : [a("text-decoration-color", u)]
                );
            }
          }
          {
            let u = t.resolve(i.value.value, ["--text-decoration-thickness"]);
            if (u)
              return i.modifier ? void 0 : [a("text-decoration-thickness", u)];
            if (V(i.value.value))
              return i.modifier
                ? void 0
                : [a("text-decoration-thickness", `${i.value.value}px`)];
          }
          {
            let u = G(i, t, ["--text-decoration-color", "--color"]);
            if (u) return [a("text-decoration-color", u)];
          }
        }
      }),
      n("decoration", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--text-decoration-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
        {
          values: ["0", "1", "2"],
          valueThemeKeys: ["--text-decoration-thickness"],
        },
      ]),
      e("animate-none", [["animation", "none"]]),
      o("animate", {
        themeKeys: ["--animate"],
        handle: (i) => [a("animation", i)],
      });
    {
      let i = [
          "var(--tw-blur,)",
          "var(--tw-brightness,)",
          "var(--tw-contrast,)",
          "var(--tw-grayscale,)",
          "var(--tw-hue-rotate,)",
          "var(--tw-invert,)",
          "var(--tw-saturate,)",
          "var(--tw-sepia,)",
          "var(--tw-drop-shadow,)",
        ].join(" "),
        u = [
          "var(--tw-backdrop-blur,)",
          "var(--tw-backdrop-brightness,)",
          "var(--tw-backdrop-contrast,)",
          "var(--tw-backdrop-grayscale,)",
          "var(--tw-backdrop-hue-rotate,)",
          "var(--tw-backdrop-invert,)",
          "var(--tw-backdrop-opacity,)",
          "var(--tw-backdrop-saturate,)",
          "var(--tw-backdrop-sepia,)",
        ].join(" "),
        h = () =>
          U([
            $("--tw-blur"),
            $("--tw-brightness"),
            $("--tw-contrast"),
            $("--tw-grayscale"),
            $("--tw-hue-rotate"),
            $("--tw-invert"),
            $("--tw-opacity"),
            $("--tw-saturate"),
            $("--tw-sepia"),
            $("--tw-drop-shadow"),
          ]),
        x = () =>
          U([
            $("--tw-backdrop-blur"),
            $("--tw-backdrop-brightness"),
            $("--tw-backdrop-contrast"),
            $("--tw-backdrop-grayscale"),
            $("--tw-backdrop-hue-rotate"),
            $("--tw-backdrop-invert"),
            $("--tw-backdrop-opacity"),
            $("--tw-backdrop-saturate"),
            $("--tw-backdrop-sepia"),
          ]);
      r.functional("filter", (v) => {
        if (!v.modifier) {
          if (v.value === null) return [h(), a("filter", i)];
          if (v.value.kind === "arbitrary") return [a("filter", v.value.value)];
          switch (v.value.value) {
            case "none":
              return [a("filter", "none")];
          }
        }
      }),
        r.functional("backdrop-filter", (v) => {
          if (!v.modifier) {
            if (v.value === null)
              return [
                x(),
                a("-webkit-backdrop-filter", u),
                a("backdrop-filter", u),
              ];
            if (v.value.kind === "arbitrary")
              return [
                a("-webkit-backdrop-filter", v.value.value),
                a("backdrop-filter", v.value.value),
              ];
            switch (v.value.value) {
              case "none":
                return [
                  a("-webkit-backdrop-filter", "none"),
                  a("backdrop-filter", "none"),
                ];
            }
          }
        }),
        o("blur", {
          themeKeys: ["--blur"],
          handle: (v) => [h(), a("--tw-blur", `blur(${v})`), a("filter", i)],
        }),
        e("blur-none", [h, ["--tw-blur", " "], ["filter", i]]),
        o("backdrop-blur", {
          themeKeys: ["--backdrop-blur", "--blur"],
          handle: (v) => [
            x(),
            a("--tw-backdrop-blur", `blur(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        e("backdrop-blur-none", [
          x,
          ["--tw-backdrop-blur", " "],
          ["-webkit-backdrop-filter", u],
          ["backdrop-filter", u],
        ]),
        o("brightness", {
          themeKeys: ["--brightness"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            h(),
            a("--tw-brightness", `brightness(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-brightness", {
          themeKeys: ["--backdrop-brightness", "--brightness"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            x(),
            a("--tw-backdrop-brightness", `brightness(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("brightness", () => [
          {
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--brightness"],
          },
        ]),
        n("backdrop-brightness", () => [
          {
            values: [
              "0",
              "50",
              "75",
              "90",
              "95",
              "100",
              "105",
              "110",
              "125",
              "150",
              "200",
            ],
            valueThemeKeys: ["--backdrop-brightness", "--brightness"],
          },
        ]),
        o("contrast", {
          themeKeys: ["--contrast"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            h(),
            a("--tw-contrast", `contrast(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-contrast", {
          themeKeys: ["--backdrop-contrast", "--contrast"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            x(),
            a("--tw-backdrop-contrast", `contrast(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("contrast", () => [
          {
            values: ["0", "50", "75", "100", "125", "150", "200"],
            valueThemeKeys: ["--contrast"],
          },
        ]),
        n("backdrop-contrast", () => [
          {
            values: ["0", "50", "75", "100", "125", "150", "200"],
            valueThemeKeys: ["--backdrop-contrast", "--contrast"],
          },
        ]),
        o("grayscale", {
          themeKeys: ["--grayscale"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [
            h(),
            a("--tw-grayscale", `grayscale(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-grayscale", {
          themeKeys: ["--backdrop-grayscale", "--grayscale"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [
            x(),
            a("--tw-backdrop-grayscale", `grayscale(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("grayscale", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--grayscale"],
            hasDefaultValue: !0,
          },
        ]),
        n("backdrop-grayscale", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--backdrop-grayscale", "--grayscale"],
            hasDefaultValue: !0,
          },
        ]),
        o("hue-rotate", {
          supportsNegative: !0,
          themeKeys: ["--hue-rotate"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}deg` : null),
          handle: (v) => [
            h(),
            a("--tw-hue-rotate", `hue-rotate(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-hue-rotate", {
          supportsNegative: !0,
          themeKeys: ["--backdrop-hue-rotate", "--hue-rotate"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}deg` : null),
          handle: (v) => [
            x(),
            a("--tw-backdrop-hue-rotate", `hue-rotate(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("hue-rotate", () => [
          {
            values: ["0", "15", "30", "60", "90", "180"],
            valueThemeKeys: ["--hue-rotate"],
          },
        ]),
        n("backdrop-hue-rotate", () => [
          {
            values: ["0", "15", "30", "60", "90", "180"],
            valueThemeKeys: ["--backdrop-hue-rotate", "--hue-rotate"],
          },
        ]),
        o("invert", {
          themeKeys: ["--invert"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [
            h(),
            a("--tw-invert", `invert(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-invert", {
          themeKeys: ["--backdrop-invert", "--invert"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [
            x(),
            a("--tw-backdrop-invert", `invert(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("invert", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--invert"],
            hasDefaultValue: !0,
          },
        ]),
        n("backdrop-invert", () => [
          {
            values: ["0", "25", "50", "75", "100"],
            valueThemeKeys: ["--backdrop-invert", "--invert"],
            hasDefaultValue: !0,
          },
        ]),
        o("saturate", {
          themeKeys: ["--saturate"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            h(),
            a("--tw-saturate", `saturate(${v})`),
            a("filter", i),
          ],
        }),
        o("backdrop-saturate", {
          themeKeys: ["--backdrop-saturate", "--saturate"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          handle: (v) => [
            x(),
            a("--tw-backdrop-saturate", `saturate(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("saturate", () => [
          {
            values: ["0", "50", "100", "150", "200"],
            valueThemeKeys: ["--saturate"],
          },
        ]),
        n("backdrop-saturate", () => [
          {
            values: ["0", "50", "100", "150", "200"],
            valueThemeKeys: ["--backdrop-saturate", "--saturate"],
          },
        ]),
        o("sepia", {
          themeKeys: ["--sepia"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [h(), a("--tw-sepia", `sepia(${v})`), a("filter", i)],
        }),
        o("backdrop-sepia", {
          themeKeys: ["--backdrop-sepia", "--sepia"],
          handleBareValue: ({ value: v }) => (V(v) ? `${v}%` : null),
          defaultValue: "100%",
          handle: (v) => [
            x(),
            a("--tw-backdrop-sepia", `sepia(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("sepia", () => [
          {
            values: ["0", "50", "100"],
            valueThemeKeys: ["--sepia"],
            hasDefaultValue: !0,
          },
        ]),
        n("backdrop-sepia", () => [
          {
            values: ["0", "50", "100"],
            valueThemeKeys: ["--backdrop-sepia", "--sepia"],
            hasDefaultValue: !0,
          },
        ]),
        e("drop-shadow-none", [h, ["--tw-drop-shadow", " "], ["filter", i]]),
        o("drop-shadow", {
          themeKeys: ["--drop-shadow"],
          handle: (v) => [
            h(),
            a(
              "--tw-drop-shadow",
              O(v, ",")
                .map((N) => `drop-shadow(${N})`)
                .join(" ")
            ),
            a("filter", i),
          ],
        }),
        o("backdrop-opacity", {
          themeKeys: ["--backdrop-opacity", "--opacity"],
          handleBareValue: ({ value: v }) => (Me(v) ? `${v}%` : null),
          handle: (v) => [
            x(),
            a("--tw-backdrop-opacity", `opacity(${v})`),
            a("-webkit-backdrop-filter", u),
            a("backdrop-filter", u),
          ],
        }),
        n("backdrop-opacity", () => [
          {
            values: Array.from({ length: 21 }, (v, N) => `${N * 5}`),
            valueThemeKeys: ["--backdrop-opacity", "--opacity"],
          },
        ]);
    }
    {
      let i = `var(--tw-ease, ${
          t.resolve(null, ["--default-transition-timing-function"]) ?? "ease"
        })`,
        u = `var(--tw-duration, ${
          t.resolve(null, ["--default-transition-duration"]) ?? "0s"
        })`;
      e("transition-none", [["transition-property", "none"]]),
        e("transition-all", [
          ["transition-property", "all"],
          ["transition-timing-function", i],
          ["transition-duration", u],
        ]),
        e("transition-colors", [
          [
            "transition-property",
            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to",
          ],
          ["transition-timing-function", i],
          ["transition-duration", u],
        ]),
        e("transition-opacity", [
          ["transition-property", "opacity"],
          ["transition-timing-function", i],
          ["transition-duration", u],
        ]),
        e("transition-shadow", [
          ["transition-property", "box-shadow"],
          ["transition-timing-function", i],
          ["transition-duration", u],
        ]),
        e("transition-transform", [
          ["transition-property", "transform, translate, scale, rotate"],
          ["transition-timing-function", i],
          ["transition-duration", u],
        ]),
        o("transition", {
          defaultValue:
            "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter",
          themeKeys: ["--transition-property"],
          handle: (h) => [
            a("transition-property", h),
            a("transition-timing-function", i),
            a("transition-duration", u),
          ],
        }),
        e("transition-discrete", [["transition-behavior", "allow-discrete"]]),
        e("transition-normal", [["transition-behavior", "normal"]]),
        o("delay", {
          handleBareValue: ({ value: h }) => (V(h) ? `${h}ms` : null),
          themeKeys: ["--transition-delay"],
          handle: (h) => [a("transition-delay", h)],
        });
      {
        let h = () => U([$("--tw-duration")]);
        e("duration-initial", [h, ["--tw-duration", "initial"]]),
          r.functional("duration", (x) => {
            if (x.modifier || !x.value) return;
            let v = null;
            if (
              (x.value.kind === "arbitrary"
                ? (v = x.value.value)
                : ((v = t.resolve(x.value.fraction ?? x.value.value, [
                    "--transition-duration",
                  ])),
                  v === null && V(x.value.value) && (v = `${x.value.value}ms`)),
              v !== null)
            )
              return [h(), a("--tw-duration", v), a("transition-duration", v)];
          });
      }
      n("delay", () => [
        {
          values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
          valueThemeKeys: ["--transition-delay"],
        },
      ]),
        n("duration", () => [
          {
            values: ["75", "100", "150", "200", "300", "500", "700", "1000"],
            valueThemeKeys: ["--transition-duration"],
          },
        ]);
    }
    {
      let i = () => U([$("--tw-ease")]);
      e("ease-initial", [i, ["--tw-ease", "initial"]]),
        e("ease-linear", [
          i,
          ["--tw-ease", "linear"],
          ["transition-timing-function", "linear"],
        ]),
        o("ease", {
          themeKeys: ["--ease"],
          handle: (u) => [
            i(),
            a("--tw-ease", u),
            a("transition-timing-function", u),
          ],
        });
    }
    e("will-change-auto", [["will-change", "auto"]]),
      e("will-change-scroll", [["will-change", "scroll-position"]]),
      e("will-change-contents", [["will-change", "contents"]]),
      e("will-change-transform", [["will-change", "transform"]]),
      o("will-change", { themeKeys: [], handle: (i) => [a("will-change", i)] }),
      e("content-none", [
        ["--tw-content", "none"],
        ["content", "none"],
      ]),
      o("content", {
        themeKeys: [],
        handle: (i) => [
          U([$("--tw-content", '""')]),
          a("--tw-content", i),
          a("content", "var(--tw-content)"),
        ],
      });
    {
      let i =
          "var(--tw-contain-size,) var(--tw-contain-layout,) var(--tw-contain-paint,) var(--tw-contain-style,)",
        u = () =>
          U([
            $("--tw-contain-size"),
            $("--tw-contain-layout"),
            $("--tw-contain-paint"),
            $("--tw-contain-style"),
          ]);
      e("contain-none", [["contain", "none"]]),
        e("contain-content", [["contain", "content"]]),
        e("contain-strict", [["contain", "strict"]]),
        e("contain-size", [u, ["--tw-contain-size", "size"], ["contain", i]]),
        e("contain-inline-size", [
          u,
          ["--tw-contain-size", "inline-size"],
          ["contain", i],
        ]),
        e("contain-layout", [
          u,
          ["--tw-contain-layout", "layout"],
          ["contain", i],
        ]),
        e("contain-paint", [
          u,
          ["--tw-contain-paint", "paint"],
          ["contain", i],
        ]),
        e("contain-style", [
          u,
          ["--tw-contain-style", "style"],
          ["contain", i],
        ]),
        o("contain", { themeKeys: [], handle: (h) => [a("contain", h)] });
    }
    e("forced-color-adjust-none", [["forced-color-adjust", "none"]]),
      e("forced-color-adjust-auto", [["forced-color-adjust", "auto"]]),
      e("leading-none", [
        () => U([$("--tw-leading")]),
        ["--tw-leading", "1"],
        ["line-height", "1"],
      ]),
      l("leading", ["--leading", "--spacing"], (i) => [
        U([$("--tw-leading")]),
        a("--tw-leading", i),
        a("line-height", i),
      ]),
      o("tracking", {
        supportsNegative: !0,
        themeKeys: ["--tracking"],
        handle: (i) => [
          U([$("--tw-tracking")]),
          a("--tw-tracking", i),
          a("letter-spacing", i),
        ],
      }),
      e("antialiased", [
        ["-webkit-font-smoothing", "antialiased"],
        ["-moz-osx-font-smoothing", "grayscale"],
      ]),
      e("subpixel-antialiased", [
        ["-webkit-font-smoothing", "auto"],
        ["-moz-osx-font-smoothing", "auto"],
      ]);
    {
      let i =
          "var(--tw-ordinal,) var(--tw-slashed-zero,) var(--tw-numeric-figure,) var(--tw-numeric-spacing,) var(--tw-numeric-fraction,)",
        u = () =>
          U([
            $("--tw-ordinal"),
            $("--tw-slashed-zero"),
            $("--tw-numeric-figure"),
            $("--tw-numeric-spacing"),
            $("--tw-numeric-fraction"),
          ]);
      e("normal-nums", [["font-variant-numeric", "normal"]]),
        e("ordinal", [
          u,
          ["--tw-ordinal", "ordinal"],
          ["font-variant-numeric", i],
        ]),
        e("slashed-zero", [
          u,
          ["--tw-slashed-zero", "slashed-zero"],
          ["font-variant-numeric", i],
        ]),
        e("lining-nums", [
          u,
          ["--tw-numeric-figure", "lining-nums"],
          ["font-variant-numeric", i],
        ]),
        e("oldstyle-nums", [
          u,
          ["--tw-numeric-figure", "oldstyle-nums"],
          ["font-variant-numeric", i],
        ]),
        e("proportional-nums", [
          u,
          ["--tw-numeric-spacing", "proportional-nums"],
          ["font-variant-numeric", i],
        ]),
        e("tabular-nums", [
          u,
          ["--tw-numeric-spacing", "tabular-nums"],
          ["font-variant-numeric", i],
        ]),
        e("diagonal-fractions", [
          u,
          ["--tw-numeric-fraction", "diagonal-fractions"],
          ["font-variant-numeric", i],
        ]),
        e("stacked-fractions", [
          u,
          ["--tw-numeric-fraction", "stacked-fractions"],
          ["font-variant-numeric", i],
        ]);
    }
    {
      let i = () => U([$("--tw-outline-style", "solid")]);
      r.static("outline-hidden", () => [
        a("--tw-outline-style", "none"),
        a("outline-style", "none"),
        K("@media", "(forced-colors: active)", [
          a("outline", "2px solid transparent"),
          a("outline-offset", "2px"),
        ]),
      ]),
        e("outline-none", [
          ["--tw-outline-style", "none"],
          ["outline-style", "none"],
        ]),
        e("outline-solid", [
          ["--tw-outline-style", "solid"],
          ["outline-style", "solid"],
        ]),
        e("outline-dashed", [
          ["--tw-outline-style", "dashed"],
          ["outline-style", "dashed"],
        ]),
        e("outline-dotted", [
          ["--tw-outline-style", "dotted"],
          ["outline-style", "dotted"],
        ]),
        e("outline-double", [
          ["--tw-outline-style", "double"],
          ["outline-style", "double"],
        ]),
        r.functional("outline", (u) => {
          if (u.value === null) {
            if (u.modifier) return;
            let h = t.get(["--default-outline-width"]) ?? "1px";
            return [
              i(),
              a("outline-style", "var(--tw-outline-style)"),
              a("outline-width", h),
            ];
          }
          if (u.value.kind === "arbitrary") {
            let h = u.value.value;
            switch (
              u.value.dataType ??
              j(h, ["color", "length", "number", "percentage"])
            ) {
              case "length":
              case "number":
              case "percentage":
                return u.modifier
                  ? void 0
                  : [
                      i(),
                      a("outline-style", "var(--tw-outline-style)"),
                      a("outline-width", h),
                    ];
              default:
                return (
                  (h = W(h, u.modifier, t)),
                  h === null ? void 0 : [a("outline-color", h)]
                );
            }
          }
          {
            let h = G(u, t, ["--outline-color", "--color"]);
            if (h) return [a("outline-color", h)];
          }
          {
            if (u.modifier) return;
            let h = t.resolve(u.value.value, ["--outline-width"]);
            if (h)
              return [
                i(),
                a("outline-style", "var(--tw-outline-style)"),
                a("outline-width", h),
              ];
            if (V(u.value.value))
              return [
                i(),
                a("outline-style", "var(--tw-outline-style)"),
                a("outline-width", `${u.value.value}px`),
              ];
          }
        }),
        n("outline", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--outline-color", "--color"],
            modifiers: Array.from({ length: 21 }, (u, h) => `${h * 5}`),
            hasDefaultValue: !0,
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--outline-width"],
          },
        ]),
        o("outline-offset", {
          supportsNegative: !0,
          themeKeys: ["--outline-offset"],
          handleBareValue: ({ value: u }) => (V(u) ? `${u}px` : null),
          handle: (u) => [a("outline-offset", u)],
        }),
        n("outline-offset", () => [
          {
            supportsNegative: !0,
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--outline-offset"],
          },
        ]);
    }
    o("opacity", {
      themeKeys: ["--opacity"],
      handleBareValue: ({ value: i }) => (Me(i) ? `${i}%` : null),
      handle: (i) => [a("opacity", i)],
    }),
      n("opacity", () => [
        {
          values: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
          valueThemeKeys: ["--opacity"],
        },
      ]),
      e("underline-offset-auto", [["text-underline-offset", "auto"]]),
      o("underline-offset", {
        supportsNegative: !0,
        themeKeys: ["--text-underline-offset"],
        handleBareValue: ({ value: i }) => (V(i) ? `${i}px` : null),
        handle: (i) => [a("text-underline-offset", i)],
      }),
      n("underline-offset", () => [
        {
          supportsNegative: !0,
          values: ["0", "1", "2", "4", "8"],
          valueThemeKeys: ["--text-underline-offset"],
        },
      ]),
      r.functional("text", (i) => {
        if (i.value) {
          if (i.value.kind === "arbitrary") {
            let u = i.value.value;
            switch (
              i.value.dataType ??
              j(u, [
                "color",
                "length",
                "percentage",
                "absolute-size",
                "relative-size",
              ])
            ) {
              case "size":
              case "length":
              case "percentage":
              case "absolute-size":
              case "relative-size": {
                if (i.modifier) {
                  let x =
                    i.modifier.kind === "arbitrary"
                      ? i.modifier.value
                      : t.resolve(i.modifier.value, ["--leading"]);
                  if (!x && ge(i.modifier.value)) {
                    let v = t.resolve(null, ["--spacing"]);
                    if (!v) return null;
                    x = `calc(${v} * ${i.modifier.value})`;
                  }
                  return (
                    !x && i.modifier.value === "none" && (x = "1"),
                    x ? [a("font-size", u), a("line-height", x)] : null
                  );
                }
                return [a("font-size", u)];
              }
              default:
                return (
                  (u = W(u, i.modifier, t)),
                  u === null ? void 0 : [a("color", u)]
                );
            }
          }
          {
            let u = G(i, t, ["--text-color", "--color"]);
            if (u) return [a("color", u)];
          }
          {
            let u = t.resolveWith(
              i.value.value,
              ["--text"],
              ["--line-height", "--letter-spacing", "--font-weight"]
            );
            if (u) {
              let [h, x = {}] = Array.isArray(u) ? u : [u];
              if (i.modifier) {
                let v =
                  i.modifier.kind === "arbitrary"
                    ? i.modifier.value
                    : t.resolve(i.modifier.value, ["--leading"]);
                if (!v && ge(i.modifier.value)) {
                  let E = t.resolve(null, ["--spacing"]);
                  if (!E) return null;
                  v = `calc(${E} * ${i.modifier.value})`;
                }
                if ((!v && i.modifier.value === "none" && (v = "1"), !v))
                  return null;
                let N = [a("font-size", h)];
                return v && N.push(a("line-height", v)), N;
              }
              return typeof x == "string"
                ? [a("font-size", h), a("line-height", x)]
                : [
                    a("font-size", h),
                    a(
                      "line-height",
                      x["--line-height"]
                        ? `var(--tw-leading, ${x["--line-height"]})`
                        : void 0
                    ),
                    a(
                      "letter-spacing",
                      x["--letter-spacing"]
                        ? `var(--tw-tracking, ${x["--letter-spacing"]})`
                        : void 0
                    ),
                    a(
                      "font-weight",
                      x["--font-weight"]
                        ? `var(--tw-font-weight, ${x["--font-weight"]})`
                        : void 0
                    ),
                  ];
            }
          }
        }
      }),
      n("text", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--text-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
        {
          values: [],
          valueThemeKeys: ["--text"],
          modifiers: [],
          modifierThemeKeys: ["--leading"],
        },
      ]);
    {
      let v = function (S) {
          return `var(--tw-ring-inset,) 0 0 0 calc(${S} + var(--tw-ring-offset-width)) var(--tw-ring-color, ${x})`;
        },
        N = function (S) {
          return `inset 0 0 0 ${S} var(--tw-inset-ring-color, currentColor)`;
        };
      var R = v,
        D = N;
      let i = [
          "var(--tw-inset-shadow)",
          "var(--tw-inset-ring-shadow)",
          "var(--tw-ring-offset-shadow)",
          "var(--tw-ring-shadow)",
          "var(--tw-shadow)",
        ].join(", "),
        u = "0 0 #0000",
        h = () =>
          U([
            $("--tw-shadow", u),
            $("--tw-shadow-color"),
            $("--tw-inset-shadow", u),
            $("--tw-inset-shadow-color"),
            $("--tw-ring-color"),
            $("--tw-ring-shadow", u),
            $("--tw-inset-ring-color"),
            $("--tw-inset-ring-shadow", u),
            $("--tw-ring-inset"),
            $("--tw-ring-offset-width", "0px", "<length>"),
            $("--tw-ring-offset-color", "#fff"),
            $("--tw-ring-offset-shadow", u),
          ]);
      e("shadow-initial", [h, ["--tw-shadow-color", "initial"]]),
        r.functional("shadow", (S) => {
          if (!S.value) {
            let C = t.get(["--shadow"]);
            return C === null
              ? void 0
              : [
                  h(),
                  a(
                    "--tw-shadow",
                    ce(C, (I) => `var(--tw-shadow-color, ${I})`)
                  ),
                  a("box-shadow", i),
                ];
          }
          if (S.value.kind === "arbitrary") {
            let C = S.value.value;
            switch (S.value.dataType ?? j(C, ["color"])) {
              case "color":
                return (
                  (C = W(C, S.modifier, t)),
                  C === null ? void 0 : [h(), a("--tw-shadow-color", C)]
                );
              default:
                return [
                  h(),
                  a(
                    "--tw-shadow",
                    ce(C, (Oe) => `var(--tw-shadow-color, ${Oe})`)
                  ),
                  a("box-shadow", i),
                ];
            }
          }
          switch (S.value.value) {
            case "none":
              return S.modifier
                ? void 0
                : [h(), a("--tw-shadow", u), a("box-shadow", i)];
          }
          {
            let C = t.get([`--shadow-${S.value.value}`]);
            if (C)
              return S.modifier
                ? void 0
                : [
                    h(),
                    a(
                      "--tw-shadow",
                      ce(C, (I) => `var(--tw-shadow-color, ${I})`)
                    ),
                    a("box-shadow", i),
                  ];
          }
          {
            let C = G(S, t, ["--box-shadow-color", "--color"]);
            if (C) return [h(), a("--tw-shadow-color", C)];
          }
        }),
        n("shadow", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--box-shadow-color", "--color"],
            modifiers: Array.from({ length: 21 }, (S, C) => `${C * 5}`),
          },
          {
            values: ["none"],
            valueThemeKeys: ["--shadow"],
            hasDefaultValue: !0,
          },
        ]),
        e("inset-shadow-initial", [h, ["--tw-inset-shadow-color", "initial"]]),
        r.functional("inset-shadow", (S) => {
          if (!S.value) {
            let C = t.get(["--inset-shadow"]);
            return C === null
              ? void 0
              : [
                  h(),
                  a(
                    "--tw-inset-shadow",
                    ce(C, (I) => `var(--tw-inset-shadow-color, ${I})`)
                  ),
                  a("box-shadow", i),
                ];
          }
          if (S.value.kind === "arbitrary") {
            let C = S.value.value;
            switch (S.value.dataType ?? j(C, ["color"])) {
              case "color":
                return (
                  (C = W(C, S.modifier, t)),
                  C === null ? void 0 : [h(), a("--tw-inset-shadow-color", C)]
                );
              default:
                return [
                  h(),
                  a(
                    "--tw-inset-shadow",
                    `inset ${ce(
                      C,
                      (Oe) => `var(--tw-inset-shadow-color, ${Oe})`
                    )}`
                  ),
                  a("box-shadow", i),
                ];
            }
          }
          switch (S.value.value) {
            case "none":
              return S.modifier
                ? void 0
                : [h(), a("--tw-inset-shadow", u), a("box-shadow", i)];
          }
          {
            let C = t.get([`--inset-shadow-${S.value.value}`]);
            if (C)
              return S.modifier
                ? void 0
                : [
                    h(),
                    a(
                      "--tw-inset-shadow",
                      ce(C, (I) => `var(--tw-inset-shadow-color, ${I})`)
                    ),
                    a("box-shadow", i),
                  ];
          }
          {
            let C = G(S, t, ["--box-shadow-color", "--color"]);
            if (C) return [h(), a("--tw-inset-shadow-color", C)];
          }
        }),
        n("inset-shadow", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--box-shadow-color", "--color"],
            modifiers: Array.from({ length: 21 }, (S, C) => `${C * 5}`),
          },
          {
            values: [],
            valueThemeKeys: ["--inset-shadow"],
            hasDefaultValue: !0,
          },
        ]),
        e("ring-inset", [h, ["--tw-ring-inset", "inset"]]);
      let x = t.get(["--default-ring-color"]) ?? "currentColor";
      r.functional("ring", (S) => {
        if (!S.value) {
          if (S.modifier) return;
          let C = t.get(["--default-ring-width"]) ?? "1px";
          return [h(), a("--tw-ring-shadow", v(C)), a("box-shadow", i)];
        }
        if (S.value.kind === "arbitrary") {
          let C = S.value.value;
          switch (S.value.dataType ?? j(C, ["color", "length"])) {
            case "length":
              return S.modifier
                ? void 0
                : [h(), a("--tw-ring-shadow", v(C)), a("box-shadow", i)];
            default:
              return (
                (C = W(C, S.modifier, t)),
                C === null ? void 0 : [a("--tw-ring-color", C)]
              );
          }
        }
        {
          let C = G(S, t, ["--ring-color", "--color"]);
          if (C) return [a("--tw-ring-color", C)];
        }
        {
          if (S.modifier) return;
          let C = t.resolve(S.value.value, ["--ring-width"]);
          if ((C === null && V(S.value.value) && (C = `${S.value.value}px`), C))
            return [h(), a("--tw-ring-shadow", v(C)), a("box-shadow", i)];
        }
      }),
        n("ring", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--ring-color", "--color"],
            modifiers: Array.from({ length: 21 }, (S, C) => `${C * 5}`),
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--ring-width"],
            hasDefaultValue: !0,
          },
        ]),
        r.functional("inset-ring", (S) => {
          if (!S.value)
            return S.modifier
              ? void 0
              : [
                  h(),
                  a("--tw-inset-ring-shadow", N("1px")),
                  a("box-shadow", i),
                ];
          if (S.value.kind === "arbitrary") {
            let C = S.value.value;
            switch (S.value.dataType ?? j(C, ["color", "length"])) {
              case "length":
                return S.modifier
                  ? void 0
                  : [
                      h(),
                      a("--tw-inset-ring-shadow", N(C)),
                      a("box-shadow", i),
                    ];
              default:
                return (
                  (C = W(C, S.modifier, t)),
                  C === null ? void 0 : [a("--tw-inset-ring-color", C)]
                );
            }
          }
          {
            let C = G(S, t, ["--ring-color", "--color"]);
            if (C) return [a("--tw-inset-ring-color", C)];
          }
          {
            if (S.modifier) return;
            let C = t.resolve(S.value.value, ["--ring-width"]);
            if (
              (C === null && V(S.value.value) && (C = `${S.value.value}px`), C)
            )
              return [
                h(),
                a("--tw-inset-ring-shadow", N(C)),
                a("box-shadow", i),
              ];
          }
        }),
        n("inset-ring", () => [
          {
            values: ["current", "inherit", "transparent"],
            valueThemeKeys: ["--ring-color", "--color"],
            modifiers: Array.from({ length: 21 }, (S, C) => `${C * 5}`),
          },
          {
            values: ["0", "1", "2", "4", "8"],
            valueThemeKeys: ["--ring-width"],
            hasDefaultValue: !0,
          },
        ]);
      let E =
        "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)";
      r.functional("ring-offset", (S) => {
        if (S.value) {
          if (S.value.kind === "arbitrary") {
            let C = S.value.value;
            switch (S.value.dataType ?? j(C, ["color", "length"])) {
              case "length":
                return S.modifier
                  ? void 0
                  : [
                      a("--tw-ring-offset-width", C),
                      a("--tw-ring-offset-shadow", E),
                    ];
              default:
                return (
                  (C = W(C, S.modifier, t)),
                  C === null ? void 0 : [a("--tw-ring-offset-color", C)]
                );
            }
          }
          {
            let C = t.resolve(S.value.value, ["--ring-offset-width"]);
            if (C)
              return S.modifier
                ? void 0
                : [
                    a("--tw-ring-offset-width", C),
                    a("--tw-ring-offset-shadow", E),
                  ];
            if (V(S.value.value))
              return S.modifier
                ? void 0
                : [
                    a("--tw-ring-offset-width", `${S.value.value}px`),
                    a("--tw-ring-offset-shadow", E),
                  ];
          }
          {
            let C = G(S, t, ["--ring-offset-color", "--color"]);
            if (C) return [a("--tw-ring-offset-color", C)];
          }
        }
      });
    }
    return (
      n("ring-offset", () => [
        {
          values: ["current", "inherit", "transparent"],
          valueThemeKeys: ["--ring-offset-color", "--color"],
          modifiers: Array.from({ length: 21 }, (i, u) => `${u * 5}`),
        },
        {
          values: ["0", "1", "2", "4", "8"],
          valueThemeKeys: ["--ring-offset-width"],
        },
      ]),
      r.functional("@container", (i) => {
        let u = null;
        if (
          (i.value === null
            ? (u = "inline-size")
            : i.value.kind === "arbitrary"
            ? (u = i.value.value)
            : i.value.kind === "named" &&
              i.value.value === "normal" &&
              (u = "normal"),
          u !== null)
        )
          return i.modifier
            ? [a("container-type", u), a("container-name", i.modifier.value)]
            : [a("container-type", u)];
      }),
      n("@container", () => [
        { values: ["normal"], valueThemeKeys: [], hasDefaultValue: !0 },
      ]),
      r
    );
  }
  function ir(t) {
    let r = t.params;
    return Xn.test(r)
      ? (n) => {
          let e = new Set(),
            o = new Set();
          P(t.nodes, (s) => {
            if (
              s.kind !== "declaration" ||
              !s.value ||
              (!s.value.includes("--value(") &&
                !s.value.includes("--modifier("))
            )
              return;
            let l = L(s.value);
            ee(l, (p) => {
              if (
                p.kind !== "function" ||
                (p.value !== "--value" && p.value !== "--modifier")
              )
                return;
              let f = O(H(p.nodes), ",");
              for (let [d, c] of f.entries())
                (c = c.replace(/\\\*/g, "*")),
                  (c = c.replace(/--(.*?)\s--(.*?)/g, "--$1-*--$2")),
                  (c = c.replace(/\s+/g, "")),
                  (c = c.replace(/(-\*){2,}/g, "-*")),
                  c[0] === "-" &&
                    c[1] === "-" &&
                    !c.includes("-*") &&
                    (c += "-*"),
                  (f[d] = c);
              p.nodes = L(f.join(","));
              for (let d of p.nodes)
                if (
                  d.kind === "word" &&
                  d.value[0] === "-" &&
                  d.value[1] === "-"
                ) {
                  let c = d.value.replace(/-\*.*$/g, "");
                  p.value === "--value"
                    ? e.add(c)
                    : p.value === "--modifier" && o.add(c);
                }
            }),
              (s.value = H(l));
          }),
            n.utilities.functional(r.slice(0, -2), (s) => {
              let l = structuredClone(t),
                p = s.value,
                f = s.modifier;
              if (p === null) return;
              let d = !1,
                c = !1,
                m = !1,
                g = !1,
                y = new Map(),
                b = !1;
              if (
                (P([l], (k, { parent: A, replaceWith: w }) => {
                  if (
                    (A?.kind !== "rule" && A?.kind !== "at-rule") ||
                    k.kind !== "declaration" ||
                    !k.value
                  )
                    return;
                  let T = L(k.value);
                  (ee(T, (R, { replaceWith: D }) => {
                    if (R.kind === "function") {
                      if (R.value === "--value") {
                        d = !0;
                        let i = nr(p, R, n);
                        return i
                          ? ((c = !0),
                            i.ratio ? (b = !0) : y.set(k, A),
                            D(i.nodes),
                            1)
                          : ((d ||= !1), w([]), 2);
                      } else if (R.value === "--modifier") {
                        if (f === null) return w([]), 1;
                        m = !0;
                        let i = nr(f, R, n);
                        return i
                          ? ((g = !0), D(i.nodes), 1)
                          : ((m ||= !1), w([]), 2);
                      }
                    }
                  }) ?? 0) === 0 && (k.value = H(T));
                }),
                (d && !c) || (m && !g) || (b && g) || (f && !b && !g))
              )
                return null;
              if (b)
                for (let [k, A] of y) {
                  let w = A.nodes.indexOf(k);
                  w !== -1 && A.nodes.splice(w, 1);
                }
              return l.nodes;
            }),
            n.utilities.suggest(r.slice(0, -2), () => [
              {
                values: n.theme
                  .keysInNamespaces(e)
                  .map((s) => s.replaceAll("_", ".")),
                modifiers: n.theme
                  .keysInNamespaces(o)
                  .map((s) => s.replaceAll("_", ".")),
              },
            ]);
        }
      : Qn.test(r)
      ? (n) => {
          n.utilities.static(r, () => structuredClone(t.nodes));
        }
      : null;
  }
  function nr(t, r, n) {
    for (let e of r.nodes)
      if (
        t.kind === "named" &&
        e.kind === "word" &&
        e.value[0] === "-" &&
        e.value[1] === "-"
      ) {
        let o = e.value;
        if (o.endsWith("-*")) {
          o = o.slice(0, -2);
          let s = n.theme.resolve(t.value, [o]);
          if (s) return { nodes: L(s) };
        } else {
          let s = o.split("-*");
          if (s.length <= 1) continue;
          let l = [s.shift()],
            p = n.theme.resolveWith(t.value, l, s);
          if (p) {
            let [, f = {}] = p;
            {
              let d = f[s.pop()];
              if (d) return { nodes: L(d) };
            }
          }
        }
      } else if (t.kind === "named" && e.kind === "word") {
        if (
          e.value !== "number" &&
          e.value !== "integer" &&
          e.value !== "ratio" &&
          e.value !== "percentage"
        )
          continue;
        let o = e.value === "ratio" && "fraction" in t ? t.fraction : t.value;
        if (!o) continue;
        let s = j(o, [e.value]);
        if (s === null) continue;
        if (s === "ratio") {
          let [l, p] = O(o, "/");
          if (!V(l) || !V(p)) continue;
        } else {
          if (s === "number" && !ge(o)) continue;
          if (s === "percentage" && !V(o.slice(0, -1))) continue;
        }
        return { nodes: L(o), ratio: s === "ratio" };
      } else if (
        t.kind === "arbitrary" &&
        e.kind === "word" &&
        e.value[0] === "[" &&
        e.value[e.value.length - 1] === "]"
      ) {
        let o = e.value.slice(1, -1);
        if (o === "*") return { nodes: L(t.value) };
        if ("dataType" in t && t.dataType && t.dataType !== o) continue;
        if ("dataType" in t && t.dataType) return { nodes: L(t.value) };
        if (j(t.value, [o]) !== null) return { nodes: L(t.value) };
      }
  }
  var ht = { "--alpha": eo, "--spacing": to, "--theme": ro, theme: sr };
  function eo(t, r, ...n) {
    let [e, o] = O(r, "/").map((s) => s.trim());
    if (!e || !o)
      throw new Error(
        `The --alpha(\u2026) function requires a color and an alpha value, e.g.: \`--alpha(${
          e || "var(--my-color)"
        } / ${o || "50%"})\``
      );
    if (n.length > 0)
      throw new Error(
        `The --alpha(\u2026) function only accepts one argument, e.g.: \`--alpha(${
          e || "var(--my-color)"
        } / ${o || "50%"})\``
      );
    return J(e, o);
  }
  function to(t, r, ...n) {
    if (!r)
      throw new Error(
        "The --spacing(\u2026) function requires an argument, but received none."
      );
    if (n.length > 0)
      throw new Error(
        `The --spacing(\u2026) function only accepts a single argument, but received ${
          n.length + 1
        }.`
      );
    let e = t.theme.resolve(null, ["--spacing"]);
    if (!e)
      throw new Error(
        "The --spacing(\u2026) function requires that the `--spacing` theme variable exists, but it was not found."
      );
    return `calc(${e} * ${r})`;
  }
  function ro(t, r, ...n) {
    if (!r.startsWith("--"))
      throw new Error(
        "The --theme(\u2026) function can only be used with CSS variables from your theme."
      );
    return sr(t, r, ...n);
  }
  function sr(t, r, ...n) {
    r = no(r);
    let e = t.resolveThemeValue(r);
    if (!e && n.length > 0) return n.join(", ");
    if (!e)
      throw new Error(
        `Could not resolve value for theme function: \`theme(${r})\`. Consider checking if the path is correct or provide a fallback value to silence this error.`
      );
    return e;
  }
  var lr = new RegExp(
    Object.keys(ht)
      .map((t) => `${t}\\(`)
      .join("|")
  );
  function he(t, r) {
    let n = 0;
    return (
      P(t, (e) => {
        if (e.kind === "declaration" && e.value && lr.test(e.value)) {
          (n |= 8), (e.value = ar(e.value, r));
          return;
        }
        e.kind === "at-rule" &&
          (e.name === "@media" ||
            e.name === "@custom-media" ||
            e.name === "@container" ||
            e.name === "@supports") &&
          lr.test(e.params) &&
          ((n |= 8), (e.params = ar(e.params, r)));
      }),
      n
    );
  }
  function ar(t, r) {
    let n = L(t);
    return (
      ee(n, (e, { replaceWith: o }) => {
        if (e.kind === "function" && e.value in ht) {
          let s = O(H(e.nodes).trim(), ",").map((p) => p.trim()),
            l = ht[e.value](r, ...s);
          return o(L(l));
        }
      }),
      H(n)
    );
  }
  function no(t) {
    if (t[0] !== "'" && t[0] !== '"') return t;
    let r = "",
      n = t[0];
    for (let e = 1; e < t.length - 1; e++) {
      let o = t[e],
        s = t[e + 1];
      o === "\\" && (s === n || s === "\\") ? ((r += s), e++) : (r += o);
    }
    return r;
  }
  function We(t, r) {
    let n = t.length,
      e = r.length,
      o = n < e ? n : e;
    for (let s = 0; s < o; s++) {
      let l = t.charCodeAt(s),
        p = r.charCodeAt(s);
      if (l >= 48 && l <= 57 && p >= 48 && p <= 57) {
        let f = s,
          d = s + 1,
          c = s,
          m = s + 1;
        for (l = t.charCodeAt(d); l >= 48 && l <= 57; ) l = t.charCodeAt(++d);
        for (p = r.charCodeAt(m); p >= 48 && p <= 57; ) p = r.charCodeAt(++m);
        let g = t.slice(f, d),
          y = r.slice(c, m),
          b = Number(g) - Number(y);
        if (b) return b;
        if (g < y) return -1;
        if (g > y) return 1;
        continue;
      }
      if (l !== p) return l - p;
    }
    return t.length - r.length;
  }
  var oo = /^\d+\/\d+$/;
  function ur(t) {
    let r = [];
    for (let e of t.utilities.keys("static"))
      r.push({ name: e, utility: e, fraction: !1, modifiers: [] });
    for (let e of t.utilities.keys("functional")) {
      let o = t.utilities.getCompletions(e);
      for (let s of o)
        for (let l of s.values) {
          let p = l !== null && oo.test(l),
            f = l === null ? e : `${e}-${l}`;
          r.push({ name: f, utility: e, fraction: p, modifiers: s.modifiers }),
            s.supportsNegative &&
              r.push({
                name: `-${f}`,
                utility: `-${e}`,
                fraction: p,
                modifiers: s.modifiers,
              });
        }
    }
    return r.length === 0 ? [] : (r.sort((e, o) => We(e.name, o.name)), io(r));
  }
  function io(t) {
    let r = [],
      n = null,
      e = new Map(),
      o = new F(() => []);
    for (let l of t) {
      let { utility: p, fraction: f } = l;
      n || ((n = { utility: p, items: [] }), e.set(p, n)),
        p !== n.utility &&
          (r.push(n), (n = { utility: p, items: [] }), e.set(p, n)),
        f ? o.get(p).push(l) : n.items.push(l);
    }
    n && r[r.length - 1] !== n && r.push(n);
    for (let [l, p] of o) {
      let f = e.get(l);
      f && f.items.push(...p);
    }
    let s = [];
    for (let l of r)
      for (let p of l.items) s.push([p.name, { modifiers: p.modifiers }]);
    return s;
  }
  function cr(t) {
    let r = [];
    for (let [e, o] of t.variants.entries()) {
      let p = function ({ value: f, modifier: d } = {}) {
        let c = e;
        f && (c += s ? `-${f}` : f), d && (c += `/${d}`);
        let m = t.parseVariant(c);
        if (!m) return [];
        let g = _(".__placeholder__", []);
        if (be(g, m, t.variants) === null) return [];
        let y = [];
        return (
          Fe(g.nodes, (b, { path: k }) => {
            if (
              (b.kind !== "rule" && b.kind !== "at-rule") ||
              b.nodes.length > 0
            )
              return;
            k.sort((T, z) => {
              let R = T.kind === "at-rule",
                D = z.kind === "at-rule";
              return R && !D ? -1 : !R && D ? 1 : 0;
            });
            let A = k.flatMap((T) =>
                T.kind === "rule"
                  ? T.selector === "&"
                    ? []
                    : [T.selector]
                  : T.kind === "at-rule"
                  ? [`${T.name} ${T.params}`]
                  : []
              ),
              w = "";
            for (let T = A.length - 1; T >= 0; T--)
              w = w === "" ? A[T] : `${A[T]} { ${w} }`;
            y.push(w);
          }),
          y
        );
      };
      var n = p;
      if (o.kind === "arbitrary") continue;
      let s = e !== "@",
        l = t.variants.getCompletions(e);
      switch (o.kind) {
        case "static": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !1,
            hasDash: s,
            selectors: p,
          });
          break;
        }
        case "functional": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !0,
            hasDash: s,
            selectors: p,
          });
          break;
        }
        case "compound": {
          r.push({
            name: e,
            values: l,
            isArbitrary: !0,
            hasDash: s,
            selectors: p,
          });
          break;
        }
      }
    }
    return r;
  }
  function fr(t, r) {
    let { astNodes: n, nodeSorting: e } = oe(Array.from(r), t),
      o = new Map(r.map((l) => [l, null])),
      s = 0n;
    for (let l of n) {
      let p = e.get(l)?.candidate;
      p && o.set(p, o.get(p) ?? s++);
    }
    return r.map((l) => [l, o.get(l) ?? null]);
  }
  var Be = /^@?[a-zA-Z0-9_-]*$/;
  var yt = class {
    compareFns = new Map();
    variants = new Map();
    completions = new Map();
    groupOrder = null;
    lastOrder = 0;
    static(r, n, { compounds: e, order: o } = {}) {
      this.set(r, {
        kind: "static",
        applyFn: n,
        compoundsWith: 0,
        compounds: e ?? 2,
        order: o,
      });
    }
    fromAst(r, n) {
      let e = [];
      P(n, (o) => {
        o.kind === "rule"
          ? e.push(o.selector)
          : o.kind === "at-rule" &&
            o.name !== "@slot" &&
            e.push(`${o.name} ${o.params}`);
      }),
        this.static(
          r,
          (o) => {
            let s = structuredClone(n);
            vt(s, o.nodes), (o.nodes = s);
          },
          { compounds: fe(e) }
        );
    }
    functional(r, n, { compounds: e, order: o } = {}) {
      this.set(r, {
        kind: "functional",
        applyFn: n,
        compoundsWith: 0,
        compounds: e ?? 2,
        order: o,
      });
    }
    compound(r, n, e, { compounds: o, order: s } = {}) {
      this.set(r, {
        kind: "compound",
        applyFn: e,
        compoundsWith: n,
        compounds: o ?? 2,
        order: s,
      });
    }
    group(r, n) {
      (this.groupOrder = this.nextOrder()),
        n && this.compareFns.set(this.groupOrder, n),
        r(),
        (this.groupOrder = null);
    }
    has(r) {
      return this.variants.has(r);
    }
    get(r) {
      return this.variants.get(r);
    }
    kind(r) {
      return this.variants.get(r)?.kind;
    }
    compoundsWith(r, n) {
      let e = this.variants.get(r),
        o =
          typeof n == "string"
            ? this.variants.get(n)
            : n.kind === "arbitrary"
            ? { compounds: fe([n.selector]) }
            : this.variants.get(n.root);
      return !(
        !e ||
        !o ||
        e.kind !== "compound" ||
        o.compounds === 0 ||
        e.compoundsWith === 0 ||
        (e.compoundsWith & o.compounds) === 0
      );
    }
    suggest(r, n) {
      this.completions.set(r, n);
    }
    getCompletions(r) {
      return this.completions.get(r)?.() ?? [];
    }
    compare(r, n) {
      if (r === n) return 0;
      if (r === null) return -1;
      if (n === null) return 1;
      if (r.kind === "arbitrary" && n.kind === "arbitrary")
        return r.selector < n.selector ? -1 : 1;
      if (r.kind === "arbitrary") return 1;
      if (n.kind === "arbitrary") return -1;
      let e = this.variants.get(r.root).order,
        o = this.variants.get(n.root).order,
        s = e - o;
      if (s !== 0) return s;
      if (r.kind === "compound" && n.kind === "compound") {
        let d = this.compare(r.variant, n.variant);
        return d !== 0
          ? d
          : r.modifier && n.modifier
          ? r.modifier.value < n.modifier.value
            ? -1
            : 1
          : r.modifier
          ? 1
          : n.modifier
          ? -1
          : 0;
      }
      let l = this.compareFns.get(e);
      if (l !== void 0) return l(r, n);
      if (r.root !== n.root) return r.root < n.root ? -1 : 1;
      let p = r.value,
        f = n.value;
      return p === null
        ? -1
        : f === null || (p.kind === "arbitrary" && f.kind !== "arbitrary")
        ? 1
        : (p.kind !== "arbitrary" && f.kind === "arbitrary") ||
          p.value < f.value
        ? -1
        : 1;
    }
    keys() {
      return this.variants.keys();
    }
    entries() {
      return this.variants.entries();
    }
    set(r, { kind: n, applyFn: e, compounds: o, compoundsWith: s, order: l }) {
      let p = this.variants.get(r);
      p
        ? Object.assign(p, { kind: n, applyFn: e, compounds: o })
        : (l === void 0 &&
            ((this.lastOrder = this.nextOrder()), (l = this.lastOrder)),
          this.variants.set(r, {
            kind: n,
            applyFn: e,
            order: l,
            compoundsWith: s,
            compounds: o,
          }));
    }
    nextOrder() {
      return this.groupOrder ?? this.lastOrder + 1;
    }
  };
  function fe(t) {
    let r = 0;
    for (let n of t) {
      if (n[0] === "@") {
        if (
          !n.startsWith("@media") &&
          !n.startsWith("@supports") &&
          !n.startsWith("@container")
        )
          return 0;
        r |= 1;
        continue;
      }
      if (n.includes("::")) return 0;
      r |= 2;
    }
    return r;
  }
  function pr(t) {
    let r = new yt();
    function n(d, c, { compounds: m } = {}) {
      (m = m ?? fe(c)),
        r.static(
          d,
          (g) => {
            g.nodes = c.map((y) => M(y, g.nodes));
          },
          { compounds: m }
        );
    }
    n("*", [":is(& > *)"], { compounds: 0 }),
      n("**", [":is(& *)"], { compounds: 0 });
    function e(d, c) {
      return c.map((m) => {
        m = m.trim();
        let g = O(m, " ");
        return g[0] === "not"
          ? g.slice(1).join(" ")
          : d === "@container"
          ? g[0][0] === "("
            ? `not ${m}`
            : g[1] === "not"
            ? `${g[0]} ${g.slice(2).join(" ")}`
            : `${g[0]} not ${g.slice(1).join(" ")}`
          : `not ${m}`;
      });
    }
    let o = ["@media", "@supports", "@container"];
    function s(d) {
      for (let c of o) {
        if (c !== d.name) continue;
        let m = O(d.params, ",");
        return m.length > 1
          ? null
          : ((m = e(d.name, m)), K(d.name, m.join(", ")));
      }
      return null;
    }
    function l(d) {
      return d.includes("::")
        ? null
        : `&:not(${O(d, ",")
            .map((m) => ((m = m.replaceAll("&", "*")), m))
            .join(", ")})`;
    }
    r.compound("not", 3, (d, c) => {
      if ((c.variant.kind === "arbitrary" && c.variant.relative) || c.modifier)
        return null;
      let m = !1;
      if (
        (P([d], (g, { path: y }) => {
          if (g.kind !== "rule" && g.kind !== "at-rule") return 0;
          if (g.nodes.length > 0) return 0;
          let b = [],
            k = [];
          for (let w of y)
            w.kind === "at-rule" ? b.push(w) : w.kind === "rule" && k.push(w);
          if (b.length > 1) return 2;
          if (k.length > 1) return 2;
          let A = [];
          for (let w of k) {
            let T = l(w.selector);
            if (!T) return (m = !1), 2;
            A.push(_(T, []));
          }
          for (let w of b) {
            let T = s(w);
            if (!T) return (m = !1), 2;
            A.push(T);
          }
          return Object.assign(d, _("&", A)), (m = !0), 1;
        }),
        d.kind === "rule" &&
          d.selector === "&" &&
          d.nodes.length === 1 &&
          Object.assign(d, d.nodes[0]),
        !m)
      )
        return null;
    }),
      r.suggest("not", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("not", d))
      ),
      r.compound("group", 2, (d, c) => {
        if (c.variant.kind === "arbitrary" && c.variant.relative) return null;
        let m = c.modifier
            ? `:where(.${t.prefix ? `${t.prefix}\\:` : ""}group\\/${
                c.modifier.value
              })`
            : `:where(.${t.prefix ? `${t.prefix}\\:` : ""}group)`,
          g = !1;
        if (
          (P([d], (y, { path: b }) => {
            if (y.kind !== "rule") return 0;
            for (let A of b.slice(0, -1))
              if (A.kind === "rule") return (g = !1), 2;
            let k = y.selector.replaceAll("&", m);
            O(k, ",").length > 1 && (k = `:is(${k})`),
              (y.selector = `&:is(${k} *)`),
              (g = !0);
          }),
          !g)
        )
          return null;
      }),
      r.suggest("group", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("group", d))
      ),
      r.compound("peer", 2, (d, c) => {
        if (c.variant.kind === "arbitrary" && c.variant.relative) return null;
        let m = c.modifier
            ? `:where(.${t.prefix ? `${t.prefix}\\:` : ""}peer\\/${
                c.modifier.value
              })`
            : `:where(.${t.prefix ? `${t.prefix}\\:` : ""}peer)`,
          g = !1;
        if (
          (P([d], (y, { path: b }) => {
            if (y.kind !== "rule") return 0;
            for (let A of b.slice(0, -1))
              if (A.kind === "rule") return (g = !1), 2;
            let k = y.selector.replaceAll("&", m);
            O(k, ",").length > 1 && (k = `:is(${k})`),
              (y.selector = `&:is(${k} ~ *)`),
              (g = !0);
          }),
          !g)
        )
          return null;
      }),
      r.suggest("peer", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("peer", d))
      ),
      n("first-letter", ["&::first-letter"]),
      n("first-line", ["&::first-line"]),
      n("marker", ["& *::marker", "&::marker"]),
      n("selection", ["& *::selection", "&::selection"]),
      n("file", ["&::file-selector-button"]),
      n("placeholder", ["&::placeholder"]),
      n("backdrop", ["&::backdrop"]),
      !1;
    {
      let d = function () {
        return U([
          K("@property", "--tw-content", [
            a("syntax", '"*"'),
            a("initial-value", '""'),
            a("inherits", "false"),
          ]),
        ]);
      };
      var p = d;
      r.static(
        "before",
        (c) => {
          c.nodes = [
            _("&::before", [
              d(),
              a("content", "var(--tw-content)"),
              ...c.nodes,
            ]),
          ];
        },
        { compounds: 0 }
      ),
        r.static(
          "after",
          (c) => {
            c.nodes = [
              _("&::after", [
                d(),
                a("content", "var(--tw-content)"),
                ...c.nodes,
              ]),
            ];
          },
          { compounds: 0 }
        );
    }
    n("first", ["&:first-child"]),
      n("last", ["&:last-child"]),
      n("only", ["&:only-child"]),
      n("odd", ["&:nth-child(odd)"]),
      n("even", ["&:nth-child(even)"]),
      n("first-of-type", ["&:first-of-type"]),
      n("last-of-type", ["&:last-of-type"]),
      n("only-of-type", ["&:only-of-type"]),
      n("visited", ["&:visited"]),
      n("target", ["&:target"]),
      n("open", ["&:is([open], :popover-open, :open)"]),
      n("default", ["&:default"]),
      n("checked", ["&:checked"]),
      n("indeterminate", ["&:indeterminate"]),
      n("placeholder-shown", ["&:placeholder-shown"]),
      n("autofill", ["&:autofill"]),
      n("optional", ["&:optional"]),
      n("required", ["&:required"]),
      n("valid", ["&:valid"]),
      n("invalid", ["&:invalid"]),
      !1,
      n("in-range", ["&:in-range"]),
      n("out-of-range", ["&:out-of-range"]),
      n("read-only", ["&:read-only"]),
      n("empty", ["&:empty"]),
      n("focus-within", ["&:focus-within"]),
      r.static("hover", (d) => {
        d.nodes = [_("&:hover", [K("@media", "(hover: hover)", d.nodes)])];
      }),
      n("focus", ["&:focus"]),
      n("focus-visible", ["&:focus-visible"]),
      n("active", ["&:active"]),
      n("enabled", ["&:enabled"]),
      n("disabled", ["&:disabled"]),
      n("inert", ["&:is([inert], [inert] *)"]),
      r.compound("in", 2, (d, c) => {
        if (c.modifier) return null;
        let m = !1;
        if (
          (P([d], (g, { path: y }) => {
            if (g.kind !== "rule") return 0;
            for (let b of y.slice(0, -1))
              if (b.kind === "rule") return (m = !1), 2;
            (g.selector = `:where(${g.selector.replaceAll("&", "*")}) &`),
              (m = !0);
          }),
          !m)
        )
          return null;
      }),
      r.suggest("in", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("in", d))
      ),
      r.compound("has", 2, (d, c) => {
        if (c.modifier) return null;
        let m = !1;
        if (
          (P([d], (g, { path: y }) => {
            if (g.kind !== "rule") return 0;
            for (let b of y.slice(0, -1))
              if (b.kind === "rule") return (m = !1), 2;
            (g.selector = `&:has(${g.selector.replaceAll("&", "*")})`),
              (m = !0);
          }),
          !m)
        )
          return null;
      }),
      r.suggest("has", () =>
        Array.from(r.keys()).filter((d) => r.compoundsWith("has", d))
      ),
      r.functional("aria", (d, c) => {
        if (!c.value || c.modifier) return null;
        c.value.kind === "arbitrary"
          ? (d.nodes = [_(`&[aria-${dr(c.value.value)}]`, d.nodes)])
          : (d.nodes = [_(`&[aria-${c.value.value}="true"]`, d.nodes)]);
      }),
      r.suggest("aria", () => [
        "busy",
        "checked",
        "disabled",
        "expanded",
        "hidden",
        "pressed",
        "readonly",
        "required",
        "selected",
      ]),
      r.functional("data", (d, c) => {
        if (!c.value || c.modifier) return null;
        d.nodes = [_(`&[data-${dr(c.value.value)}]`, d.nodes)];
      }),
      r.functional("nth", (d, c) => {
        if (
          !c.value ||
          c.modifier ||
          (c.value.kind === "named" && !V(c.value.value))
        )
          return null;
        d.nodes = [_(`&:nth-child(${c.value.value})`, d.nodes)];
      }),
      r.functional("nth-last", (d, c) => {
        if (
          !c.value ||
          c.modifier ||
          (c.value.kind === "named" && !V(c.value.value))
        )
          return null;
        d.nodes = [_(`&:nth-last-child(${c.value.value})`, d.nodes)];
      }),
      r.functional("nth-of-type", (d, c) => {
        if (
          !c.value ||
          c.modifier ||
          (c.value.kind === "named" && !V(c.value.value))
        )
          return null;
        d.nodes = [_(`&:nth-of-type(${c.value.value})`, d.nodes)];
      }),
      r.functional("nth-last-of-type", (d, c) => {
        if (
          !c.value ||
          c.modifier ||
          (c.value.kind === "named" && !V(c.value.value))
        )
          return null;
        d.nodes = [_(`&:nth-last-of-type(${c.value.value})`, d.nodes)];
      }),
      r.functional(
        "supports",
        (d, c) => {
          if (!c.value || c.modifier) return null;
          let m = c.value.value;
          if (m === null) return null;
          if (/^[\w-]*\s*\(/.test(m)) {
            let g = m.replace(/\b(and|or|not)\b/g, " $1 ");
            d.nodes = [K("@supports", g, d.nodes)];
            return;
          }
          m.includes(":") || (m = `${m}: var(--tw)`),
            (m[0] !== "(" || m[m.length - 1] !== ")") && (m = `(${m})`),
            (d.nodes = [K("@supports", m, d.nodes)]);
        },
        { compounds: 1 }
      ),
      n("motion-safe", ["@media (prefers-reduced-motion: no-preference)"]),
      n("motion-reduce", ["@media (prefers-reduced-motion: reduce)"]),
      n("contrast-more", ["@media (prefers-contrast: more)"]),
      n("contrast-less", ["@media (prefers-contrast: less)"]);
    {
      let d = function (c, m, g, y) {
        if (c === m) return 0;
        let b = y.get(c);
        if (b === null) return g === "asc" ? -1 : 1;
        let k = y.get(m);
        return k === null ? (g === "asc" ? 1 : -1) : ue(b, k, g);
      };
      var f = d;
      {
        let c = t.namespace("--breakpoint"),
          m = new F((g) => {
            switch (g.kind) {
              case "static":
                return t.resolveValue(g.root, ["--breakpoint"]) ?? null;
              case "functional": {
                if (!g.value || g.modifier) return null;
                let y = null;
                return (
                  g.value.kind === "arbitrary"
                    ? (y = g.value.value)
                    : g.value.kind === "named" &&
                      (y = t.resolveValue(g.value.value, ["--breakpoint"])),
                  !y || y.includes("var(") ? null : y
                );
              }
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        r.group(
          () => {
            r.functional(
              "max",
              (g, y) => {
                if (y.modifier) return null;
                let b = m.get(y);
                if (b === null) return null;
                g.nodes = [K("@media", `(width < ${b})`, g.nodes)];
              },
              { compounds: 1 }
            );
          },
          (g, y) => d(g, y, "desc", m)
        ),
          r.suggest("max", () =>
            Array.from(c.keys()).filter((g) => g !== null)
          ),
          r.group(
            () => {
              for (let [g, y] of t.namespace("--breakpoint"))
                g !== null &&
                  r.static(
                    g,
                    (b) => {
                      b.nodes = [K("@media", `(width >= ${y})`, b.nodes)];
                    },
                    { compounds: 1 }
                  );
              r.functional(
                "min",
                (g, y) => {
                  if (y.modifier) return null;
                  let b = m.get(y);
                  if (b === null) return null;
                  g.nodes = [K("@media", `(width >= ${b})`, g.nodes)];
                },
                { compounds: 1 }
              );
            },
            (g, y) => d(g, y, "asc", m)
          ),
          r.suggest("min", () =>
            Array.from(c.keys()).filter((g) => g !== null)
          );
      }
      {
        let c = t.namespace("--container"),
          m = new F((g) => {
            switch (g.kind) {
              case "functional": {
                if (g.value === null) return null;
                let y = null;
                return (
                  g.value.kind === "arbitrary"
                    ? (y = g.value.value)
                    : g.value.kind === "named" &&
                      (y = t.resolveValue(g.value.value, ["--container"])),
                  !y || y.includes("var(") ? null : y
                );
              }
              case "static":
              case "arbitrary":
              case "compound":
                return null;
            }
          });
        r.group(
          () => {
            r.functional(
              "@max",
              (g, y) => {
                let b = m.get(y);
                if (b === null) return null;
                g.nodes = [
                  K(
                    "@container",
                    y.modifier
                      ? `${y.modifier.value} (width < ${b})`
                      : `(width < ${b})`,
                    g.nodes
                  ),
                ];
              },
              { compounds: 1 }
            );
          },
          (g, y) => d(g, y, "desc", m)
        ),
          r.suggest("@max", () =>
            Array.from(c.keys()).filter((g) => g !== null)
          ),
          r.group(
            () => {
              r.functional(
                "@",
                (g, y) => {
                  let b = m.get(y);
                  if (b === null) return null;
                  g.nodes = [
                    K(
                      "@container",
                      y.modifier
                        ? `${y.modifier.value} (width >= ${b})`
                        : `(width >= ${b})`,
                      g.nodes
                    ),
                  ];
                },
                { compounds: 1 }
              ),
                r.functional(
                  "@min",
                  (g, y) => {
                    let b = m.get(y);
                    if (b === null) return null;
                    g.nodes = [
                      K(
                        "@container",
                        y.modifier
                          ? `${y.modifier.value} (width >= ${b})`
                          : `(width >= ${b})`,
                        g.nodes
                      ),
                    ];
                  },
                  { compounds: 1 }
                );
            },
            (g, y) => d(g, y, "asc", m)
          ),
          r.suggest("@min", () =>
            Array.from(c.keys()).filter((g) => g !== null)
          ),
          r.suggest("@", () => Array.from(c.keys()).filter((g) => g !== null));
      }
    }
    return (
      n("portrait", ["@media (orientation: portrait)"]),
      n("landscape", ["@media (orientation: landscape)"]),
      n("ltr", ['&:where(:dir(ltr), [dir="ltr"], [dir="ltr"] *)']),
      n("rtl", ['&:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)']),
      n("dark", ["@media (prefers-color-scheme: dark)"]),
      n("starting", ["@starting-style"]),
      n("print", ["@media print"]),
      n("forced-colors", ["@media (forced-colors: active)"]),
      !1,
      !1,
      !1,
      r
    );
  }
  function dr(t) {
    if (t.includes("=")) {
      let [r, ...n] = O(t, "="),
        e = n.join("=").trim();
      if (e[0] === "'" || e[0] === '"') return t;
      if (e.length > 1) {
        let o = e[e.length - 1];
        if (
          e[e.length - 2] === " " &&
          (o === "i" || o === "I" || o === "s" || o === "S")
        )
          return `${r}="${e.slice(0, -2)}" ${o}`;
      }
      return `${r}="${e}"`;
    }
    return t;
  }
  function vt(t, r) {
    P(t, (n, { replaceWith: e }) => {
      if (n.kind === "at-rule" && n.name === "@slot") e(r);
      else if (
        n.kind === "at-rule" &&
        (n.name === "@keyframes" || n.name === "@property")
      )
        return Object.assign(n, U([K(n.name, n.params, n.nodes)])), 1;
    });
  }
  function mr(t) {
    let r = or(t),
      n = pr(t),
      e = new F((f) => Zt(f, p)),
      o = new F((f) => Array.from(Jt(f, p))),
      s = new F((f) => {
        let d = gr(f, p);
        try {
          he(
            d.map(({ node: c }) => c),
            p
          );
        } catch {
          return [];
        }
        return d;
      }),
      l = new F((f) => {
        for (let d of Ie(f)) t.markUsedVariable(d);
      }),
      p = {
        theme: t,
        utilities: r,
        variants: n,
        invalidCandidates: new Set(),
        important: !1,
        candidatesToCss(f) {
          let d = [];
          for (let c of f) {
            let m = !1,
              { astNodes: g } = oe([c], this, {
                onInvalidCandidate() {
                  m = !0;
                },
              });
            (g = se(g, p)), g.length === 0 || m ? d.push(null) : d.push(Y(g));
          }
          return d;
        },
        getClassOrder(f) {
          return fr(this, f);
        },
        getClassList() {
          return ur(this);
        },
        getVariants() {
          return cr(this);
        },
        parseCandidate(f) {
          return o.get(f);
        },
        parseVariant(f) {
          return e.get(f);
        },
        compileAstNodes(f) {
          return s.get(f);
        },
        getVariantOrder() {
          let f = Array.from(e.values());
          f.sort((g, y) => this.variants.compare(g, y));
          let d = new Map(),
            c,
            m = 0;
          for (let g of f)
            g !== null &&
              (c !== void 0 && this.variants.compare(c, g) !== 0 && m++,
              d.set(g, m),
              (c = g));
          return d;
        },
        resolveThemeValue(f) {
          let d = f.lastIndexOf("/"),
            c = null;
          d !== -1 && ((c = f.slice(d + 1).trim()), (f = f.slice(0, d).trim()));
          let m = t.get([f]) ?? void 0;
          return c && m ? J(m, c) : m;
        },
        trackUsedVariables(f) {
          l.get(f);
        },
      };
    return p;
  }
  var kt = [
    "container-type",
    "pointer-events",
    "visibility",
    "position",
    "inset",
    "inset-inline",
    "inset-block",
    "inset-inline-start",
    "inset-inline-end",
    "top",
    "right",
    "bottom",
    "left",
    "isolation",
    "z-index",
    "order",
    "grid-column",
    "grid-column-start",
    "grid-column-end",
    "grid-row",
    "grid-row-start",
    "grid-row-end",
    "float",
    "clear",
    "--tw-container-component",
    "margin",
    "margin-inline",
    "margin-block",
    "margin-inline-start",
    "margin-inline-end",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "box-sizing",
    "display",
    "field-sizing",
    "aspect-ratio",
    "height",
    "max-height",
    "min-height",
    "width",
    "max-width",
    "min-width",
    "flex",
    "flex-shrink",
    "flex-grow",
    "flex-basis",
    "table-layout",
    "caption-side",
    "border-collapse",
    "border-spacing",
    "transform-origin",
    "translate",
    "--tw-translate-x",
    "--tw-translate-y",
    "--tw-translate-z",
    "scale",
    "--tw-scale-x",
    "--tw-scale-y",
    "--tw-scale-z",
    "rotate",
    "--tw-rotate-x",
    "--tw-rotate-y",
    "--tw-rotate-z",
    "--tw-skew-x",
    "--tw-skew-y",
    "transform",
    "animation",
    "cursor",
    "touch-action",
    "--tw-pan-x",
    "--tw-pan-y",
    "--tw-pinch-zoom",
    "resize",
    "scroll-snap-type",
    "--tw-scroll-snap-strictness",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-margin",
    "scroll-margin-inline",
    "scroll-margin-block",
    "scroll-margin-inline-start",
    "scroll-margin-inline-end",
    "scroll-margin-top",
    "scroll-margin-right",
    "scroll-margin-bottom",
    "scroll-margin-left",
    "scroll-padding",
    "scroll-padding-inline",
    "scroll-padding-block",
    "scroll-padding-inline-start",
    "scroll-padding-inline-end",
    "scroll-padding-top",
    "scroll-padding-right",
    "scroll-padding-bottom",
    "scroll-padding-left",
    "list-style-position",
    "list-style-type",
    "list-style-image",
    "appearance",
    "columns",
    "break-before",
    "break-inside",
    "break-after",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-template-columns",
    "grid-template-rows",
    "flex-direction",
    "flex-wrap",
    "place-content",
    "place-items",
    "align-content",
    "align-items",
    "justify-content",
    "justify-items",
    "gap",
    "column-gap",
    "row-gap",
    "--tw-space-x-reverse",
    "--tw-space-y-reverse",
    "divide-x-width",
    "divide-y-width",
    "--tw-divide-y-reverse",
    "divide-style",
    "divide-color",
    "place-self",
    "align-self",
    "justify-self",
    "overflow",
    "overflow-x",
    "overflow-y",
    "overscroll-behavior",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "scroll-behavior",
    "border-radius",
    "border-start-radius",
    "border-end-radius",
    "border-top-radius",
    "border-right-radius",
    "border-bottom-radius",
    "border-left-radius",
    "border-start-start-radius",
    "border-start-end-radius",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-right-radius",
    "border-bottom-left-radius",
    "border-width",
    "border-inline-width",
    "border-block-width",
    "border-inline-start-width",
    "border-inline-end-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    "border-style",
    "border-inline-style",
    "border-block-style",
    "border-inline-start-style",
    "border-inline-end-style",
    "border-top-style",
    "border-right-style",
    "border-bottom-style",
    "border-left-style",
    "border-color",
    "border-inline-color",
    "border-block-color",
    "border-inline-start-color",
    "border-inline-end-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "background-color",
    "background-image",
    "--tw-gradient-position",
    "--tw-gradient-stops",
    "--tw-gradient-via-stops",
    "--tw-gradient-from",
    "--tw-gradient-from-position",
    "--tw-gradient-via",
    "--tw-gradient-via-position",
    "--tw-gradient-to",
    "--tw-gradient-to-position",
    "box-decoration-break",
    "background-size",
    "background-attachment",
    "background-clip",
    "background-position",
    "background-repeat",
    "background-origin",
    "fill",
    "stroke",
    "stroke-width",
    "object-fit",
    "object-position",
    "padding",
    "padding-inline",
    "padding-block",
    "padding-inline-start",
    "padding-inline-end",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "text-align",
    "text-indent",
    "vertical-align",
    "font-family",
    "font-size",
    "line-height",
    "font-weight",
    "letter-spacing",
    "text-wrap",
    "overflow-wrap",
    "word-break",
    "text-overflow",
    "hyphens",
    "white-space",
    "color",
    "text-transform",
    "font-style",
    "font-stretch",
    "font-variant-numeric",
    "text-decoration-line",
    "text-decoration-color",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-underline-offset",
    "-webkit-font-smoothing",
    "placeholder-color",
    "caret-color",
    "accent-color",
    "color-scheme",
    "opacity",
    "background-blend-mode",
    "mix-blend-mode",
    "box-shadow",
    "--tw-shadow",
    "--tw-shadow-color",
    "--tw-ring-shadow",
    "--tw-ring-color",
    "--tw-inset-shadow",
    "--tw-inset-shadow-color",
    "--tw-inset-ring-shadow",
    "--tw-inset-ring-color",
    "--tw-ring-offset-width",
    "--tw-ring-offset-color",
    "outline",
    "outline-width",
    "outline-offset",
    "outline-color",
    "--tw-blur",
    "--tw-brightness",
    "--tw-contrast",
    "--tw-drop-shadow",
    "--tw-grayscale",
    "--tw-hue-rotate",
    "--tw-invert",
    "--tw-saturate",
    "--tw-sepia",
    "filter",
    "--tw-backdrop-blur",
    "--tw-backdrop-brightness",
    "--tw-backdrop-contrast",
    "--tw-backdrop-grayscale",
    "--tw-backdrop-hue-rotate",
    "--tw-backdrop-invert",
    "--tw-backdrop-opacity",
    "--tw-backdrop-saturate",
    "--tw-backdrop-sepia",
    "backdrop-filter",
    "transition-property",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-timing-function",
    "will-change",
    "contain",
    "content",
    "forced-color-adjust",
  ];
  function oe(t, r, { onInvalidCandidate: n } = {}) {
    let e = new Map(),
      o = [],
      s = new Map();
    for (let p of t) {
      if (r.invalidCandidates.has(p)) {
        n?.(p);
        continue;
      }
      let f = r.parseCandidate(p);
      if (f.length === 0) {
        n?.(p);
        continue;
      }
      s.set(p, f);
    }
    let l = r.getVariantOrder();
    for (let [p, f] of s) {
      let d = !1;
      for (let c of f) {
        let m = r.compileAstNodes(c);
        if (m.length !== 0) {
          d = !0;
          for (let { node: g, propertySort: y } of m) {
            let b = 0n;
            for (let k of c.variants) b |= 1n << BigInt(l.get(k));
            e.set(g, { properties: y, variants: b, candidate: p }), o.push(g);
          }
        }
      }
      d || n?.(p);
    }
    return (
      o.sort((p, f) => {
        let d = e.get(p),
          c = e.get(f);
        if (d.variants - c.variants !== 0n)
          return Number(d.variants - c.variants);
        let m = 0;
        for (
          ;
          m < d.properties.order.length &&
          m < c.properties.order.length &&
          d.properties.order[m] === c.properties.order[m];

        )
          m += 1;
        return (
          (d.properties.order[m] ?? 1 / 0) - (c.properties.order[m] ?? 1 / 0) ||
          c.properties.count - d.properties.count ||
          We(d.candidate, c.candidate)
        );
      }),
      { astNodes: o, nodeSorting: e }
    );
  }
  function gr(t, r) {
    let n = fo(t, r);
    if (n.length === 0) return [];
    let e = [],
      o = `.${re(t.raw)}`;
    for (let s of n) {
      let l = po(s);
      (t.important || r.important) && br(s);
      let p = { kind: "rule", selector: o, nodes: s };
      for (let f of t.variants) if (be(p, f, r.variants) === null) return [];
      e.push({ node: p, propertySort: l });
    }
    return e;
  }
  function be(t, r, n, e = 0) {
    if (r.kind === "arbitrary") {
      if (r.relative && e === 0) return null;
      t.nodes = [M(r.selector, t.nodes)];
      return;
    }
    let { applyFn: o } = n.get(r.root);
    if (r.kind === "compound") {
      let l = K("@slot");
      if (
        be(l, r.variant, n, e + 1) === null ||
        (r.root === "not" && l.nodes.length > 1)
      )
        return null;
      for (let f of l.nodes)
        if ((f.kind !== "rule" && f.kind !== "at-rule") || o(f, r) === null)
          return null;
      P(l.nodes, (f) => {
        if ((f.kind === "rule" || f.kind === "at-rule") && f.nodes.length <= 0)
          return (f.nodes = t.nodes), 1;
      }),
        (t.nodes = l.nodes);
      return;
    }
    if (o(t, r) === null) return null;
  }
  function hr(t) {
    let r = t.options?.types ?? [];
    return r.length > 1 && r.includes("any");
  }
  function fo(t, r) {
    if (t.kind === "arbitrary") {
      let l = t.value;
      return (
        t.modifier && (l = W(l, t.modifier, r.theme)),
        l === null ? [] : [[a(t.property, l)]]
      );
    }
    let n = r.utilities.get(t.root) ?? [],
      e = [],
      o = n.filter((l) => !hr(l));
    for (let l of o) {
      if (l.kind !== t.kind) continue;
      let p = l.compileFn(t);
      if (p !== void 0) {
        if (p === null) return e;
        e.push(p);
      }
    }
    if (e.length > 0) return e;
    let s = n.filter((l) => hr(l));
    for (let l of s) {
      if (l.kind !== t.kind) continue;
      let p = l.compileFn(t);
      if (p !== void 0) {
        if (p === null) return e;
        e.push(p);
      }
    }
    return e;
  }
  function br(t) {
    for (let r of t)
      r.kind !== "at-root" &&
        (r.kind === "declaration"
          ? (r.important = !0)
          : (r.kind === "rule" || r.kind === "at-rule") && br(r.nodes));
  }
  function po(t) {
    let r = new Set(),
      n = 0,
      e = t.slice(),
      o = !1;
    for (; e.length > 0; ) {
      let s = e.shift();
      if (s.kind === "declaration") {
        if (s.value === void 0 || (n++, o)) continue;
        if (s.property === "--tw-sort") {
          let p = kt.indexOf(s.value ?? "");
          if (p !== -1) {
            r.add(p), (o = !0);
            continue;
          }
        }
        let l = kt.indexOf(s.property);
        l !== -1 && r.add(l);
      } else if (s.kind === "rule" || s.kind === "at-rule")
        for (let l of s.nodes) e.push(l);
    }
    return { order: Array.from(r).sort((s, l) => s - l), count: n };
  }
  function Ne(t, r) {
    let n = 0,
      e = M("&", t),
      o = new Set(),
      s = new F(() => new Set()),
      l = new F(() => new Set());
    P([e], (m, { parent: g }) => {
      if (m.kind === "at-rule") {
        if (m.name === "@keyframes")
          return (
            P(m.nodes, (y) => {
              if (y.kind === "at-rule" && y.name === "@apply")
                throw new Error("You cannot use `@apply` inside `@keyframes`.");
            }),
            1
          );
        if (m.name === "@utility") {
          let y = m.params.replace(/-\*$/, "");
          l.get(y).add(m),
            P(m.nodes, (b) => {
              if (!(b.kind !== "at-rule" || b.name !== "@apply")) {
                o.add(m);
                for (let k of yr(b, r)) s.get(m).add(k);
              }
            });
          return;
        }
        if (m.name === "@apply") {
          if (g === null) return;
          (n |= 1), o.add(g);
          for (let y of yr(m, r)) s.get(g).add(y);
        }
      }
    });
    let p = new Set(),
      f = [],
      d = new Set();
    function c(m, g = []) {
      if (!p.has(m)) {
        if (d.has(m)) {
          let y = g[(g.indexOf(m) + 1) % g.length];
          throw (
            (m.kind === "at-rule" &&
              m.name === "@utility" &&
              y.kind === "at-rule" &&
              y.name === "@utility" &&
              P(m.nodes, (b) => {
                if (b.kind !== "at-rule" || b.name !== "@apply") return;
                let k = b.params.split(/\s+/g);
                for (let A of k)
                  for (let w of r.parseCandidate(A))
                    switch (w.kind) {
                      case "arbitrary":
                        break;
                      case "static":
                      case "functional":
                        if (y.params.replace(/-\*$/, "") === w.root)
                          throw new Error(
                            `You cannot \`@apply\` the \`${A}\` utility here because it creates a circular dependency.`
                          );
                        break;
                      default:
                    }
              }),
            new Error(`Circular dependency detected:
    
    ${Y([m])}
    Relies on:
    
    ${Y([y])}`))
          );
        }
        d.add(m);
        for (let y of s.get(m))
          for (let b of l.get(y)) g.push(m), c(b, g), g.pop();
        p.add(m), d.delete(m), f.push(m);
      }
    }
    for (let m of o) c(m);
    for (let m of f)
      if ("nodes" in m)
        for (let g = 0; g < m.nodes.length; g++) {
          let y = m.nodes[g];
          if (y.kind !== "at-rule" || y.name !== "@apply") continue;
          let b = y.params.split(/\s+/g);
          {
            let k = oe(b, r, {
                onInvalidCandidate: (w) => {
                  throw new Error(`Cannot apply unknown utility class: ${w}`);
                },
              }).astNodes,
              A = [];
            for (let w of k)
              if (w.kind === "rule") for (let T of w.nodes) A.push(T);
              else A.push(w);
            m.nodes.splice(g, 1, ...A);
          }
        }
    return n;
  }
  function* yr(t, r) {
    for (let n of t.params.split(/\s+/g))
      for (let e of r.parseCandidate(n))
        switch (e.kind) {
          case "arbitrary":
            break;
          case "static":
          case "functional":
            yield e.root;
            break;
          default:
        }
  }
  async function wt(t, r, n, e = 0) {
    let o = 0,
      s = [];
    return (
      P(t, (l, { replaceWith: p }) => {
        if (
          l.kind === "at-rule" &&
          (l.name === "@import" || l.name === "@reference")
        ) {
          let f = mo(L(l.params));
          if (f === null) return;
          l.name === "@reference" && (f.media = "reference"), (o |= 2);
          let { uri: d, layer: c, media: m, supports: g } = f;
          if (
            d.startsWith("data:") ||
            d.startsWith("http://") ||
            d.startsWith("https://")
          )
            return;
          let y = Q({}, []);
          return (
            s.push(
              (async () => {
                if (e > 100)
                  throw new Error(
                    `Exceeded maximum recursion depth while resolving \`${d}\` in \`${r}\`)`
                  );
                let b = await n(d, r),
                  k = pe(b.content);
                await wt(k, b.base, n, e + 1),
                  (y.nodes = go([Q({ base: b.base }, k)], c, m, g));
              })()
            ),
            p(y),
            1
          );
        }
      }),
      s.length > 0 && (await Promise.all(s)),
      o
    );
  }
  function mo(t) {
    let r,
      n = null,
      e = null,
      o = null;
    for (let s = 0; s < t.length; s++) {
      let l = t[s];
      if (l.kind !== "separator") {
        if (l.kind === "word" && !r) {
          if (!l.value || (l.value[0] !== '"' && l.value[0] !== "'"))
            return null;
          r = l.value.slice(1, -1);
          continue;
        }
        if ((l.kind === "function" && l.value.toLowerCase() === "url") || !r)
          return null;
        if (
          (l.kind === "word" || l.kind === "function") &&
          l.value.toLowerCase() === "layer"
        ) {
          if (n) return null;
          if (o)
            throw new Error(
              "`layer(\u2026)` in an `@import` should come before any other functions or conditions"
            );
          "nodes" in l ? (n = H(l.nodes)) : (n = "");
          continue;
        }
        if (l.kind === "function" && l.value.toLowerCase() === "supports") {
          if (o) return null;
          o = H(l.nodes);
          continue;
        }
        e = H(t.slice(s));
        break;
      }
    }
    return r ? { uri: r, layer: n, media: e, supports: o } : null;
  }
  function go(t, r, n, e) {
    let o = t;
    return (
      r !== null && (o = [K("@layer", r, o)]),
      n !== null && (o = [K("@media", n, o)]),
      e !== null && (o = [K("@supports", e[0] === "(" ? e : `(${e})`, o)]),
      o
    );
  }
  function ye(t, r = null) {
    return Array.isArray(t) &&
      t.length === 2 &&
      typeof t[1] == "object" &&
      typeof t[1] !== null
      ? r
        ? t[1][r] ?? null
        : t[0]
      : Array.isArray(t) && r === null
      ? t.join(", ")
      : typeof t == "string" && r === null
      ? t
      : null;
  }
  function vr(t, { theme: r }, n) {
    for (let e of n) {
      let o = qe([e]);
      o && t.theme.clearNamespace(`--${o}`, 4);
    }
    for (let [e, o] of ho(r)) {
      if (typeof o != "string" && typeof o != "number") continue;
      if (
        (typeof o == "string" && (o = o.replace(/<alpha-value>/g, "1")),
        e[0] === "opacity" && (typeof o == "number" || typeof o == "string"))
      ) {
        let l = typeof o == "string" ? parseFloat(o) : o;
        l >= 0 && l <= 1 && (o = l * 100 + "%");
      }
      let s = qe(e);
      s && t.theme.add(`--${s}`, "" + o, 7);
    }
    if (Object.hasOwn(r, "fontFamily")) {
      let e = 5;
      {
        let o = ye(r.fontFamily.sans);
        o &&
          t.theme.hasDefault("--font-sans") &&
          (t.theme.add("--default-font-family", o, e),
          t.theme.add(
            "--default-font-feature-settings",
            ye(r.fontFamily.sans, "fontFeatureSettings") ?? "normal",
            e
          ),
          t.theme.add(
            "--default-font-variation-settings",
            ye(r.fontFamily.sans, "fontVariationSettings") ?? "normal",
            e
          ));
      }
      {
        let o = ye(r.fontFamily.mono);
        o &&
          t.theme.hasDefault("--font-mono") &&
          (t.theme.add("--default-mono-font-family", o, e),
          t.theme.add(
            "--default-mono-font-feature-settings",
            ye(r.fontFamily.mono, "fontFeatureSettings") ?? "normal",
            e
          ),
          t.theme.add(
            "--default-mono-font-variation-settings",
            ye(r.fontFamily.mono, "fontVariationSettings") ?? "normal",
            e
          ));
      }
    }
    return r;
  }
  function ho(t) {
    let r = [];
    return (
      kr(t, [], (n, e) => {
        if (yo(n)) return r.push([e, n]), 1;
        if (vo(n)) {
          r.push([e, n[0]]);
          for (let o of Reflect.ownKeys(n[1]))
            r.push([[...e, `-${o}`], n[1][o]]);
          return 1;
        }
        if (Array.isArray(n) && n.every((o) => typeof o == "string"))
          return r.push([e, n.join(", ")]), 1;
      }),
      r
    );
  }
  var bo = /^[a-zA-Z0-9-_%/\.]+$/;
  function qe(t) {
    if (t[0] === "container") return null;
    (t = structuredClone(t)),
      t[0] === "animation" && (t[0] = "animate"),
      t[0] === "aspectRatio" && (t[0] = "aspect"),
      t[0] === "borderRadius" && (t[0] = "radius"),
      t[0] === "boxShadow" && (t[0] = "shadow"),
      t[0] === "colors" && (t[0] = "color"),
      t[0] === "containers" && (t[0] = "container"),
      t[0] === "fontFamily" && (t[0] = "font"),
      t[0] === "fontSize" && (t[0] = "text"),
      t[0] === "letterSpacing" && (t[0] = "tracking"),
      t[0] === "lineHeight" && (t[0] = "leading"),
      t[0] === "maxWidth" && (t[0] = "container"),
      t[0] === "screens" && (t[0] = "breakpoint"),
      t[0] === "transitionTimingFunction" && (t[0] = "ease");
    for (let r of t) if (!bo.test(r)) return null;
    return t
      .map((r, n, e) => (r === "1" && n !== e.length - 1 ? "" : r))
      .map((r) =>
        r
          .replaceAll(".", "_")
          .replace(/([a-z])([A-Z])/g, (n, e, o) => `${e}-${o.toLowerCase()}`)
      )
      .filter((r, n) => r !== "DEFAULT" || n !== t.length - 1)
      .join("-");
  }
  function yo(t) {
    return typeof t == "number" || typeof t == "string";
  }
  function vo(t) {
    if (
      !Array.isArray(t) ||
      t.length !== 2 ||
      (typeof t[0] != "string" && typeof t[0] != "number") ||
      t[1] === void 0 ||
      t[1] === null ||
      typeof t[1] != "object"
    )
      return !1;
    for (let r of Reflect.ownKeys(t[1]))
      if (
        typeof r != "string" ||
        (typeof t[1][r] != "string" && typeof t[1][r] != "number")
      )
        return !1;
    return !0;
  }
  function kr(t, r = [], n) {
    for (let e of Reflect.ownKeys(t)) {
      let o = t[e];
      if (o == null) continue;
      let s = [...r, e],
        l = n(o, s) ?? 0;
      if (l !== 1) {
        if (l === 2) return 2;
        if (!(!Array.isArray(o) && typeof o != "object") && kr(o, s, n) === 2)
          return 2;
      }
    }
  }
  function He(t) {
    let r = [];
    for (let n of O(t, ".")) {
      if (!n.includes("[")) {
        r.push(n);
        continue;
      }
      let e = 0;
      for (;;) {
        let o = n.indexOf("[", e),
          s = n.indexOf("]", o);
        if (o === -1 || s === -1) break;
        o > e && r.push(n.slice(e, o)), r.push(n.slice(o + 1, s)), (e = s + 1);
      }
      e <= n.length - 1 && r.push(n.slice(e));
    }
    return r;
  }
  function ve(t) {
    if (Object.prototype.toString.call(t) !== "[object Object]") return !1;
    let r = Object.getPrototypeOf(t);
    return r === null || Object.getPrototypeOf(r) === null;
  }
  function $e(t, r, n, e = []) {
    for (let o of r)
      if (o != null)
        for (let s of Reflect.ownKeys(o)) {
          e.push(s);
          let l = n(t[s], o[s], e);
          l !== void 0
            ? (t[s] = l)
            : !ve(t[s]) || !ve(o[s])
            ? (t[s] = o[s])
            : (t[s] = $e({}, [t[s], o[s]], n, e)),
            e.pop();
        }
    return t;
  }
  function Ge(t, r, n) {
    return function (o, s) {
      let l = o.lastIndexOf("/"),
        p = null;
      l !== -1 && ((p = o.slice(l + 1).trim()), (o = o.slice(0, l).trim()));
      let f = (() => {
        let d = He(o),
          [c, m] = ko(t.theme, d),
          g = n(wr(r() ?? {}, d) ?? null);
        if (
          (typeof g == "string" && (g = g.replace("<alpha-value>", "1")),
          typeof c != "object")
        )
          return typeof m != "object" && m & 4 ? g ?? c : c;
        if (g !== null && typeof g == "object" && !Array.isArray(g)) {
          let y = $e({}, [g], (b, k) => k);
          if (c === null && Object.hasOwn(g, "__CSS_VALUES__")) {
            let b = {};
            for (let k in g.__CSS_VALUES__) (b[k] = g[k]), delete y[k];
            c = b;
          }
          for (let b in c)
            b !== "__CSS_VALUES__" &&
              ((g?.__CSS_VALUES__?.[b] & 4 && wr(y, b.split("-")) !== void 0) ||
                (y[ae(b)] = c[b]));
          return y;
        }
        if (Array.isArray(c) && Array.isArray(m) && Array.isArray(g)) {
          let y = c[0],
            b = c[1];
          m[0] & 4 && (y = g[0] ?? y);
          for (let k of Object.keys(b)) m[1][k] & 4 && (b[k] = g[1][k] ?? b[k]);
          return [y, b];
        }
        return c ?? g;
      })();
      return p && typeof f == "string" && (f = J(f, p)), f ?? s;
    };
  }
  function ko(t, r) {
    if (r.length === 1 && r[0].startsWith("--"))
      return [t.get([r[0]]), t.getOptions(r[0])];
    let n = qe(r),
      e = new Map(),
      o = new F(() => new Map()),
      s = t.namespace(`--${n}`);
    if (s.size === 0) return [null, 0];
    let l = new Map();
    for (let [c, m] of s) {
      if (!c || !c.includes("--")) {
        e.set(c, m), l.set(c, t.getOptions(c ? `--${n}-${c}` : `--${n}`));
        continue;
      }
      let g = c.indexOf("--"),
        y = c.slice(0, g),
        b = c.slice(g + 2);
      (b = b.replace(/-([a-z])/g, (k, A) => A.toUpperCase())),
        o.get(y === "" ? null : y).set(b, [m, t.getOptions(`--${n}${c}`)]);
    }
    let p = t.getOptions(`--${n}`);
    for (let [c, m] of o) {
      let g = e.get(c);
      if (typeof g != "string") continue;
      let y = {},
        b = {};
      for (let [k, [A, w]] of m) (y[k] = A), (b[k] = w);
      e.set(c, [g, y]), l.set(c, [p, b]);
    }
    let f = {},
      d = {};
    for (let [c, m] of e) xr(f, [c ?? "DEFAULT"], m);
    for (let [c, m] of l) xr(d, [c ?? "DEFAULT"], m);
    return r[r.length - 1] === "DEFAULT"
      ? [f?.DEFAULT ?? null, d.DEFAULT ?? 0]
      : "DEFAULT" in f && Object.keys(f).length === 1
      ? [f.DEFAULT, d.DEFAULT ?? 0]
      : ((f.__CSS_VALUES__ = d), [f, d]);
  }
  function wr(t, r) {
    for (let n = 0; n < r.length; ++n) {
      let e = r[n];
      if (t?.[e] === void 0) {
        if (r[n + 1] === void 0) return;
        r[n + 1] = `${e}-${r[n + 1]}`;
        continue;
      }
      t = t[e];
    }
    return t;
  }
  function xr(t, r, n) {
    for (let e of r.slice(0, -1)) t[e] === void 0 && (t[e] = {}), (t = t[e]);
    t[r[r.length - 1]] = n;
  }
  function wo(t) {
    return { kind: "combinator", value: t };
  }
  function xo(t, r) {
    return { kind: "function", value: t, nodes: r };
  }
  function Te(t) {
    return { kind: "selector", value: t };
  }
  function Ao(t) {
    return { kind: "separator", value: t };
  }
  function Co(t) {
    return { kind: "value", value: t };
  }
  function Ve(t, r, n = null) {
    for (let e = 0; e < t.length; e++) {
      let o = t[e],
        s = !1,
        l = 0,
        p =
          r(o, {
            parent: n,
            replaceWith(f) {
              (s = !0),
                Array.isArray(f)
                  ? f.length === 0
                    ? (t.splice(e, 1), (l = 0))
                    : f.length === 1
                    ? ((t[e] = f[0]), (l = 1))
                    : (t.splice(e, 1, ...f), (l = f.length))
                  : ((t[e] = f), (l = 1));
            },
          }) ?? 0;
      if (s) {
        p === 0 ? e-- : (e += l - 1);
        continue;
      }
      if (p === 2) return 2;
      if (p !== 1 && o.kind === "function" && Ve(o.nodes, r, o) === 2) return 2;
    }
  }
  function Ee(t) {
    let r = "";
    for (let n of t)
      switch (n.kind) {
        case "combinator":
        case "selector":
        case "separator":
        case "value": {
          r += n.value;
          break;
        }
        case "function":
          r += n.value + "(" + Ee(n.nodes) + ")";
      }
    return r;
  }
  var Ar = 92,
    So = 93,
    Cr = 41,
    No = 58,
    Sr = 44,
    $o = 34,
    To = 46,
    Nr = 62,
    $r = 10,
    Vo = 35,
    Tr = 91,
    Vr = 40,
    Er = 43,
    Eo = 39,
    Rr = 32,
    Or = 9,
    Kr = 126;
  function Ye(t) {
    t = t.replaceAll(
      `\r
    `,
      `
    `
    );
    let r = [],
      n = [],
      e = null,
      o = "",
      s;
    for (let l = 0; l < t.length; l++) {
      let p = t.charCodeAt(l);
      switch (p) {
        case Sr:
        case Nr:
        case $r:
        case Rr:
        case Er:
        case Or:
        case Kr: {
          if (o.length > 0) {
            let g = Te(o);
            e ? e.nodes.push(g) : r.push(g), (o = "");
          }
          let f = l,
            d = l + 1;
          for (
            ;
            d < t.length &&
            ((s = t.charCodeAt(d)),
            !(
              s !== Sr &&
              s !== Nr &&
              s !== $r &&
              s !== Rr &&
              s !== Er &&
              s !== Or &&
              s !== Kr
            ));
            d++
          );
          l = d - 1;
          let c = t.slice(f, d),
            m = c.trim() === "," ? Ao(c) : wo(c);
          e ? e.nodes.push(m) : r.push(m);
          break;
        }
        case Vr: {
          let f = xo(o, []);
          if (
            ((o = ""),
            f.value !== ":not" &&
              f.value !== ":where" &&
              f.value !== ":has" &&
              f.value !== ":is")
          ) {
            let d = l + 1,
              c = 0;
            for (let g = l + 1; g < t.length; g++) {
              if (((s = t.charCodeAt(g)), s === Vr)) {
                c++;
                continue;
              }
              if (s === Cr) {
                if (c === 0) {
                  l = g;
                  break;
                }
                c--;
              }
            }
            let m = l;
            f.nodes.push(Co(t.slice(d, m))),
              (o = ""),
              (l = m),
              e ? e.nodes.push(f) : r.push(f);
            break;
          }
          e ? e.nodes.push(f) : r.push(f), n.push(f), (e = f);
          break;
        }
        case Cr: {
          let f = n.pop();
          if (o.length > 0) {
            let d = Te(o);
            f.nodes.push(d), (o = "");
          }
          n.length > 0 ? (e = n[n.length - 1]) : (e = null);
          break;
        }
        case To:
        case No:
        case Vo: {
          if (o.length > 0) {
            let f = Te(o);
            e ? e.nodes.push(f) : r.push(f);
          }
          o = String.fromCharCode(p);
          break;
        }
        case Tr: {
          if (o.length > 0) {
            let c = Te(o);
            e ? e.nodes.push(c) : r.push(c);
          }
          o = "";
          let f = l,
            d = 0;
          for (let c = l + 1; c < t.length; c++) {
            if (((s = t.charCodeAt(c)), s === Tr)) {
              d++;
              continue;
            }
            if (s === So) {
              if (d === 0) {
                l = c;
                break;
              }
              d--;
            }
          }
          o += t.slice(f, l + 1);
          break;
        }
        case Eo:
        case $o: {
          let f = l;
          for (let d = l + 1; d < t.length; d++)
            if (((s = t.charCodeAt(d)), s === Ar)) d += 1;
            else if (s === p) {
              l = d;
              break;
            }
          o += t.slice(f, l + 1);
          break;
        }
        case Ar: {
          let f = t.charCodeAt(l + 1);
          (o += String.fromCharCode(p) + String.fromCharCode(f)), (l += 1);
          break;
        }
        default:
          o += String.fromCharCode(p);
      }
    }
    return o.length > 0 && r.push(Te(o)), r;
  }
  var Pr = /^[a-z@][a-zA-Z0-9/%._-]*$/;
  function xt({
    designSystem: t,
    ast: r,
    resolvedConfig: n,
    featuresRef: e,
    referenceMode: o,
  }) {
    let s = {
      addBase(l) {
        if (o) return;
        let p = X(l);
        (e.current |= he(p, t)), r.push(K("@layer", "base", p));
      },
      addVariant(l, p) {
        if (!Be.test(l))
          throw new Error(
            `\`addVariant('${l}')\` defines an invalid variant name. Variants should only contain alphanumeric, dashes or underscore characters.`
          );
        typeof p == "string" || Array.isArray(p)
          ? t.variants.static(
              l,
              (f) => {
                f.nodes = Ur(p, f.nodes);
              },
              { compounds: fe(typeof p == "string" ? [p] : p) }
            )
          : typeof p == "object" && t.variants.fromAst(l, X(p));
      },
      matchVariant(l, p, f) {
        function d(m, g, y) {
          let b = p(m, { modifier: g?.value ?? null });
          return Ur(b, y);
        }
        let c = Object.keys(f?.values ?? {});
        t.variants.group(
          () => {
            t.variants.functional(l, (m, g) => {
              if (!g.value) {
                if (f?.values && "DEFAULT" in f.values) {
                  m.nodes = d(f.values.DEFAULT, g.modifier, m.nodes);
                  return;
                }
                return null;
              }
              if (g.value.kind === "arbitrary")
                m.nodes = d(g.value.value, g.modifier, m.nodes);
              else if (g.value.kind === "named" && f?.values) {
                let y = f.values[g.value.value];
                if (typeof y != "string") return;
                m.nodes = d(y, g.modifier, m.nodes);
              }
            });
          },
          (m, g) => {
            if (m.kind !== "functional" || g.kind !== "functional") return 0;
            let y = m.value ? m.value.value : "DEFAULT",
              b = g.value ? g.value.value : "DEFAULT",
              k = f?.values?.[y] ?? y,
              A = f?.values?.[b] ?? b;
            if (f && typeof f.sort == "function")
              return f.sort(
                { value: k, modifier: m.modifier?.value ?? null },
                { value: A, modifier: g.modifier?.value ?? null }
              );
            let w = c.indexOf(y),
              T = c.indexOf(b);
            return (
              (w = w === -1 ? c.length : w),
              (T = T === -1 ? c.length : T),
              w !== T ? w - T : k < A ? -1 : 1
            );
          }
        );
      },
      addUtilities(l) {
        l = Array.isArray(l) ? l : [l];
        let p = l.flatMap((d) => Object.entries(d));
        p = p.flatMap(([d, c]) => O(d, ",").map((m) => [m.trim(), c]));
        let f = new F(() => []);
        for (let [d, c] of p) {
          if (d.startsWith("@keyframes ")) {
            o || r.push(M(d, X(c)));
            continue;
          }
          let m = Ye(d),
            g = !1;
          if (
            (Ve(m, (y) => {
              if (
                y.kind === "selector" &&
                y.value[0] === "." &&
                Pr.test(y.value.slice(1))
              ) {
                let b = y.value;
                y.value = "&";
                let k = Ee(m),
                  A = b.slice(1),
                  w = k === "&" ? X(c) : [M(k, X(c))];
                f.get(A).push(...w), (g = !0), (y.value = b);
                return;
              }
              if (y.kind === "function" && y.value === ":not") return 1;
            }),
            !g)
          )
            throw new Error(
              `\`addUtilities({ '${d}' : \u2026 })\` defines an invalid utility selector. Utilities must be a single class name and start with a lowercase letter, eg. \`.scrollbar-none\`.`
            );
        }
        for (let [d, c] of f)
          t.theme.prefix &&
            P(c, (m) => {
              if (m.kind === "rule") {
                let g = Ye(m.selector);
                Ve(g, (y) => {
                  y.kind === "selector" &&
                    y.value[0] === "." &&
                    (y.value = `.${t.theme.prefix}\\:${y.value.slice(1)}`);
                }),
                  (m.selector = Ee(g));
              }
            }),
            t.utilities.static(d, (m) => {
              let g = structuredClone(c);
              return _r(g, d, m.raw), (e.current |= Ne(g, t)), g;
            });
      },
      matchUtilities(l, p) {
        let f = p?.type
          ? Array.isArray(p?.type)
            ? p.type
            : [p.type]
          : ["any"];
        for (let [c, m] of Object.entries(l)) {
          let g = function ({ negative: y }) {
            return (b) => {
              if (
                b.value?.kind === "arbitrary" &&
                f.length > 0 &&
                !f.includes("any") &&
                ((b.value.dataType && !f.includes(b.value.dataType)) ||
                  (!b.value.dataType && !j(b.value.value, f)))
              )
                return;
              let k = f.includes("color"),
                A = null,
                w = !1;
              {
                let R = p?.values ?? {};
                k &&
                  (R = Object.assign(
                    {
                      inherit: "inherit",
                      transparent: "transparent",
                      current: "currentColor",
                    },
                    R
                  )),
                  b.value
                    ? b.value.kind === "arbitrary"
                      ? (A = b.value.value)
                      : b.value.fraction && R[b.value.fraction]
                      ? ((A = R[b.value.fraction]), (w = !0))
                      : R[b.value.value]
                      ? (A = R[b.value.value])
                      : R.__BARE_VALUE__ &&
                        ((A = R.__BARE_VALUE__(b.value) ?? null),
                        (w =
                          (b.value.fraction !== null && A?.includes("/")) ??
                          !1))
                    : (A = R.DEFAULT ?? null);
              }
              if (A === null) return;
              let T;
              {
                let R = p?.modifiers ?? null;
                b.modifier
                  ? R === "any" || b.modifier.kind === "arbitrary"
                    ? (T = b.modifier.value)
                    : R?.[b.modifier.value]
                    ? (T = R[b.modifier.value])
                    : k && !Number.isNaN(Number(b.modifier.value))
                    ? (T = `${b.modifier.value}%`)
                    : (T = null)
                  : (T = null);
              }
              if (b.modifier && T === null && !w)
                return b.value?.kind === "arbitrary" ? null : void 0;
              k && T !== null && (A = J(A, T)), y && (A = `calc(${A} * -1)`);
              let z = X(m(A, { modifier: T }));
              return _r(z, c, b.raw), (e.current |= Ne(z, t)), z;
            };
          };
          var d = g;
          if (!Pr.test(c))
            throw new Error(
              `\`matchUtilities({ '${c}' : \u2026 })\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter, eg. \`scrollbar\`.`
            );
          p?.supportsNegativeValues &&
            t.utilities.functional(`-${c}`, g({ negative: !0 }), { types: f }),
            t.utilities.functional(c, g({ negative: !1 }), { types: f }),
            t.utilities.suggest(c, () => {
              let y = p?.values ?? {},
                b = new Set(Object.keys(y));
              b.delete("__BARE_VALUE__"),
                b.has("DEFAULT") && (b.delete("DEFAULT"), b.add(null));
              let k = p?.modifiers ?? {},
                A = k === "any" ? [] : Object.keys(k);
              return [
                {
                  supportsNegative: p?.supportsNegativeValues ?? !1,
                  values: Array.from(b),
                  modifiers: A,
                },
              ];
            });
        }
      },
      addComponents(l, p) {
        this.addUtilities(l, p);
      },
      matchComponents(l, p) {
        this.matchUtilities(l, p);
      },
      theme: Ge(
        t,
        () => n.theme ?? {},
        (l) => l
      ),
      prefix(l) {
        return l;
      },
      config(l, p) {
        let f = n;
        if (!l) return f;
        let d = He(l);
        for (let c = 0; c < d.length; ++c) {
          let m = d[c];
          if (f[m] === void 0) return p;
          f = f[m];
        }
        return f ?? p;
      },
    };
    return (
      (s.addComponents = s.addComponents.bind(s)),
      (s.matchComponents = s.matchComponents.bind(s)),
      s
    );
  }
  function X(t) {
    let r = [];
    t = Array.isArray(t) ? t : [t];
    let n = t.flatMap((e) => Object.entries(e));
    for (let [e, o] of n)
      if (typeof o != "object") {
        if (!e.startsWith("--")) {
          if (o === "@slot") {
            r.push(M(e, [K("@slot")]));
            continue;
          }
          e = e.replace(/([A-Z])/g, "-$1").toLowerCase();
        }
        r.push(a(e, String(o)));
      } else if (Array.isArray(o))
        for (let s of o)
          typeof s == "string" ? r.push(a(e, s)) : r.push(M(e, X(s)));
      else o !== null && r.push(M(e, X(o)));
    return r;
  }
  function Ur(t, r) {
    return (typeof t == "string" ? [t] : t).flatMap((e) => {
      if (e.trim().endsWith("}")) {
        let o = e.replace("}", "{@slot}}"),
          s = pe(o);
        return vt(s, r), s;
      } else return M(e, r);
    });
  }
  function _r(t, r, n) {
    P(t, (e) => {
      if (e.kind === "rule") {
        let o = Ye(e.selector);
        Ve(o, (s) => {
          s.kind === "selector" &&
            s.value === `.${r}` &&
            (s.value = `.${re(n)}`);
        }),
          (e.selector = Ee(o));
      }
    });
  }
  function Dr(t, r, n) {
    for (let e of Oo(r)) t.theme.addKeyframes(e);
  }
  function Oo(t) {
    let r = [];
    if ("keyframes" in t.theme)
      for (let [n, e] of Object.entries(t.theme.keyframes))
        r.push(K("@keyframes", n, X(e)));
    return r;
  }
  var Je = {
    inherit: "inherit",
    current: "currentColor",
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    slate: {
      50: "oklch(0.984 0.003 247.858)",
      100: "oklch(0.968 0.007 247.896)",
      200: "oklch(0.929 0.013 255.508)",
      300: "oklch(0.869 0.022 252.894)",
      400: "oklch(0.704 0.04 256.788)",
      500: "oklch(0.554 0.046 257.417)",
      600: "oklch(0.446 0.043 257.281)",
      700: "oklch(0.372 0.044 257.287)",
      800: "oklch(0.279 0.041 260.031)",
      900: "oklch(0.208 0.042 265.755)",
      950: "oklch(0.129 0.042 264.695)",
    },
    gray: {
      50: "oklch(0.985 0.002 247.839)",
      100: "oklch(0.967 0.003 264.542)",
      200: "oklch(0.928 0.006 264.531)",
      300: "oklch(0.872 0.01 258.338)",
      400: "oklch(0.707 0.022 261.325)",
      500: "oklch(0.551 0.027 264.364)",
      600: "oklch(0.446 0.03 256.802)",
      700: "oklch(0.373 0.034 259.733)",
      800: "oklch(0.278 0.033 256.848)",
      900: "oklch(0.21 0.034 264.665)",
      950: "oklch(0.13 0.028 261.692)",
    },
    zinc: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.967 0.001 286.375)",
      200: "oklch(0.92 0.004 286.32)",
      300: "oklch(0.871 0.006 286.286)",
      400: "oklch(0.705 0.015 286.067)",
      500: "oklch(0.552 0.016 285.938)",
      600: "oklch(0.442 0.017 285.786)",
      700: "oklch(0.37 0.013 285.805)",
      800: "oklch(0.274 0.006 286.033)",
      900: "oklch(0.21 0.006 285.885)",
      950: "oklch(0.141 0.005 285.823)",
    },
    neutral: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.97 0 0)",
      200: "oklch(0.922 0 0)",
      300: "oklch(0.87 0 0)",
      400: "oklch(0.708 0 0)",
      500: "oklch(0.556 0 0)",
      600: "oklch(0.439 0 0)",
      700: "oklch(0.371 0 0)",
      800: "oklch(0.269 0 0)",
      900: "oklch(0.205 0 0)",
      950: "oklch(0.145 0 0)",
    },
    stone: {
      50: "oklch(0.985 0.001 106.423)",
      100: "oklch(0.97 0.001 106.424)",
      200: "oklch(0.923 0.003 48.717)",
      300: "oklch(0.869 0.005 56.366)",
      400: "oklch(0.709 0.01 56.259)",
      500: "oklch(0.553 0.013 58.071)",
      600: "oklch(0.444 0.011 73.639)",
      700: "oklch(0.374 0.01 67.558)",
      800: "oklch(0.268 0.007 34.298)",
      900: "oklch(0.216 0.006 56.043)",
      950: "oklch(0.147 0.004 49.25)",
    },
    red: {
      50: "oklch(0.971 0.013 17.38)",
      100: "oklch(0.936 0.032 17.717)",
      200: "oklch(0.885 0.062 18.334)",
      300: "oklch(0.808 0.114 19.571)",
      400: "oklch(0.704 0.191 22.216)",
      500: "oklch(0.637 0.237 25.331)",
      600: "oklch(0.577 0.245 27.325)",
      700: "oklch(0.505 0.213 27.518)",
      800: "oklch(0.444 0.177 26.899)",
      900: "oklch(0.396 0.141 25.723)",
      950: "oklch(0.258 0.092 26.042)",
    },
    orange: {
      50: "oklch(0.98 0.016 73.684)",
      100: "oklch(0.954 0.038 75.164)",
      200: "oklch(0.901 0.076 70.697)",
      300: "oklch(0.837 0.128 66.29)",
      400: "oklch(0.75 0.183 55.934)",
      500: "oklch(0.705 0.213 47.604)",
      600: "oklch(0.646 0.222 41.116)",
      700: "oklch(0.553 0.195 38.402)",
      800: "oklch(0.47 0.157 37.304)",
      900: "oklch(0.408 0.123 38.172)",
      950: "oklch(0.266 0.079 36.259)",
    },
    amber: {
      50: "oklch(0.987 0.022 95.277)",
      100: "oklch(0.962 0.059 95.617)",
      200: "oklch(0.924 0.12 95.746)",
      300: "oklch(0.879 0.169 91.605)",
      400: "oklch(0.828 0.189 84.429)",
      500: "oklch(0.769 0.188 70.08)",
      600: "oklch(0.666 0.179 58.318)",
      700: "oklch(0.555 0.163 48.998)",
      800: "oklch(0.473 0.137 46.201)",
      900: "oklch(0.414 0.112 45.904)",
      950: "oklch(0.279 0.077 45.635)",
    },
    yellow: {
      50: "oklch(0.987 0.026 102.212)",
      100: "oklch(0.973 0.071 103.193)",
      200: "oklch(0.945 0.129 101.54)",
      300: "oklch(0.905 0.182 98.111)",
      400: "oklch(0.852 0.199 91.936)",
      500: "oklch(0.795 0.184 86.047)",
      600: "oklch(0.681 0.162 75.834)",
      700: "oklch(0.554 0.135 66.442)",
      800: "oklch(0.476 0.114 61.907)",
      900: "oklch(0.421 0.095 57.708)",
      950: "oklch(0.286 0.066 53.813)",
    },
    lime: {
      50: "oklch(0.986 0.031 120.757)",
      100: "oklch(0.967 0.067 122.328)",
      200: "oklch(0.938 0.127 124.321)",
      300: "oklch(0.897 0.196 126.665)",
      400: "oklch(0.841 0.238 128.85)",
      500: "oklch(0.768 0.233 130.85)",
      600: "oklch(0.648 0.2 131.684)",
      700: "oklch(0.532 0.157 131.589)",
      800: "oklch(0.453 0.124 130.933)",
      900: "oklch(0.405 0.101 131.063)",
      950: "oklch(0.274 0.072 132.109)",
    },
    green: {
      50: "oklch(0.982 0.018 155.826)",
      100: "oklch(0.962 0.044 156.743)",
      200: "oklch(0.925 0.084 155.995)",
      300: "oklch(0.871 0.15 154.449)",
      400: "oklch(0.792 0.209 151.711)",
      500: "oklch(0.723 0.219 149.579)",
      600: "oklch(0.627 0.194 149.214)",
      700: "oklch(0.527 0.154 150.069)",
      800: "oklch(0.448 0.119 151.328)",
      900: "oklch(0.393 0.095 152.535)",
      950: "oklch(0.266 0.065 152.934)",
    },
    emerald: {
      50: "oklch(0.979 0.021 166.113)",
      100: "oklch(0.95 0.052 163.051)",
      200: "oklch(0.905 0.093 164.15)",
      300: "oklch(0.845 0.143 164.978)",
      400: "oklch(0.765 0.177 163.223)",
      500: "oklch(0.696 0.17 162.48)",
      600: "oklch(0.596 0.145 163.225)",
      700: "oklch(0.508 0.118 165.612)",
      800: "oklch(0.432 0.095 166.913)",
      900: "oklch(0.378 0.077 168.94)",
      950: "oklch(0.262 0.051 172.552)",
    },
    teal: {
      50: "oklch(0.984 0.014 180.72)",
      100: "oklch(0.953 0.051 180.801)",
      200: "oklch(0.91 0.096 180.426)",
      300: "oklch(0.855 0.138 181.071)",
      400: "oklch(0.777 0.152 181.912)",
      500: "oklch(0.704 0.14 182.503)",
      600: "oklch(0.6 0.118 184.704)",
      700: "oklch(0.511 0.096 186.391)",
      800: "oklch(0.437 0.078 188.216)",
      900: "oklch(0.386 0.063 188.416)",
      950: "oklch(0.277 0.046 192.524)",
    },
    cyan: {
      50: "oklch(0.984 0.019 200.873)",
      100: "oklch(0.956 0.045 203.388)",
      200: "oklch(0.917 0.08 205.041)",
      300: "oklch(0.865 0.127 207.078)",
      400: "oklch(0.789 0.154 211.53)",
      500: "oklch(0.715 0.143 215.221)",
      600: "oklch(0.609 0.126 221.723)",
      700: "oklch(0.52 0.105 223.128)",
      800: "oklch(0.45 0.085 224.283)",
      900: "oklch(0.398 0.07 227.392)",
      950: "oklch(0.302 0.056 229.695)",
    },
    sky: {
      50: "oklch(0.977 0.013 236.62)",
      100: "oklch(0.951 0.026 236.824)",
      200: "oklch(0.901 0.058 230.902)",
      300: "oklch(0.828 0.111 230.318)",
      400: "oklch(0.746 0.16 232.661)",
      500: "oklch(0.685 0.169 237.323)",
      600: "oklch(0.588 0.158 241.966)",
      700: "oklch(0.5 0.134 242.749)",
      800: "oklch(0.443 0.11 240.79)",
      900: "oklch(0.391 0.09 240.876)",
      950: "oklch(0.293 0.066 243.157)",
    },
    blue: {
      50: "oklch(0.97 0.014 254.604)",
      100: "oklch(0.932 0.032 255.585)",
      200: "oklch(0.882 0.059 254.128)",
      300: "oklch(0.809 0.105 251.813)",
      400: "oklch(0.707 0.165 254.624)",
      500: "oklch(0.623 0.214 259.815)",
      600: "oklch(0.546 0.245 262.881)",
      700: "oklch(0.488 0.243 264.376)",
      800: "oklch(0.424 0.199 265.638)",
      900: "oklch(0.379 0.146 265.522)",
      950: "oklch(0.282 0.091 267.935)",
    },
    indigo: {
      50: "oklch(0.962 0.018 272.314)",
      100: "oklch(0.93 0.034 272.788)",
      200: "oklch(0.87 0.065 274.039)",
      300: "oklch(0.785 0.115 274.713)",
      400: "oklch(0.673 0.182 276.935)",
      500: "oklch(0.585 0.233 277.117)",
      600: "oklch(0.511 0.262 276.966)",
      700: "oklch(0.457 0.24 277.023)",
      800: "oklch(0.398 0.195 277.366)",
      900: "oklch(0.359 0.144 278.697)",
      950: "oklch(0.257 0.09 281.288)",
    },
    violet: {
      50: "oklch(0.969 0.016 293.756)",
      100: "oklch(0.943 0.029 294.588)",
      200: "oklch(0.894 0.057 293.283)",
      300: "oklch(0.811 0.111 293.571)",
      400: "oklch(0.702 0.183 293.541)",
      500: "oklch(0.606 0.25 292.717)",
      600: "oklch(0.541 0.281 293.009)",
      700: "oklch(0.491 0.27 292.581)",
      800: "oklch(0.432 0.232 292.759)",
      900: "oklch(0.38 0.189 293.745)",
      950: "oklch(0.283 0.141 291.089)",
    },
    purple: {
      50: "oklch(0.977 0.014 308.299)",
      100: "oklch(0.946 0.033 307.174)",
      200: "oklch(0.902 0.063 306.703)",
      300: "oklch(0.827 0.119 306.383)",
      400: "oklch(0.714 0.203 305.504)",
      500: "oklch(0.627 0.265 303.9)",
      600: "oklch(0.558 0.288 302.321)",
      700: "oklch(0.496 0.265 301.924)",
      800: "oklch(0.438 0.218 303.724)",
      900: "oklch(0.381 0.176 304.987)",
      950: "oklch(0.291 0.149 302.717)",
    },
    fuchsia: {
      50: "oklch(0.977 0.017 320.058)",
      100: "oklch(0.952 0.037 318.852)",
      200: "oklch(0.903 0.076 319.62)",
      300: "oklch(0.833 0.145 321.434)",
      400: "oklch(0.74 0.238 322.16)",
      500: "oklch(0.667 0.295 322.15)",
      600: "oklch(0.591 0.293 322.896)",
      700: "oklch(0.518 0.253 323.949)",
      800: "oklch(0.452 0.211 324.591)",
      900: "oklch(0.401 0.17 325.612)",
      950: "oklch(0.293 0.136 325.661)",
    },
    pink: {
      50: "oklch(0.971 0.014 343.198)",
      100: "oklch(0.948 0.028 342.258)",
      200: "oklch(0.899 0.061 343.231)",
      300: "oklch(0.823 0.12 346.018)",
      400: "oklch(0.718 0.202 349.761)",
      500: "oklch(0.656 0.241 354.308)",
      600: "oklch(0.592 0.249 0.584)",
      700: "oklch(0.525 0.223 3.958)",
      800: "oklch(0.459 0.187 3.815)",
      900: "oklch(0.408 0.153 2.432)",
      950: "oklch(0.284 0.109 3.907)",
    },
    rose: {
      50: "oklch(0.969 0.015 12.422)",
      100: "oklch(0.941 0.03 12.58)",
      200: "oklch(0.892 0.058 10.001)",
      300: "oklch(0.81 0.117 11.638)",
      400: "oklch(0.712 0.194 13.428)",
      500: "oklch(0.645 0.246 16.439)",
      600: "oklch(0.586 0.253 17.585)",
      700: "oklch(0.514 0.222 16.935)",
      800: "oklch(0.455 0.188 13.697)",
      900: "oklch(0.41 0.159 10.272)",
      950: "oklch(0.271 0.105 12.094)",
    },
  };
  function de(t) {
    return { __BARE_VALUE__: t };
  }
  var Z = de((t) => {
      if (V(t.value)) return t.value;
    }),
    q = de((t) => {
      if (V(t.value)) return `${t.value}%`;
    }),
    ie = de((t) => {
      if (V(t.value)) return `${t.value}px`;
    }),
    zr = de((t) => {
      if (V(t.value)) return `${t.value}ms`;
    }),
    Ze = de((t) => {
      if (V(t.value)) return `${t.value}deg`;
    }),
    Ko = de((t) => {
      if (t.fraction === null) return;
      let [r, n] = O(t.fraction, "/");
      if (!(!V(r) || !V(n))) return t.fraction;
    }),
    Ir = de((t) => {
      if (V(Number(t.value))) return `repeat(${t.value}, minmax(0, 1fr))`;
    }),
    Fr = {
      accentColor: ({ theme: t }) => t("colors"),
      animation: {
        none: "none",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
      },
      aria: {
        busy: 'busy="true"',
        checked: 'checked="true"',
        disabled: 'disabled="true"',
        expanded: 'expanded="true"',
        hidden: 'hidden="true"',
        pressed: 'pressed="true"',
        readonly: 'readonly="true"',
        required: 'required="true"',
        selected: 'selected="true"',
      },
      aspectRatio: { auto: "auto", square: "1 / 1", video: "16 / 9", ...Ko },
      backdropBlur: ({ theme: t }) => t("blur"),
      backdropBrightness: ({ theme: t }) => ({ ...t("brightness"), ...q }),
      backdropContrast: ({ theme: t }) => ({ ...t("contrast"), ...q }),
      backdropGrayscale: ({ theme: t }) => ({ ...t("grayscale"), ...q }),
      backdropHueRotate: ({ theme: t }) => ({ ...t("hueRotate"), ...Ze }),
      backdropInvert: ({ theme: t }) => ({ ...t("invert"), ...q }),
      backdropOpacity: ({ theme: t }) => ({ ...t("opacity"), ...q }),
      backdropSaturate: ({ theme: t }) => ({ ...t("saturate"), ...q }),
      backdropSepia: ({ theme: t }) => ({ ...t("sepia"), ...q }),
      backgroundColor: ({ theme: t }) => t("colors"),
      backgroundImage: {
        none: "none",
        "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
        "gradient-to-tr":
          "linear-gradient(to top right, var(--tw-gradient-stops))",
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-to-br":
          "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
        "gradient-to-bl":
          "linear-gradient(to bottom left, var(--tw-gradient-stops))",
        "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
        "gradient-to-tl":
          "linear-gradient(to top left, var(--tw-gradient-stops))",
      },
      backgroundOpacity: ({ theme: t }) => t("opacity"),
      backgroundPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top",
      },
      backgroundSize: { auto: "auto", cover: "cover", contain: "contain" },
      blur: {
        0: "0",
        none: "",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      borderColor: ({ theme: t }) => ({
        DEFAULT: "currentColor",
        ...t("colors"),
      }),
      borderOpacity: ({ theme: t }) => t("opacity"),
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      borderSpacing: ({ theme: t }) => t("spacing"),
      borderWidth: {
        DEFAULT: "1px",
        0: "0px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        none: "none",
      },
      boxShadowColor: ({ theme: t }) => t("colors"),
      brightness: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...q,
      },
      caretColor: ({ theme: t }) => t("colors"),
      colors: () => ({ ...Je }),
      columns: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        "3xs": "16rem",
        "2xs": "18rem",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        ...Z,
      },
      container: {},
      content: { none: "none" },
      contrast: {
        0: "0",
        50: ".5",
        75: ".75",
        100: "1",
        125: "1.25",
        150: "1.5",
        200: "2",
        ...q,
      },
      cursor: {
        auto: "auto",
        default: "default",
        pointer: "pointer",
        wait: "wait",
        text: "text",
        move: "move",
        help: "help",
        "not-allowed": "not-allowed",
        none: "none",
        "context-menu": "context-menu",
        progress: "progress",
        cell: "cell",
        crosshair: "crosshair",
        "vertical-text": "vertical-text",
        alias: "alias",
        copy: "copy",
        "no-drop": "no-drop",
        grab: "grab",
        grabbing: "grabbing",
        "all-scroll": "all-scroll",
        "col-resize": "col-resize",
        "row-resize": "row-resize",
        "n-resize": "n-resize",
        "e-resize": "e-resize",
        "s-resize": "s-resize",
        "w-resize": "w-resize",
        "ne-resize": "ne-resize",
        "nw-resize": "nw-resize",
        "se-resize": "se-resize",
        "sw-resize": "sw-resize",
        "ew-resize": "ew-resize",
        "ns-resize": "ns-resize",
        "nesw-resize": "nesw-resize",
        "nwse-resize": "nwse-resize",
        "zoom-in": "zoom-in",
        "zoom-out": "zoom-out",
      },
      divideColor: ({ theme: t }) => t("borderColor"),
      divideOpacity: ({ theme: t }) => t("borderOpacity"),
      divideWidth: ({ theme: t }) => ({ ...t("borderWidth"), ...ie }),
      dropShadow: {
        sm: "0 1px 1px rgb(0 0 0 / 0.05)",
        DEFAULT: ["0 1px 2px rgb(0 0 0 / 0.1)", "0 1px 1px rgb(0 0 0 / 0.06)"],
        md: ["0 4px 3px rgb(0 0 0 / 0.07)", "0 2px 2px rgb(0 0 0 / 0.06)"],
        lg: ["0 10px 8px rgb(0 0 0 / 0.04)", "0 4px 3px rgb(0 0 0 / 0.1)"],
        xl: ["0 20px 13px rgb(0 0 0 / 0.03)", "0 8px 5px rgb(0 0 0 / 0.08)"],
        "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
        none: "0 0 #0000",
      },
      fill: ({ theme: t }) => t("colors"),
      flex: {
        1: "1 1 0%",
        auto: "1 1 auto",
        initial: "0 1 auto",
        none: "none",
      },
      flexBasis: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        ...t("spacing"),
      }),
      flexGrow: { 0: "0", DEFAULT: "1", ...Z },
      flexShrink: { 0: "0", DEFAULT: "1", ...Z },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      gap: ({ theme: t }) => t("spacing"),
      gradientColorStops: ({ theme: t }) => t("colors"),
      gradientColorStopPositions: {
        "0%": "0%",
        "5%": "5%",
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "35%": "35%",
        "40%": "40%",
        "45%": "45%",
        "50%": "50%",
        "55%": "55%",
        "60%": "60%",
        "65%": "65%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "85%": "85%",
        "90%": "90%",
        "95%": "95%",
        "100%": "100%",
        ...q,
      },
      grayscale: { 0: "0", DEFAULT: "100%", ...q },
      gridAutoColumns: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)",
      },
      gridAutoRows: {
        auto: "auto",
        min: "min-content",
        max: "max-content",
        fr: "minmax(0, 1fr)",
      },
      gridColumn: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1",
      },
      gridColumnEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridColumnStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridRow: {
        auto: "auto",
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
        "span-full": "1 / -1",
      },
      gridRowEnd: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridRowStart: {
        auto: "auto",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        ...Z,
      },
      gridTemplateColumns: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...Ir,
      },
      gridTemplateRows: {
        none: "none",
        subgrid: "subgrid",
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        ...Ir,
      },
      height: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      hueRotate: {
        0: "0deg",
        15: "15deg",
        30: "30deg",
        60: "60deg",
        90: "90deg",
        180: "180deg",
        ...Ze,
      },
      inset: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...t("spacing"),
      }),
      invert: { 0: "0", DEFAULT: "100%", ...q },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        ping: { "75%, 100%": { transform: "scale(2)", opacity: "0" } },
        pulse: { "50%": { opacity: ".5" } },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        3: ".75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
      },
      listStyleType: { none: "none", disc: "disc", decimal: "decimal" },
      listStyleImage: { none: "none" },
      margin: ({ theme: t }) => ({ auto: "auto", ...t("spacing") }),
      lineClamp: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", ...Z },
      maxHeight: ({ theme: t }) => ({
        none: "none",
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      maxWidth: ({ theme: t }) => ({
        none: "none",
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        prose: "65ch",
        ...t("spacing"),
      }),
      minHeight: ({ theme: t }) => ({
        full: "100%",
        screen: "100vh",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      minWidth: ({ theme: t }) => ({
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      objectPosition: {
        bottom: "bottom",
        center: "center",
        left: "left",
        "left-bottom": "left bottom",
        "left-top": "left top",
        right: "right",
        "right-bottom": "right bottom",
        "right-top": "right top",
        top: "top",
      },
      opacity: {
        0: "0",
        5: "0.05",
        10: "0.1",
        15: "0.15",
        20: "0.2",
        25: "0.25",
        30: "0.3",
        35: "0.35",
        40: "0.4",
        45: "0.45",
        50: "0.5",
        55: "0.55",
        60: "0.6",
        65: "0.65",
        70: "0.7",
        75: "0.75",
        80: "0.8",
        85: "0.85",
        90: "0.9",
        95: "0.95",
        100: "1",
        ...q,
      },
      order: {
        first: "-9999",
        last: "9999",
        none: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        ...Z,
      },
      outlineColor: ({ theme: t }) => t("colors"),
      outlineOffset: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      outlineWidth: { 0: "0px", 1: "1px", 2: "2px", 4: "4px", 8: "8px", ...ie },
      padding: ({ theme: t }) => t("spacing"),
      placeholderColor: ({ theme: t }) => t("colors"),
      placeholderOpacity: ({ theme: t }) => t("opacity"),
      ringColor: ({ theme: t }) => ({
        DEFAULT: "currentColor",
        ...t("colors"),
      }),
      ringOffsetColor: ({ theme: t }) => t("colors"),
      ringOffsetWidth: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      ringOpacity: ({ theme: t }) => ({ DEFAULT: "0.5", ...t("opacity") }),
      ringWidth: {
        DEFAULT: "3px",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      rotate: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        45: "45deg",
        90: "90deg",
        180: "180deg",
        ...Ze,
      },
      saturate: { 0: "0", 50: ".5", 100: "1", 150: "1.5", 200: "2", ...q },
      scale: {
        0: "0",
        50: ".5",
        75: ".75",
        90: ".9",
        95: ".95",
        100: "1",
        105: "1.05",
        110: "1.1",
        125: "1.25",
        150: "1.5",
        ...q,
      },
      screens: {
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "96rem",
      },
      scrollMargin: ({ theme: t }) => t("spacing"),
      scrollPadding: ({ theme: t }) => t("spacing"),
      sepia: { 0: "0", DEFAULT: "100%", ...q },
      skew: {
        0: "0deg",
        1: "1deg",
        2: "2deg",
        3: "3deg",
        6: "6deg",
        12: "12deg",
        ...Ze,
      },
      space: ({ theme: t }) => t("spacing"),
      spacing: {
        px: "1px",
        0: "0px",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
      stroke: ({ theme: t }) => ({ none: "none", ...t("colors") }),
      strokeWidth: { 0: "0", 1: "1", 2: "2", ...Z },
      supports: {},
      data: {},
      textColor: ({ theme: t }) => t("colors"),
      textDecorationColor: ({ theme: t }) => t("colors"),
      textDecorationThickness: {
        auto: "auto",
        "from-font": "from-font",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      textIndent: ({ theme: t }) => t("spacing"),
      textOpacity: ({ theme: t }) => t("opacity"),
      textUnderlineOffset: {
        auto: "auto",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        ...ie,
      },
      transformOrigin: {
        center: "center",
        top: "top",
        "top-right": "top right",
        right: "right",
        "bottom-right": "bottom right",
        bottom: "bottom",
        "bottom-left": "bottom left",
        left: "left",
        "top-left": "top left",
      },
      transitionDelay: {
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...zr,
      },
      transitionDuration: {
        DEFAULT: "150ms",
        0: "0s",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1e3: "1000ms",
        ...zr,
      },
      transitionProperty: {
        none: "none",
        all: "all",
        DEFAULT:
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        colors:
          "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      translate: ({ theme: t }) => ({
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        full: "100%",
        ...t("spacing"),
      }),
      size: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      width: ({ theme: t }) => ({
        auto: "auto",
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        full: "100%",
        screen: "100vw",
        svw: "100svw",
        lvw: "100lvw",
        dvw: "100dvw",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        ...t("spacing"),
      }),
      willChange: {
        auto: "auto",
        scroll: "scroll-position",
        contents: "contents",
        transform: "transform",
      },
      zIndex: {
        auto: "auto",
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        ...Z,
      },
    };
  function jr(t) {
    return {
      theme: {
        ...Fr,
        colors: ({ theme: r }) => r("color", {}),
        extend: {
          fontSize: ({ theme: r }) => ({ ...r("text", {}) }),
          boxShadow: ({ theme: r }) => ({ ...r("shadow", {}) }),
          animation: ({ theme: r }) => ({ ...r("animate", {}) }),
          aspectRatio: ({ theme: r }) => ({ ...r("aspect", {}) }),
          borderRadius: ({ theme: r }) => ({ ...r("radius", {}) }),
          screens: ({ theme: r }) => ({ ...r("breakpoint", {}) }),
          letterSpacing: ({ theme: r }) => ({ ...r("tracking", {}) }),
          lineHeight: ({ theme: r }) => ({ ...r("leading", {}) }),
          transitionDuration: {
            DEFAULT: t.get(["--default-transition-duration"]) ?? null,
          },
          transitionTimingFunction: {
            DEFAULT: t.get(["--default-transition-timing-function"]) ?? null,
          },
          maxWidth: ({ theme: r }) => ({ ...r("container", {}) }),
        },
      },
    };
  }
  var Po = {
    blocklist: [],
    future: {},
    prefix: "",
    important: !1,
    darkMode: null,
    theme: {},
    plugins: [],
    content: { files: [] },
  };
  function Ct(t, r) {
    let n = {
      design: t,
      configs: [],
      plugins: [],
      content: { files: [] },
      theme: {},
      extend: {},
      result: structuredClone(Po),
    };
    for (let o of r) At(n, o);
    for (let o of n.configs)
      "darkMode" in o &&
        o.darkMode !== void 0 &&
        (n.result.darkMode = o.darkMode ?? null),
        "prefix" in o &&
          o.prefix !== void 0 &&
          (n.result.prefix = o.prefix ?? ""),
        "blocklist" in o &&
          o.blocklist !== void 0 &&
          (n.result.blocklist = o.blocklist ?? []),
        "important" in o &&
          o.important !== void 0 &&
          (n.result.important = o.important ?? !1);
    let e = _o(n);
    return {
      resolvedConfig: {
        ...n.result,
        content: n.content,
        theme: n.theme,
        plugins: n.plugins,
      },
      replacedThemeKeys: e,
    };
  }
  function Uo(t, r) {
    if (Array.isArray(t) && ve(t[0])) return t.concat(r);
    if (Array.isArray(r) && ve(r[0]) && ve(t)) return [t, ...r];
    if (Array.isArray(r)) return r;
  }
  function At(t, { config: r, base: n, path: e, reference: o }) {
    let s = [];
    for (let f of r.plugins ?? [])
      "__isOptionsFunction" in f
        ? s.push({ ...f(), reference: o })
        : "handler" in f
        ? s.push({ ...f, reference: o })
        : s.push({ handler: f, reference: o });
    if (Array.isArray(r.presets) && r.presets.length === 0)
      throw new Error(
        "Error in the config file/plugin/preset. An empty preset (`preset: []`) is not currently supported."
      );
    for (let f of r.presets ?? [])
      At(t, { path: e, base: n, config: f, reference: o });
    for (let f of s)
      t.plugins.push(f),
        f.config &&
          At(t, {
            path: e,
            base: n,
            config: f.config,
            reference: !!f.reference,
          });
    let l = r.content ?? [],
      p = Array.isArray(l) ? l : l.files;
    for (let f of p)
      t.content.files.push(typeof f == "object" ? f : { base: n, pattern: f });
    t.configs.push(r);
  }
  function _o(t) {
    let r = new Set(),
      n = Ge(t.design, () => t.theme, o),
      e = Object.assign(n, { theme: n, colors: Je });
    function o(s) {
      return typeof s == "function" ? s(e) ?? null : s ?? null;
    }
    for (let s of t.configs) {
      let l = s.theme ?? {},
        p = l.extend ?? {};
      for (let f in l) f !== "extend" && r.add(f);
      Object.assign(t.theme, l);
      for (let f in p) (t.extend[f] ??= []), t.extend[f].push(p[f]);
    }
    delete t.theme.extend;
    for (let s in t.extend) {
      let l = [t.theme[s], ...t.extend[s]];
      t.theme[s] = () => {
        let p = l.map(o);
        return $e({}, p, Uo);
      };
    }
    for (let s in t.theme) t.theme[s] = o(t.theme[s]);
    if (t.theme.screens && typeof t.theme.screens == "object")
      for (let s of Object.keys(t.theme.screens)) {
        let l = t.theme.screens[s];
        l &&
          typeof l == "object" &&
          ("raw" in l ||
            "max" in l ||
            ("min" in l && (t.theme.screens[s] = l.min)));
      }
    return r;
  }
  function Lr(t, r) {
    let n = t.theme.container || {};
    if (typeof n != "object" || n === null) return;
    let e = Do(n, r);
    e.length !== 0 && r.utilities.static("container", () => structuredClone(e));
  }
  function Do({ center: t, padding: r, screens: n }, e) {
    let o = [],
      s = null;
    if (
      (t && o.push(a("margin-inline", "auto")),
      (typeof r == "string" ||
        (typeof r == "object" && r !== null && "DEFAULT" in r)) &&
        o.push(a("padding-inline", typeof r == "string" ? r : r.DEFAULT)),
      typeof n == "object" && n !== null)
    ) {
      s = new Map();
      let l = Array.from(e.theme.namespace("--breakpoint").entries());
      if ((l.sort((p, f) => ue(p[1], f[1], "asc")), l.length > 0)) {
        let [p] = l[0];
        o.push(
          K("@media", `(width >= --theme(--breakpoint-${p}))`, [
            a("max-width", "none"),
          ])
        );
      }
      for (let [p, f] of Object.entries(n)) {
        if (typeof f == "object")
          if ("min" in f) f = f.min;
          else continue;
        s.set(p, K("@media", `(width >= ${f})`, [a("max-width", f)]));
      }
    }
    if (typeof r == "object" && r !== null) {
      let l = Object.entries(r)
        .filter(([p]) => p !== "DEFAULT")
        .map(([p, f]) => [p, e.theme.resolveValue(p, ["--breakpoint"]), f])
        .filter(Boolean);
      l.sort((p, f) => ue(p[1], f[1], "asc"));
      for (let [p, , f] of l)
        if (s && s.has(p)) s.get(p).nodes.push(a("padding-inline", f));
        else {
          if (s) continue;
          o.push(
            K("@media", `(width >= theme(--breakpoint-${p}))`, [
              a("padding-inline", f),
            ])
          );
        }
    }
    if (s) for (let [, l] of s) o.push(l);
    return o;
  }
  function Mr({ addVariant: t, config: r }) {
    let n = r("darkMode", null),
      [e, o = ".dark"] = Array.isArray(n) ? n : [n];
    if (e === "variant") {
      let s;
      if (
        (Array.isArray(o) || typeof o == "function"
          ? (s = o)
          : typeof o == "string" && (s = [o]),
        Array.isArray(s))
      )
        for (let l of s)
          l === ".dark"
            ? ((e = !1),
              console.warn(
                'When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`'
              ))
            : l.includes("&") ||
              ((e = !1),
              console.warn(
                'When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`'
              ));
      o = s;
    }
    e === null ||
      (e === "selector"
        ? t("dark", `&:where(${o}, ${o} *)`)
        : e === "media"
        ? t("dark", "@media (prefers-color-scheme: dark)")
        : e === "variant"
        ? t("dark", o)
        : e === "class" && t("dark", `&:is(${o} *)`));
  }
  function Wr(t) {
    for (let [r, n] of [
      ["t", "top"],
      ["tr", "top right"],
      ["r", "right"],
      ["br", "bottom right"],
      ["b", "bottom"],
      ["bl", "bottom left"],
      ["l", "left"],
      ["tl", "top left"],
    ])
      t.utilities.static(`bg-gradient-to-${r}`, () => [
        a("--tw-gradient-position", `to ${n} in oklab`),
        a("background-image", "linear-gradient(var(--tw-gradient-stops))"),
      ]);
    t.utilities.functional("max-w-screen", (r) => {
      if (!r.value || r.value.kind === "arbitrary") return;
      let n = t.theme.resolve(r.value.value, ["--breakpoint"]);
      if (n) return [a("max-width", n)];
    }),
      t.utilities.static("overflow-ellipsis", () => [
        a("text-overflow", "ellipsis"),
      ]),
      t.utilities.static("decoration-slice", () => [
        a("-webkit-box-decoration-break", "slice"),
        a("box-decoration-break", "slice"),
      ]),
      t.utilities.static("decoration-clone", () => [
        a("-webkit-box-decoration-break", "clone"),
        a("box-decoration-break", "clone"),
      ]),
      t.utilities.functional("flex-shrink", (r) => {
        if (!r.modifier) {
          if (!r.value) return [a("flex-shrink", "1")];
          if (r.value.kind === "arbitrary")
            return [a("flex-shrink", r.value.value)];
          if (V(r.value.value)) return [a("flex-shrink", r.value.value)];
        }
      }),
      t.utilities.functional("flex-grow", (r) => {
        if (!r.modifier) {
          if (!r.value) return [a("flex-grow", "1")];
          if (r.value.kind === "arbitrary")
            return [a("flex-grow", r.value.value)];
          if (V(r.value.value)) return [a("flex-grow", r.value.value)];
        }
      });
  }
  function Br(t, r) {
    let n = t.theme.screens || {},
      e = r.variants.get("min")?.order ?? 0,
      o = [];
    for (let [l, p] of Object.entries(n)) {
      let g = function (y) {
        r.variants.static(
          l,
          (b) => {
            b.nodes = [K("@media", m, b.nodes)];
          },
          { order: y }
        );
      };
      var s = g;
      let f = r.variants.get(l),
        d = r.theme.resolveValue(l, ["--breakpoint"]);
      if (f && d && !r.theme.hasDefault(`--breakpoint-${l}`)) continue;
      let c = !0;
      typeof p == "string" && (c = !1);
      let m = zo(p);
      c ? o.push(g) : g(e);
    }
    if (o.length !== 0) {
      for (let [, l] of r.variants.variants)
        l.order > e && (l.order += o.length);
      r.variants.compareFns = new Map(
        Array.from(r.variants.compareFns).map(
          ([l, p]) => (l > e && (l += o.length), [l, p])
        )
      );
      for (let [l, p] of o.entries()) p(e + l + 1);
    }
  }
  function zo(t) {
    return (Array.isArray(t) ? t : [t])
      .map((n) =>
        typeof n == "string" ? { min: n } : n && typeof n == "object" ? n : null
      )
      .map((n) => {
        if (n === null) return null;
        if ("raw" in n) return n.raw;
        let e = "";
        return (
          n.max !== void 0 && (e += `${n.max} >= `),
          (e += "width"),
          n.min !== void 0 && (e += ` >= ${n.min}`),
          `(${e})`
        );
      })
      .filter(Boolean)
      .join(", ");
  }
  function qr(t, r) {
    let n = t.theme.aria || {},
      e = t.theme.supports || {},
      o = t.theme.data || {};
    if (Object.keys(n).length > 0) {
      let s = r.variants.get("aria"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "aria",
        (f, d) => {
          let c = d.value;
          return c && c.kind === "named" && c.value in n
            ? l?.(f, { ...d, value: { kind: "arbitrary", value: n[c.value] } })
            : l?.(f, d);
        },
        { compounds: p }
      );
    }
    if (Object.keys(e).length > 0) {
      let s = r.variants.get("supports"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "supports",
        (f, d) => {
          let c = d.value;
          return c && c.kind === "named" && c.value in e
            ? l?.(f, { ...d, value: { kind: "arbitrary", value: e[c.value] } })
            : l?.(f, d);
        },
        { compounds: p }
      );
    }
    if (Object.keys(o).length > 0) {
      let s = r.variants.get("data"),
        l = s?.applyFn,
        p = s?.compounds;
      r.variants.functional(
        "data",
        (f, d) => {
          let c = d.value;
          return c && c.kind === "named" && c.value in o
            ? l?.(f, { ...d, value: { kind: "arbitrary", value: o[c.value] } })
            : l?.(f, d);
        },
        { compounds: p }
      );
    }
  }
  var Io = /^[a-z]+$/;
  async function Gr({
    designSystem: t,
    base: r,
    ast: n,
    loadModule: e,
    globs: o,
  }) {
    let s = 0,
      l = [],
      p = [];
    P(n, (m, { parent: g, replaceWith: y, context: b }) => {
      if (m.kind === "at-rule") {
        if (m.name === "@plugin") {
          if (g !== null) throw new Error("`@plugin` cannot be nested.");
          let k = m.params.slice(1, -1);
          if (k.length === 0) throw new Error("`@plugin` must have a path.");
          let A = {};
          for (let w of m.nodes ?? []) {
            if (w.kind !== "declaration")
              throw new Error(`Unexpected \`@plugin\` option:
    
    ${Y([w])}
    
    \`@plugin\` options must be a flat list of declarations.`);
            if (w.value === void 0) continue;
            let T = w.value,
              z = O(T, ",").map((R) => {
                if (((R = R.trim()), R === "null")) return null;
                if (R === "true") return !0;
                if (R === "false") return !1;
                if (Number.isNaN(Number(R))) {
                  if (
                    (R[0] === '"' && R[R.length - 1] === '"') ||
                    (R[0] === "'" && R[R.length - 1] === "'")
                  )
                    return R.slice(1, -1);
                  if (R[0] === "{" && R[R.length - 1] === "}")
                    throw new Error(`Unexpected \`@plugin\` option: Value of declaration \`${Y(
                      [w]
                    ).trim()}\` is not supported.
    
    Using an object as a plugin option is currently only supported in JavaScript configuration files.`);
                } else return Number(R);
                return R;
              });
            A[w.property] = z.length === 1 ? z[0] : z;
          }
          l.push([
            { id: k, base: b.base, reference: !!b.reference },
            Object.keys(A).length > 0 ? A : null,
          ]),
            y([]),
            (s |= 4);
          return;
        }
        if (m.name === "@config") {
          if (m.nodes.length > 0)
            throw new Error("`@config` cannot have a body.");
          if (g !== null) throw new Error("`@config` cannot be nested.");
          p.push({
            id: m.params.slice(1, -1),
            base: b.base,
            reference: !!b.reference,
          }),
            y([]),
            (s |= 4);
          return;
        }
      }
    }),
      Wr(t);
    let f = t.resolveThemeValue;
    if (
      ((t.resolveThemeValue = function (g) {
        return g.startsWith("--")
          ? f(g)
          : ((s |= Hr({
              designSystem: t,
              base: r,
              ast: n,
              globs: o,
              configs: [],
              pluginDetails: [],
            })),
            t.resolveThemeValue(g));
      }),
      !l.length && !p.length)
    )
      return 0;
    let [d, c] = await Promise.all([
      Promise.all(
        p.map(async ({ id: m, base: g, reference: y }) => {
          let b = await e(m, g, "config");
          return { path: m, base: b.base, config: b.module, reference: y };
        })
      ),
      Promise.all(
        l.map(async ([{ id: m, base: g, reference: y }, b]) => {
          let k = await e(m, g, "plugin");
          return {
            path: m,
            base: k.base,
            plugin: k.module,
            options: b,
            reference: y,
          };
        })
      ),
    ]);
    return (
      (s |= Hr({
        designSystem: t,
        base: r,
        ast: n,
        globs: o,
        configs: d,
        pluginDetails: c,
      })),
      s
    );
  }
  function Hr({
    designSystem: t,
    base: r,
    ast: n,
    globs: e,
    configs: o,
    pluginDetails: s,
  }) {
    let l = 0,
      f = [
        ...s.map((k) => {
          if (!k.options)
            return {
              config: { plugins: [k.plugin] },
              base: k.base,
              reference: k.reference,
            };
          if ("__isOptionsFunction" in k.plugin)
            return {
              config: { plugins: [k.plugin(k.options)] },
              base: k.base,
              reference: k.reference,
            };
          throw new Error(`The plugin "${k.path}" does not accept options`);
        }),
        ...o,
      ],
      { resolvedConfig: d } = Ct(t, [
        { config: jr(t.theme), base: r, reference: !0 },
        ...f,
        { config: { plugins: [Mr] }, base: r, reference: !0 },
      ]),
      { resolvedConfig: c, replacedThemeKeys: m } = Ct(t, f);
    t.resolveThemeValue = function (A, w) {
      let T = y.theme(A, w);
      if (Array.isArray(T) && T.length === 2) return T[0];
      if (Array.isArray(T)) return T.join(", ");
      if (typeof T == "string") return T;
    };
    let g = {
        designSystem: t,
        ast: n,
        resolvedConfig: d,
        featuresRef: {
          set current(k) {
            l |= k;
          },
        },
      },
      y = xt({ ...g, referenceMode: !1 }),
      b;
    for (let { handler: k, reference: A } of d.plugins)
      A ? ((b ||= xt({ ...g, referenceMode: !0 })), k(b)) : k(y);
    if (
      (vr(t, c, m),
      Dr(t, c, m),
      qr(c, t),
      Br(c, t),
      Lr(c, t),
      !t.theme.prefix && d.prefix)
    ) {
      if (
        (d.prefix.endsWith("-") &&
          ((d.prefix = d.prefix.slice(0, -1)),
          console.warn(
            `The prefix "${d.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only and is written as a variant before all utilities. We have fixed up the prefix for you. Remove the trailing \`-\` to silence this warning.`
          )),
        !Io.test(d.prefix))
      )
        throw new Error(
          `The prefix "${d.prefix}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`
        );
      t.theme.prefix = d.prefix;
    }
    if (
      (!t.important && d.important === !0 && (t.important = !0),
      typeof d.important == "string")
    ) {
      let k = d.important;
      P(n, (A, { replaceWith: w, parent: T }) => {
        if (
          A.kind === "at-rule" &&
          !(A.name !== "@tailwind" || A.params !== "utilities")
        )
          return T?.kind === "rule" && T.selector === k ? 2 : (w(_(k, [A])), 2);
      });
    }
    for (let k of d.blocklist) t.invalidCandidates.add(k);
    for (let k of d.content.files) {
      if ("raw" in k)
        throw new Error(`Error in the config file/plugin/preset. The \`content\` key contains a \`raw\` entry:
    
    ${JSON.stringify(k, null, 2)}
    
    This feature is not currently supported.`);
      e.push(k);
    }
    return l;
  }
  var Yr = /^(-?\d+)\.\.(-?\d+)(?:\.\.(-?\d+))?$/;
  function Qe(t) {
    let r = t.indexOf("{");
    if (r === -1) return [t];
    let n = [],
      e = t.slice(0, r),
      o = t.slice(r),
      s = 0,
      l = o.lastIndexOf("}");
    for (let m = 0; m < o.length; m++) {
      let g = o[m];
      if (g === "{") s++;
      else if (g === "}" && (s--, s === 0)) {
        l = m;
        break;
      }
    }
    if (l === -1) throw new Error(`The pattern \`${t}\` is not balanced.`);
    let p = o.slice(1, l),
      f = o.slice(l + 1),
      d;
    Fo(p) ? (d = jo(p)) : (d = O(p, ",")), (d = d.flatMap((m) => Qe(m)));
    let c = Qe(f);
    for (let m of c) for (let g of d) n.push(e + g + m);
    return n;
  }
  function Fo(t) {
    return Yr.test(t);
  }
  function jo(t) {
    let r = t.match(Yr);
    if (!r) return [t];
    let [, n, e, o] = r,
      s = o ? parseInt(o, 10) : void 0,
      l = [];
    if (/^-?\d+$/.test(n) && /^-?\d+$/.test(e)) {
      let p = parseInt(n, 10),
        f = parseInt(e, 10),
        d = Math.max(n.replace(/^-/, "").length, e.replace(/^-/, "").length);
      if ((s === void 0 && (s = p <= f ? 1 : -1), s === 0))
        throw new Error("Step cannot be zero in sequence expansion.");
      if (s > 0)
        for (let c = p; c <= f; c += s) {
          let m = c.toString();
          m.length < d && (m = m.padStart(d, "0")), l.push(m);
        }
      else
        for (let c = p; c >= f; c += s) {
          let m = c.toString();
          m.length < d && (m = m.padStart(d, "0")), l.push(m);
        }
    }
    return l;
  }
  var Lo = /^[a-z]+$/;
  function Mo() {
    throw new Error("No `loadModule` function provided to `compile`");
  }
  function Wo() {
    throw new Error("No `loadStylesheet` function provided to `compile`");
  }
  function Bo(t) {
    let r = 0,
      n = null;
    for (let e of O(t, " "))
      e === "reference"
        ? (r |= 2)
        : e === "inline"
        ? (r |= 1)
        : e === "default"
        ? (r |= 4)
        : e === "static"
        ? (r |= 8)
        : e.startsWith("prefix(") && e.endsWith(")") && (n = e.slice(7, -1));
    return [r, n];
  }
  async function qo(
    t,
    { base: r = "", loadModule: n = Mo, loadStylesheet: e = Wo } = {}
  ) {
    let o = 0;
    (t = [Q({ base: r }, t)]), (o |= await wt(t, r, e));
    let s = null,
      l = new ze(),
      p = [],
      f = [],
      d = null,
      c = null,
      m = [],
      g = [],
      y = [],
      b = [],
      k = null;
    P(t, (w, { parent: T, replaceWith: z, context: R }) => {
      if (w.kind === "at-rule") {
        if (
          w.name === "@tailwind" &&
          (w.params === "utilities" || w.params.startsWith("utilities"))
        ) {
          if (c !== null) {
            z([]);
            return;
          }
          let D = O(w.params, " ");
          for (let i of D)
            if (i.startsWith("source(")) {
              let u = i.slice(7, -1);
              if (u === "none") {
                k = u;
                continue;
              }
              if (
                (u[0] === '"' && u[u.length - 1] !== '"') ||
                (u[0] === "'" && u[u.length - 1] !== "'") ||
                (u[0] !== "'" && u[0] !== '"')
              )
                throw new Error("`source(\u2026)` paths must be quoted.");
              k = { base: R.sourceBase ?? R.base, pattern: u.slice(1, -1) };
            }
          (c = w), (o |= 16);
        }
        if (w.name === "@utility") {
          if (T !== null) throw new Error("`@utility` cannot be nested.");
          if (w.nodes.length === 0)
            throw new Error(
              `\`@utility ${w.params}\` is empty. Utilities should include at least one property.`
            );
          let D = ir(w);
          if (D === null)
            throw new Error(
              `\`@utility ${w.params}\` defines an invalid utility name. Utilities should be alphanumeric and start with a lowercase letter.`
            );
          f.push(D);
        }
        if (w.name === "@source") {
          if (w.nodes.length > 0)
            throw new Error("`@source` cannot have a body.");
          if (T !== null) throw new Error("`@source` cannot be nested.");
          let D = !1,
            i = !1,
            u = w.params;
          if (
            (!1,
            (u[0] === '"' && u[u.length - 1] !== '"') ||
              (u[0] === "'" && u[u.length - 1] !== "'") ||
              (u[0] !== "'" && u[0] !== '"'))
          )
            throw new Error("`@source` paths must be quoted.");
          let h = u.slice(1, -1);
          if (!1) {
            let x = D ? b : y,
              v = O(h, " ");
            for (let N of v) for (let E of Qe(N)) x.push(E);
          } else g.push({ base: R.base, pattern: h });
          z([]);
          return;
        }
        if (
          (w.name === "@variant" &&
            (T === null
              ? w.nodes.length === 0
                ? (w.name = "@custom-variant")
                : (P(w.nodes, (D) => {
                    if (D.kind === "at-rule" && D.name === "@slot")
                      return (w.name = "@custom-variant"), 2;
                  }),
                  w.name === "@variant" && m.push(w))
              : m.push(w)),
          w.name === "@custom-variant")
        ) {
          if (T !== null)
            throw new Error("`@custom-variant` cannot be nested.");
          z([]);
          let [D, i] = O(w.params, " ");
          if (!Be.test(D))
            throw new Error(
              `\`@custom-variant ${D}\` defines an invalid variant name. Variants should only contain alphanumeric, dashes or underscore characters.`
            );
          if (w.nodes.length > 0 && i)
            throw new Error(
              `\`@custom-variant ${D}\` cannot have both a selector and a body.`
            );
          if (w.nodes.length === 0) {
            if (!i)
              throw new Error(
                `\`@custom-variant ${D}\` has no selector or body.`
              );
            let u = O(i.slice(1, -1), ",");
            if (u.length === 0 || u.some((v) => v.trim() === ""))
              throw new Error(
                `\`@custom-variant ${D} (${u.join(",")})\` selector is invalid.`
              );
            let h = [],
              x = [];
            for (let v of u)
              (v = v.trim()), v[0] === "@" ? h.push(v) : x.push(v);
            p.push((v) => {
              v.variants.static(
                D,
                (N) => {
                  let E = [];
                  x.length > 0 && E.push(_(x.join(", "), N.nodes));
                  for (let S of h) E.push(M(S, N.nodes));
                  N.nodes = E;
                },
                { compounds: fe([...x, ...h]) }
              );
            });
            return;
          } else {
            p.push((u) => {
              u.variants.fromAst(D, w.nodes);
            });
            return;
          }
        }
        if (w.name === "@media") {
          let D = O(w.params, " "),
            i = [];
          for (let u of D)
            if (u.startsWith("source(")) {
              let h = u.slice(7, -1);
              P(w.nodes, (x, { replaceWith: v }) => {
                if (
                  x.kind === "at-rule" &&
                  x.name === "@tailwind" &&
                  x.params === "utilities"
                )
                  return (
                    (x.params += ` source(${h})`),
                    v([Q({ sourceBase: R.base }, [x])]),
                    2
                  );
              });
            } else if (u.startsWith("theme(")) {
              let h = u.slice(6, -1),
                x = h.includes("reference");
              P(w.nodes, (v) => {
                if (v.kind !== "at-rule") {
                  if (x)
                    throw new Error(
                      'Files imported with `@import "\u2026" theme(reference)` must only contain `@theme` blocks.\nUse `@reference "\u2026";` instead.'
                    );
                  return 0;
                }
                if (v.name === "@theme") return (v.params += " " + h), 1;
              });
            } else if (u.startsWith("prefix(")) {
              let h = u.slice(7, -1);
              P(w.nodes, (x) => {
                if (x.kind === "at-rule" && x.name === "@theme")
                  return (x.params += ` prefix(${h})`), 1;
              });
            } else
              u === "important"
                ? (s = !0)
                : u === "reference"
                ? (w.nodes = [Q({ reference: !0 }, w.nodes)])
                : i.push(u);
          i.length > 0 ? (w.params = i.join(" ")) : D.length > 0 && z(w.nodes);
        }
        if (w.name === "@theme") {
          let [D, i] = Bo(w.params);
          if ((R.reference && (D |= 2), i)) {
            if (!Lo.test(i))
              throw new Error(
                `The prefix "${i}" is invalid. Prefixes must be lowercase ASCII letters (a-z) only.`
              );
            l.prefix = i;
          }
          return (
            P(w.nodes, (u) => {
              if (u.kind === "at-rule" && u.name === "@keyframes")
                return l.addKeyframes(u), 1;
              if (u.kind === "comment") return;
              if (u.kind === "declaration" && u.property.startsWith("--")) {
                l.add(ae(u.property), u.value ?? "", D);
                return;
              }
              let h = Y([K(w.name, w.params, [u])])
                .split(
                  `
    `
                )
                .map(
                  (x, v, N) =>
                    `${v === 0 || v >= N.length - 2 ? " " : ">"} ${x}`
                ).join(`
    `);
              throw new Error(`\`@theme\` blocks must only contain custom properties or \`@keyframes\`.
    
    ${h}`);
            }),
            d ? z([]) : ((d = _(":root, :host", [])), z([d])),
            1
          );
        }
      }
    });
    let A = mr(l);
    if ((s && (A.important = s), b.length > 0))
      for (let w of b) A.invalidCandidates.add(w);
    o |= await Gr({
      designSystem: A,
      base: r,
      ast: t,
      loadModule: n,
      globs: g,
    });
    for (let w of p) w(A);
    for (let w of f) w(A);
    if (d) {
      let w = [];
      for (let [z, R] of A.theme.entries())
        R.options & 2 || w.push(a(re(z), R.value));
      let T = A.theme.getKeyframes();
      for (let z of T) t.push(Q({ theme: !0 }, [U([z])]));
      d.nodes = [Q({ theme: !0 }, w)];
    }
    if (c) {
      let w = c;
      (w.kind = "context"), (w.context = {});
    }
    if (m.length > 0) {
      for (let w of m) {
        let T = _("&", w.nodes),
          z = w.params,
          R = A.parseVariant(z);
        if (R === null)
          throw new Error(`Cannot use \`@variant\` with unknown variant: ${z}`);
        if (be(T, R, A.variants) === null)
          throw new Error(`Cannot use \`@variant\` with variant: ${z}`);
        Object.assign(w, T);
      }
      o |= 32;
    }
    return (
      (o |= he(t, A)),
      (o |= Ne(t, A)),
      P(t, (w, { replaceWith: T }) => {
        if (w.kind === "at-rule") return w.name === "@utility" && T([]), 1;
      }),
      {
        designSystem: A,
        ast: t,
        globs: g,
        root: k,
        utilitiesNode: c,
        features: o,
        inlineCandidates: y,
      }
    );
  }
  async function Ho(t, r = {}) {
    let {
      designSystem: n,
      ast: e,
      globs: o,
      root: s,
      utilitiesNode: l,
      features: p,
      inlineCandidates: f,
    } = await qo(t, r);
    e.unshift(
      De(`! tailwindcss v${Tt} | MIT License | https://tailwindcss.com `)
    );
    function d(b) {
      n.invalidCandidates.add(b);
    }
    let c = new Set(),
      m = null,
      g = 0,
      y = !1;
    for (let b of f) n.invalidCandidates.has(b) || (c.add(b), (y = !0));
    return {
      globs: o,
      root: s,
      features: p,
      build(b) {
        if (p === 0) return t;
        if (!l) return (m ??= se(e, n)), m;
        let k = y;
        y = !1;
        let A = c.size;
        for (let T of b)
          n.invalidCandidates.has(T) ||
            (T[0] === "-" && T[1] === "-"
              ? n.theme.markUsedVariable(T)
              : c.add(T),
            (k ||= c.size !== A));
        if (!k) return (m ??= se(e, n)), m;
        let w = oe(c, n, { onInvalidCandidate: d }).astNodes;
        return g === w.length
          ? ((m ??= se(e, n)), m)
          : ((g = w.length), (l.nodes = w), (m = se(e, n)), m);
      },
    };
  }
  async function Zr(t, r = {}) {
    let n = pe(t),
      e = await Ho(n, r),
      o = n,
      s = t;
    return {
      ...e,
      build(l) {
        let p = e.build(l);
        return p === o || ((s = Y(p)), (o = p)), s;
      },
    };
  }
  var Qr = `@layer theme, base, components, utilities;
    
    @import './theme.css' layer(theme);
    @import './preflight.css' layer(base);
    @import './utilities.css' layer(utilities);
    `;
  var Xr = `/*
      1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
      2. Remove default margins and padding
      3. Reset all borders.
    */
    
    *,
    ::after,
    ::before,
    ::backdrop,
    ::file-selector-button {
      box-sizing: border-box; /* 1 */
      margin: 0; /* 2 */
      padding: 0; /* 2 */
      border: 0 solid; /* 3 */
    }
    
    /*
      1. Use a consistent sensible line-height in all browsers.
      2. Prevent adjustments of font size after orientation changes in iOS.
      3. Use a more readable tab size.
      4. Use the user's configured \`sans\` font-family by default.
      5. Use the user's configured \`sans\` font-feature-settings by default.
      6. Use the user's configured \`sans\` font-variation-settings by default.
      7. Disable tap highlights on iOS.
    */
    
    html,
    :host {
      line-height: 1.5; /* 1 */
      -webkit-text-size-adjust: 100%; /* 2 */
      tab-size: 4; /* 3 */
      font-family: var(
        --default-font-family,
        ui-sans-serif,
        system-ui,
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ); /* 4 */
      font-feature-settings: var(--default-font-feature-settings, normal); /* 5 */
      font-variation-settings: var(--default-font-variation-settings, normal); /* 6 */
      -webkit-tap-highlight-color: transparent; /* 7 */
    }
    
    /*
      Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
    */
    
    body {
      line-height: inherit;
    }
    
    /*
      1. Add the correct height in Firefox.
      2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
      3. Reset the default border style to a 1px solid border.
    */
    
    hr {
      height: 0; /* 1 */
      color: inherit; /* 2 */
      border-top-width: 1px; /* 3 */
    }
    
    /*
      Add the correct text decoration in Chrome, Edge, and Safari.
    */
    
    abbr:where([title]) {
      -webkit-text-decoration: underline dotted;
      text-decoration: underline dotted;
    }
    
    /*
      Remove the default font size and weight for headings.
    */
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: inherit;
      font-weight: inherit;
    }
    
    /*
      Reset links to optimize for opt-in styling instead of opt-out.
    */
    
    a {
      color: inherit;
      -webkit-text-decoration: inherit;
      text-decoration: inherit;
    }
    
    /*
      Add the correct font weight in Edge and Safari.
    */
    
    b,
    strong {
      font-weight: bolder;
    }
    
    /*
      1. Use the user's configured \`mono\` font-family by default.
      2. Use the user's configured \`mono\` font-feature-settings by default.
      3. Use the user's configured \`mono\` font-variation-settings by default.
      4. Correct the odd \`em\` font sizing in all browsers.
    */
    
    code,
    kbd,
    samp,
    pre {
      font-family: var(
        --default-mono-font-family,
        ui-monospace,
        SFMono-Regular,
        Menlo,
        Monaco,
        Consolas,
        'Liberation Mono',
        'Courier New',
        monospace
      ); /* 1 */
      font-feature-settings: var(--default-mono-font-feature-settings, normal); /* 2 */
      font-variation-settings: var(--default-mono-font-variation-settings, normal); /* 3 */
      font-size: 1em; /* 4 */
    }
    
    /*
      Add the correct font size in all browsers.
    */
    
    small {
      font-size: 80%;
    }
    
    /*
      Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
    */
    
    sub,
    sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }
    
    sub {
      bottom: -0.25em;
    }
    
    sup {
      top: -0.5em;
    }
    
    /*
      1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
      2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
      3. Remove gaps between table borders by default.
    */
    
    table {
      text-indent: 0; /* 1 */
      border-color: inherit; /* 2 */
      border-collapse: collapse; /* 3 */
    }
    
    /*
      Use the modern Firefox focus style for all focusable elements.
    */
    
    :-moz-focusring {
      outline: auto;
    }
    
    /*
      Add the correct vertical alignment in Chrome and Firefox.
    */
    
    progress {
      vertical-align: baseline;
    }
    
    /*
      Add the correct display in Chrome and Safari.
    */
    
    summary {
      display: list-item;
    }
    
    /*
      Make lists unstyled by default.
    */
    
    ol,
    ul,
    menu {
      list-style: none;
    }
    
    /*
      1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
      2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
          This can trigger a poorly considered lint error in some tools but is included by design.
    */
    
    img,
    svg,
    video,
    canvas,
    audio,
    iframe,
    embed,
    object {
      display: block; /* 1 */
      vertical-align: middle; /* 2 */
    }
    
    /*
      Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
    */
    
    img,
    video {
      max-width: 100%;
      height: auto;
    }
    
    /*
      1. Inherit font styles in all browsers.
      2. Remove border radius in all browsers.
      3. Remove background color in all browsers.
      4. Ensure consistent opacity for disabled states in all browsers.
    */
    
    button,
    input,
    select,
    optgroup,
    textarea,
    ::file-selector-button {
      font: inherit; /* 1 */
      font-feature-settings: inherit; /* 1 */
      font-variation-settings: inherit; /* 1 */
      letter-spacing: inherit; /* 1 */
      color: inherit; /* 1 */
      border-radius: 0; /* 2 */
      background-color: transparent; /* 3 */
      opacity: 1; /* 4 */
    }
    
    /*
      Restore default font weight.
    */
    
    :where(select:is([multiple], [size])) optgroup {
      font-weight: bolder;
    }
    
    /*
      Restore indentation.
    */
    
    :where(select:is([multiple], [size])) optgroup option {
      padding-inline-start: 20px;
    }
    
    /*
      Restore space after button.
    */
    
    ::file-selector-button {
      margin-inline-end: 4px;
    }
    
    /*
      1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
      2. Set the default placeholder color to a semi-transparent version of the current text color.
    */
    
    ::placeholder {
      opacity: 1; /* 1 */
      color: color-mix(in oklab, currentColor 50%, transparent); /* 2 */
    }
    
    /*
      Prevent resizing textareas horizontally by default.
    */
    
    textarea {
      resize: vertical;
    }
    
    /*
      Remove the inner padding in Chrome and Safari on macOS.
    */
    
    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    
    /*
      1. Ensure date/time inputs have the same height when empty in iOS Safari.
      2. Ensure text alignment can be changed on date/time inputs in iOS Safari.
    */
    
    ::-webkit-date-and-time-value {
      min-height: 1lh; /* 1 */
      text-align: inherit; /* 2 */
    }
    
    /*
      Prevent height from changing on date/time inputs in macOS Safari when the input is set to \`display: block\`.
    */
    
    ::-webkit-datetime-edit {
      display: inline-flex;
    }
    
    /*
      Remove excess padding from pseudo-elements in date/time inputs to ensure consistent height across browsers.
    */
    
    ::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }
    
    ::-webkit-datetime-edit,
    ::-webkit-datetime-edit-year-field,
    ::-webkit-datetime-edit-month-field,
    ::-webkit-datetime-edit-day-field,
    ::-webkit-datetime-edit-hour-field,
    ::-webkit-datetime-edit-minute-field,
    ::-webkit-datetime-edit-second-field,
    ::-webkit-datetime-edit-millisecond-field,
    ::-webkit-datetime-edit-meridiem-field {
      padding-block: 0;
    }
    
    /*
      Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
    */
    
    :-moz-ui-invalid {
      box-shadow: none;
    }
    
    /*
      Correct the inability to style the border radius in iOS Safari.
    */
    
    button,
    input:where([type='button'], [type='reset'], [type='submit']),
    ::file-selector-button {
      appearance: button;
    }
    
    /*
      Correct the cursor style of increment and decrement buttons in Safari.
    */
    
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      height: auto;
    }
    
    /*
      Make elements with the HTML hidden attribute stay hidden by default.
    */
    
    [hidden]:where(:not([hidden='until-found'])) {
      display: none !important;
    }
    `;
  var en = `@theme default {
      --font-sans:
        ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';
      --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
      --font-mono:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
        monospace;
    
      --color-red-50: oklch(0.971 0.013 17.38);
      --color-red-100: oklch(0.936 0.032 17.717);
      --color-red-200: oklch(0.885 0.062 18.334);
      --color-red-300: oklch(0.808 0.114 19.571);
      --color-red-400: oklch(0.704 0.191 22.216);
      --color-red-500: oklch(0.637 0.237 25.331);
      --color-red-600: oklch(0.577 0.245 27.325);
      --color-red-700: oklch(0.505 0.213 27.518);
      --color-red-800: oklch(0.444 0.177 26.899);
      --color-red-900: oklch(0.396 0.141 25.723);
      --color-red-950: oklch(0.258 0.092 26.042);
    
      --color-orange-50: oklch(0.98 0.016 73.684);
      --color-orange-100: oklch(0.954 0.038 75.164);
      --color-orange-200: oklch(0.901 0.076 70.697);
      --color-orange-300: oklch(0.837 0.128 66.29);
      --color-orange-400: oklch(0.75 0.183 55.934);
      --color-orange-500: oklch(0.705 0.213 47.604);
      --color-orange-600: oklch(0.646 0.222 41.116);
      --color-orange-700: oklch(0.553 0.195 38.402);
      --color-orange-800: oklch(0.47 0.157 37.304);
      --color-orange-900: oklch(0.408 0.123 38.172);
      --color-orange-950: oklch(0.266 0.079 36.259);
    
      --color-amber-50: oklch(0.987 0.022 95.277);
      --color-amber-100: oklch(0.962 0.059 95.617);
      --color-amber-200: oklch(0.924 0.12 95.746);
      --color-amber-300: oklch(0.879 0.169 91.605);
      --color-amber-400: oklch(0.828 0.189 84.429);
      --color-amber-500: oklch(0.769 0.188 70.08);
      --color-amber-600: oklch(0.666 0.179 58.318);
      --color-amber-700: oklch(0.555 0.163 48.998);
      --color-amber-800: oklch(0.473 0.137 46.201);
      --color-amber-900: oklch(0.414 0.112 45.904);
      --color-amber-950: oklch(0.279 0.077 45.635);
    
      --color-yellow-50: oklch(0.987 0.026 102.212);
      --color-yellow-100: oklch(0.973 0.071 103.193);
      --color-yellow-200: oklch(0.945 0.129 101.54);
      --color-yellow-300: oklch(0.905 0.182 98.111);
      --color-yellow-400: oklch(0.852 0.199 91.936);
      --color-yellow-500: oklch(0.795 0.184 86.047);
      --color-yellow-600: oklch(0.681 0.162 75.834);
      --color-yellow-700: oklch(0.554 0.135 66.442);
      --color-yellow-800: oklch(0.476 0.114 61.907);
      --color-yellow-900: oklch(0.421 0.095 57.708);
      --color-yellow-950: oklch(0.286 0.066 53.813);
    
      --color-lime-50: oklch(0.986 0.031 120.757);
      --color-lime-100: oklch(0.967 0.067 122.328);
      --color-lime-200: oklch(0.938 0.127 124.321);
      --color-lime-300: oklch(0.897 0.196 126.665);
      --color-lime-400: oklch(0.841 0.238 128.85);
      --color-lime-500: oklch(0.768 0.233 130.85);
      --color-lime-600: oklch(0.648 0.2 131.684);
      --color-lime-700: oklch(0.532 0.157 131.589);
      --color-lime-800: oklch(0.453 0.124 130.933);
      --color-lime-900: oklch(0.405 0.101 131.063);
      --color-lime-950: oklch(0.274 0.072 132.109);
    
      --color-green-50: oklch(0.982 0.018 155.826);
      --color-green-100: oklch(0.962 0.044 156.743);
      --color-green-200: oklch(0.925 0.084 155.995);
      --color-green-300: oklch(0.871 0.15 154.449);
      --color-green-400: oklch(0.792 0.209 151.711);
      --color-green-500: oklch(0.723 0.219 149.579);
      --color-green-600: oklch(0.627 0.194 149.214);
      --color-green-700: oklch(0.527 0.154 150.069);
      --color-green-800: oklch(0.448 0.119 151.328);
      --color-green-900: oklch(0.393 0.095 152.535);
      --color-green-950: oklch(0.266 0.065 152.934);
    
      --color-emerald-50: oklch(0.979 0.021 166.113);
      --color-emerald-100: oklch(0.95 0.052 163.051);
      --color-emerald-200: oklch(0.905 0.093 164.15);
      --color-emerald-300: oklch(0.845 0.143 164.978);
      --color-emerald-400: oklch(0.765 0.177 163.223);
      --color-emerald-500: oklch(0.696 0.17 162.48);
      --color-emerald-600: oklch(0.596 0.145 163.225);
      --color-emerald-700: oklch(0.508 0.118 165.612);
      --color-emerald-800: oklch(0.432 0.095 166.913);
      --color-emerald-900: oklch(0.378 0.077 168.94);
      --color-emerald-950: oklch(0.262 0.051 172.552);
    
      --color-teal-50: oklch(0.984 0.014 180.72);
      --color-teal-100: oklch(0.953 0.051 180.801);
      --color-teal-200: oklch(0.91 0.096 180.426);
      --color-teal-300: oklch(0.855 0.138 181.071);
      --color-teal-400: oklch(0.777 0.152 181.912);
      --color-teal-500: oklch(0.704 0.14 182.503);
      --color-teal-600: oklch(0.6 0.118 184.704);
      --color-teal-700: oklch(0.511 0.096 186.391);
      --color-teal-800: oklch(0.437 0.078 188.216);
      --color-teal-900: oklch(0.386 0.063 188.416);
      --color-teal-950: oklch(0.277 0.046 192.524);
    
      --color-cyan-50: oklch(0.984 0.019 200.873);
      --color-cyan-100: oklch(0.956 0.045 203.388);
      --color-cyan-200: oklch(0.917 0.08 205.041);
      --color-cyan-300: oklch(0.865 0.127 207.078);
      --color-cyan-400: oklch(0.789 0.154 211.53);
      --color-cyan-500: oklch(0.715 0.143 215.221);
      --color-cyan-600: oklch(0.609 0.126 221.723);
      --color-cyan-700: oklch(0.52 0.105 223.128);
      --color-cyan-800: oklch(0.45 0.085 224.283);
      --color-cyan-900: oklch(0.398 0.07 227.392);
      --color-cyan-950: oklch(0.302 0.056 229.695);
    
      --color-sky-50: oklch(0.977 0.013 236.62);
      --color-sky-100: oklch(0.951 0.026 236.824);
      --color-sky-200: oklch(0.901 0.058 230.902);
      --color-sky-300: oklch(0.828 0.111 230.318);
      --color-sky-400: oklch(0.746 0.16 232.661);
      --color-sky-500: oklch(0.685 0.169 237.323);
      --color-sky-600: oklch(0.588 0.158 241.966);
      --color-sky-700: oklch(0.5 0.134 242.749);
      --color-sky-800: oklch(0.443 0.11 240.79);
      --color-sky-900: oklch(0.391 0.09 240.876);
      --color-sky-950: oklch(0.293 0.066 243.157);
    
      --color-blue-50: oklch(0.97 0.014 254.604);
      --color-blue-100: oklch(0.932 0.032 255.585);
      --color-blue-200: oklch(0.882 0.059 254.128);
      --color-blue-300: oklch(0.809 0.105 251.813);
      --color-blue-400: oklch(0.707 0.165 254.624);
      --color-blue-500: oklch(0.623 0.214 259.815);
      --color-blue-600: oklch(0.546 0.245 262.881);
      --color-blue-700: oklch(0.488 0.243 264.376);
      --color-blue-800: oklch(0.424 0.199 265.638);
      --color-blue-900: oklch(0.379 0.146 265.522);
      --color-blue-950: oklch(0.282 0.091 267.935);
    
      --color-indigo-50: oklch(0.962 0.018 272.314);
      --color-indigo-100: oklch(0.93 0.034 272.788);
      --color-indigo-200: oklch(0.87 0.065 274.039);
      --color-indigo-300: oklch(0.785 0.115 274.713);
      --color-indigo-400: oklch(0.673 0.182 276.935);
      --color-indigo-500: oklch(0.585 0.233 277.117);
      --color-indigo-600: oklch(0.511 0.262 276.966);
      --color-indigo-700: oklch(0.457 0.24 277.023);
      --color-indigo-800: oklch(0.398 0.195 277.366);
      --color-indigo-900: oklch(0.359 0.144 278.697);
      --color-indigo-950: oklch(0.257 0.09 281.288);
    
      --color-violet-50: oklch(0.969 0.016 293.756);
      --color-violet-100: oklch(0.943 0.029 294.588);
      --color-violet-200: oklch(0.894 0.057 293.283);
      --color-violet-300: oklch(0.811 0.111 293.571);
      --color-violet-400: oklch(0.702 0.183 293.541);
      --color-violet-500: oklch(0.606 0.25 292.717);
      --color-violet-600: oklch(0.541 0.281 293.009);
      --color-violet-700: oklch(0.491 0.27 292.581);
      --color-violet-800: oklch(0.432 0.232 292.759);
      --color-violet-900: oklch(0.38 0.189 293.745);
      --color-violet-950: oklch(0.283 0.141 291.089);
    
      --color-purple-50: oklch(0.977 0.014 308.299);
      --color-purple-100: oklch(0.946 0.033 307.174);
      --color-purple-200: oklch(0.902 0.063 306.703);
      --color-purple-300: oklch(0.827 0.119 306.383);
      --color-purple-400: oklch(0.714 0.203 305.504);
      --color-purple-500: oklch(0.627 0.265 303.9);
      --color-purple-600: oklch(0.558 0.288 302.321);
      --color-purple-700: oklch(0.496 0.265 301.924);
      --color-purple-800: oklch(0.438 0.218 303.724);
      --color-purple-900: oklch(0.381 0.176 304.987);
      --color-purple-950: oklch(0.291 0.149 302.717);
    
      --color-fuchsia-50: oklch(0.977 0.017 320.058);
      --color-fuchsia-100: oklch(0.952 0.037 318.852);
      --color-fuchsia-200: oklch(0.903 0.076 319.62);
      --color-fuchsia-300: oklch(0.833 0.145 321.434);
      --color-fuchsia-400: oklch(0.74 0.238 322.16);
      --color-fuchsia-500: oklch(0.667 0.295 322.15);
      --color-fuchsia-600: oklch(0.591 0.293 322.896);
      --color-fuchsia-700: oklch(0.518 0.253 323.949);
      --color-fuchsia-800: oklch(0.452 0.211 324.591);
      --color-fuchsia-900: oklch(0.401 0.17 325.612);
      --color-fuchsia-950: oklch(0.293 0.136 325.661);
    
      --color-pink-50: oklch(0.971 0.014 343.198);
      --color-pink-100: oklch(0.948 0.028 342.258);
      --color-pink-200: oklch(0.899 0.061 343.231);
      --color-pink-300: oklch(0.823 0.12 346.018);
      --color-pink-400: oklch(0.718 0.202 349.761);
      --color-pink-500: oklch(0.656 0.241 354.308);
      --color-pink-600: oklch(0.592 0.249 0.584);
      --color-pink-700: oklch(0.525 0.223 3.958);
      --color-pink-800: oklch(0.459 0.187 3.815);
      --color-pink-900: oklch(0.408 0.153 2.432);
      --color-pink-950: oklch(0.284 0.109 3.907);
    
      --color-rose-50: oklch(0.969 0.015 12.422);
      --color-rose-100: oklch(0.941 0.03 12.58);
      --color-rose-200: oklch(0.892 0.058 10.001);
      --color-rose-300: oklch(0.81 0.117 11.638);
      --color-rose-400: oklch(0.712 0.194 13.428);
      --color-rose-500: oklch(0.645 0.246 16.439);
      --color-rose-600: oklch(0.586 0.253 17.585);
      --color-rose-700: oklch(0.514 0.222 16.935);
      --color-rose-800: oklch(0.455 0.188 13.697);
      --color-rose-900: oklch(0.41 0.159 10.272);
      --color-rose-950: oklch(0.271 0.105 12.094);
    
      --color-slate-50: oklch(0.984 0.003 247.858);
      --color-slate-100: oklch(0.968 0.007 247.896);
      --color-slate-200: oklch(0.929 0.013 255.508);
      --color-slate-300: oklch(0.869 0.022 252.894);
      --color-slate-400: oklch(0.704 0.04 256.788);
      --color-slate-500: oklch(0.554 0.046 257.417);
      --color-slate-600: oklch(0.446 0.043 257.281);
      --color-slate-700: oklch(0.372 0.044 257.287);
      --color-slate-800: oklch(0.279 0.041 260.031);
      --color-slate-900: oklch(0.208 0.042 265.755);
      --color-slate-950: oklch(0.129 0.042 264.695);
    
      --color-gray-50: oklch(0.985 0.002 247.839);
      --color-gray-100: oklch(0.967 0.003 264.542);
      --color-gray-200: oklch(0.928 0.006 264.531);
      --color-gray-300: oklch(0.872 0.01 258.338);
      --color-gray-400: oklch(0.707 0.022 261.325);
      --color-gray-500: oklch(0.551 0.027 264.364);
      --color-gray-600: oklch(0.446 0.03 256.802);
      --color-gray-700: oklch(0.373 0.034 259.733);
      --color-gray-800: oklch(0.278 0.033 256.848);
      --color-gray-900: oklch(0.21 0.034 264.665);
      --color-gray-950: oklch(0.13 0.028 261.692);
    
      --color-zinc-50: oklch(0.985 0 0);
      --color-zinc-100: oklch(0.967 0.001 286.375);
      --color-zinc-200: oklch(0.92 0.004 286.32);
      --color-zinc-300: oklch(0.871 0.006 286.286);
      --color-zinc-400: oklch(0.705 0.015 286.067);
      --color-zinc-500: oklch(0.552 0.016 285.938);
      --color-zinc-600: oklch(0.442 0.017 285.786);
      --color-zinc-700: oklch(0.37 0.013 285.805);
      --color-zinc-800: oklch(0.274 0.006 286.033);
      --color-zinc-900: oklch(0.21 0.006 285.885);
      --color-zinc-950: oklch(0.141 0.005 285.823);
    
      --color-neutral-50: oklch(0.985 0 0);
      --color-neutral-100: oklch(0.97 0 0);
      --color-neutral-200: oklch(0.922 0 0);
      --color-neutral-300: oklch(0.87 0 0);
      --color-neutral-400: oklch(0.708 0 0);
      --color-neutral-500: oklch(0.556 0 0);
      --color-neutral-600: oklch(0.439 0 0);
      --color-neutral-700: oklch(0.371 0 0);
      --color-neutral-800: oklch(0.269 0 0);
      --color-neutral-900: oklch(0.205 0 0);
      --color-neutral-950: oklch(0.145 0 0);
    
      --color-stone-50: oklch(0.985 0.001 106.423);
      --color-stone-100: oklch(0.97 0.001 106.424);
      --color-stone-200: oklch(0.923 0.003 48.717);
      --color-stone-300: oklch(0.869 0.005 56.366);
      --color-stone-400: oklch(0.709 0.01 56.259);
      --color-stone-500: oklch(0.553 0.013 58.071);
      --color-stone-600: oklch(0.444 0.011 73.639);
      --color-stone-700: oklch(0.374 0.01 67.558);
      --color-stone-800: oklch(0.268 0.007 34.298);
      --color-stone-900: oklch(0.216 0.006 56.043);
      --color-stone-950: oklch(0.147 0.004 49.25);
    
      --color-black: #000;
      --color-white: #fff;
    
      --spacing: 0.25rem;
    
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;
    
      --container-3xs: 16rem;
      --container-2xs: 18rem;
      --container-xs: 20rem;
      --container-sm: 24rem;
      --container-md: 28rem;
      --container-lg: 32rem;
      --container-xl: 36rem;
      --container-2xl: 42rem;
      --container-3xl: 48rem;
      --container-4xl: 56rem;
      --container-5xl: 64rem;
      --container-6xl: 72rem;
      --container-7xl: 80rem;
    
      --text-xs: 0.75rem;
      --text-xs--line-height: calc(1 / 0.75);
      --text-sm: 0.875rem;
      --text-sm--line-height: calc(1.25 / 0.875);
      --text-base: 1rem;
      --text-base--line-height: calc(1.5 / 1);
      --text-lg: 1.125rem;
      --text-lg--line-height: calc(1.75 / 1.125);
      --text-xl: 1.25rem;
      --text-xl--line-height: calc(1.75 / 1.25);
      --text-2xl: 1.5rem;
      --text-2xl--line-height: calc(2 / 1.5);
      --text-3xl: 1.875rem;
      --text-3xl--line-height: calc(2.25 / 1.875);
      --text-4xl: 2.25rem;
      --text-4xl--line-height: calc(2.5 / 2.25);
      --text-5xl: 3rem;
      --text-5xl--line-height: 1;
      --text-6xl: 3.75rem;
      --text-6xl--line-height: 1;
      --text-7xl: 4.5rem;
      --text-7xl--line-height: 1;
      --text-8xl: 6rem;
      --text-8xl--line-height: 1;
      --text-9xl: 8rem;
      --text-9xl--line-height: 1;
    
      --font-weight-thin: 100;
      --font-weight-extralight: 200;
      --font-weight-light: 300;
      --font-weight-normal: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;
      --font-weight-bold: 700;
      --font-weight-extrabold: 800;
      --font-weight-black: 900;
    
      --tracking-tighter: -0.05em;
      --tracking-tight: -0.025em;
      --tracking-normal: 0em;
      --tracking-wide: 0.025em;
      --tracking-wider: 0.05em;
      --tracking-widest: 0.1em;
    
      --leading-tight: 1.25;
      --leading-snug: 1.375;
      --leading-normal: 1.5;
      --leading-relaxed: 1.625;
      --leading-loose: 2;
    
      --radius-xs: 0.125rem;
      --radius-sm: 0.25rem;
      --radius-md: 0.375rem;
      --radius-lg: 0.5rem;
      --radius-xl: 0.75rem;
      --radius-2xl: 1rem;
      --radius-3xl: 1.5rem;
      --radius-4xl: 2rem;
    
      --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
      --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    
      --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);
      --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);
      --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);
    
      --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
      --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);
      --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);
      --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);
      --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
      --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);
    
      --ease-in: cubic-bezier(0.4, 0, 1, 1);
      --ease-out: cubic-bezier(0, 0, 0.2, 1);
      --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    
      --animate-spin: spin 1s linear infinite;
      --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      --animate-bounce: bounce 1s infinite;
    
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    
      @keyframes ping {
        75%,
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }
    
      @keyframes bounce {
        0%,
        100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
    
        50% {
          transform: none;
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    
      --blur-xs: 4px;
      --blur-sm: 8px;
      --blur-md: 12px;
      --blur-lg: 16px;
      --blur-xl: 24px;
      --blur-2xl: 40px;
      --blur-3xl: 64px;
    
      --perspective-dramatic: 100px;
      --perspective-near: 300px;
      --perspective-normal: 500px;
      --perspective-midrange: 800px;
      --perspective-distant: 1200px;
    
      --aspect-video: 16 / 9;
    
      --default-transition-duration: 150ms;
      --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      --default-font-family: var(--font-sans);
      --default-font-feature-settings: var(--font-sans--font-feature-settings);
      --default-font-variation-settings: var(--font-sans--font-variation-settings);
      --default-mono-font-family: var(--font-mono);
      --default-mono-font-feature-settings: var(--font-mono--font-feature-settings);
      --default-mono-font-variation-settings: var(--font-mono--font-variation-settings);
    }
    
    /* Deprecated */
    @theme default inline reference {
      --blur: 8px;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
      --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
      --radius: 0.25rem;
      --max-width-prose: 65ch;
    }
    `;
  var tn = `@tailwind utilities;
    `;
  var Re = { index: Qr, preflight: Xr, theme: en, utilities: tn };
  var Xe = class {
    start(r) {
      performance.mark(`${r} (start)`);
    }
    end(r, n) {
      performance.mark(`${r} (end)`),
        performance.measure(r, {
          start: `${r} (start)`,
          end: `${r} (end)`,
          detail: n,
        });
    }
    hit(r, n) {
      performance.mark(r, { detail: n });
    }
    error(r) {
      throw (performance.mark("(error)", { detail: { error: `${r}` } }), r);
    }
  };
  console.warn(
    "The browser build of Tailwind CSS should not be used in production. To use Tailwind CSS in production, use the Tailwind CLI, Vite plugin, or PostCSS plugin: https://tailwindcss.com/docs/installation"
  );
  var nn = "text/tailwindcss",
    et,
    Nt = new Set(),
    St = "",
    $t = document.createElement("style"),
    rn = Promise.resolve(),
    ei = 1,
    B = new Xe();
  async function ti() {
    B.start("Create compiler"), B.start("Reading Stylesheets");
    let t = document.querySelectorAll(`style[type="${nn}"]`),
      r = "";
    for (let n of t)
      on(n),
        (r +=
          n.textContent +
          `
    `);
    if (
      (r.includes("@import") || (r = `@import "tailwindcss";${r}`),
      B.end("Reading Stylesheets", { size: r.length, changed: St !== r }),
      St !== r)
    ) {
      (St = r), B.start("Compile CSS");
      try {
        et = await Zr(r, { base: "/", loadStylesheet: ri, loadModule: ni });
      } finally {
        B.end("Compile CSS"), B.end("Create compiler");
      }
      Nt.clear();
    }
  }
  async function ri(t, r) {
    function n() {
      if (t === "tailwindcss") return { base: r, content: Re.index };
      if (
        t === "tailwindcss/preflight" ||
        t === "tailwindcss/preflight.css" ||
        t === "./preflight.css"
      )
        return { base: r, content: Re.preflight };
      if (
        t === "tailwindcss/theme" ||
        t === "tailwindcss/theme.css" ||
        t === "./theme.css"
      )
        return { base: r, content: Re.theme };
      if (
        t === "tailwindcss/utilities" ||
        t === "tailwindcss/utilities.css" ||
        t === "./utilities.css"
      )
        return { base: r, content: Re.utilities };
      throw new Error(`The browser build does not support @import for "${t}"`);
    }
    try {
      let e = n();
      return (
        B.hit("Loaded stylesheet", { id: t, base: r, size: e.content.length }),
        e
      );
    } catch (e) {
      throw (
        (B.hit("Failed to load stylesheet", {
          id: t,
          base: r,
          error: e.message ?? e,
        }),
        e)
      );
    }
  }
  async function ni() {
    throw new Error(
      "The browser build does not support plugins or config files."
    );
  }
  async function oi(t) {
    if (!et) return;
    let r = new Set();
    B.start("Collect classes");
    for (let n of document.querySelectorAll("[class]"))
      for (let e of n.classList) Nt.has(e) || (Nt.add(e), r.add(e));
    B.end("Collect classes", { count: r.size }),
      !(r.size === 0 && t === "incremental") &&
        (B.start("Build utilities"),
        ($t.textContent = et.build(Array.from(r))),
        B.end("Build utilities"));
  }
  function tt(t) {
    async function r() {
      if (!et && t !== "full") return;
      let n = ei++;
      B.start(`Build #${n} (${t})`),
        t === "full" && (await ti()),
        B.start("Build"),
        await oi(t),
        B.end("Build"),
        B.end(`Build #${n} (${t})`);
    }
    rn = rn.then(r).catch((n) => B.error(n));
  }
  var ii = new MutationObserver(() => tt("full"));
  function on(t) {
    ii.observe(t, {
      attributes: !0,
      attributeFilter: ["type"],
      characterData: !0,
      subtree: !0,
      childList: !0,
    });
  }
  new MutationObserver((t) => {
    let r = 0,
      n = 0;
    for (let e of t) {
      for (let o of e.addedNodes)
        o.nodeType === Node.ELEMENT_NODE &&
          o.tagName === "STYLE" &&
          o.getAttribute("type") === nn &&
          (on(o), r++);
      for (let o of e.addedNodes) o.nodeType === 1 && o !== $t && n++;
      e.type === "attributes" && n++;
    }
    if (r > 0) return tt("full");
    if (n > 0) return tt("incremental");
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ["class"],
    childList: !0,
    subtree: !0,
  });
  tt("full");
  document.head.append($t);
})();
