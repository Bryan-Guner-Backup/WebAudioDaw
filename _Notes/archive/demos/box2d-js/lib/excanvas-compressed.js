if (!window.CanvasRenderingContext2D) {
  (function () {
    var I = Math,
      i = I.round,
      L = I.sin,
      M = I.cos,
      m = 10,
      A = m / 2,
      Q = {
        init: function (a) {
          var b = a || document;
          if (/MSIE/.test(navigator.userAgent) && !window.opera) {
            var c = this;
            b.attachEvent("onreadystatechange", function () {
              c.r(b);
            });
          }
        },
        r: function (a) {
          if (a.readyState == "complete") {
            if (!a.namespaces["s"]) {
              a.namespaces.add("g_vml_", "urn:schemas-microsoft-com:vml");
            }
            var b = a.createStyleSheet();
            b.cssText =
              "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}";
            var c = a.getElementsByTagName("canvas");
            for (var d = 0; d < c.length; d++) {
              if (!c[d].getContext) {
                this.initElement(c[d]);
              }
            }
          }
        },
        q: function (a) {
          var b = a.outerHTML,
            c = a.ownerDocument.createElement(b);
          if (b.slice(-2) != "/>") {
            var d = "/" + a.tagName,
              e;
            while ((e = a.nextSibling) && e.tagName != d) {
              e.removeNode();
            }
            if (e) {
              e.removeNode();
            }
          }
          a.parentNode.replaceChild(c, a);
          return c;
        },
        initElement: function (a) {
          a = this.q(a);
          a.getContext = function () {
            if (this.l) {
              return this.l;
            }
            return (this.l = new K(this));
          };
          a.attachEvent("onpropertychange", V);
          a.attachEvent("onresize", W);
          var b = a.attributes;
          if (b.width && b.width.specified) {
            a.style.width = b.width.nodeValue + "px";
          } else {
            a.width = a.clientWidth;
          }
          if (b.height && b.height.specified) {
            a.style.height = b.height.nodeValue + "px";
          } else {
            a.height = a.clientHeight;
          }
          return a;
        },
      };
    function V(a) {
      var b = a.srcElement;
      switch (a.propertyName) {
        case "width":
          b.style.width = b.attributes.width.nodeValue + "px";
          b.getContext().clearRect();
          break;
        case "height":
          b.style.height = b.attributes.height.nodeValue + "px";
          b.getContext().clearRect();
          break;
      }
    }
    function W(a) {
      var b = a.srcElement;
      if (b.firstChild) {
        b.firstChild.style.width = b.clientWidth + "px";
        b.firstChild.style.height = b.clientHeight + "px";
      }
    }
    Q.init();
    var R = [];
    for (var E = 0; E < 16; E++) {
      for (var F = 0; F < 16; F++) {
        R[E * 16 + F] = E.toString(16) + F.toString(16);
      }
    }
    function J() {
      return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
    }
    function G(a, b) {
      var c = J();
      for (var d = 0; d < 3; d++) {
        for (var e = 0; e < 3; e++) {
          var g = 0;
          for (var h = 0; h < 3; h++) {
            g += a[d][h] * b[h][e];
          }
          c[d][e] = g;
        }
      }
      return c;
    }
    function N(a, b) {
      b.fillStyle = a.fillStyle;
      b.lineCap = a.lineCap;
      b.lineJoin = a.lineJoin;
      b.lineWidth = a.lineWidth;
      b.miterLimit = a.miterLimit;
      b.shadowBlur = a.shadowBlur;
      b.shadowColor = a.shadowColor;
      b.shadowOffsetX = a.shadowOffsetX;
      b.shadowOffsetY = a.shadowOffsetY;
      b.strokeStyle = a.strokeStyle;
      b.d = a.d;
      b.e = a.e;
    }
    function O(a) {
      var b,
        c = 1;
      a = String(a);
      if (a.substring(0, 3) == "rgb") {
        var d = a.indexOf("(", 3),
          e = a.indexOf(")", d + 1),
          g = a.substring(d + 1, e).split(",");
        b = "#";
        for (var h = 0; h < 3; h++) {
          b += R[Number(g[h])];
        }
        if (g.length == 4 && a.substr(3, 1) == "a") {
          c = g[3];
        }
      } else {
        b = a;
      }
      return [b, c];
    }
    function S(a) {
      switch (a) {
        case "butt":
          return "flat";
        case "round":
          return "round";
        case "square":
        default:
          return "square";
      }
    }
    function K(a) {
      this.a = J();
      this.m = [];
      this.k = [];
      this.c = [];
      this.strokeStyle = "#000";
      this.fillStyle = "#000";
      this.lineWidth = 1;
      this.lineJoin = "miter";
      this.lineCap = "butt";
      this.miterLimit = m * 1;
      this.globalAlpha = 1;
      this.canvas = a;
      var b = a.ownerDocument.createElement("div");
      b.style.width = a.clientWidth + "px";
      b.style.height = a.clientHeight + "px";
      b.style.overflow = "hidden";
      b.style.position = "absolute";
      a.appendChild(b);
      this.j = b;
      this.d = 1;
      this.e = 1;
    }
    var j = K.prototype;
    j.clearRect = function () {
      this.j.innerHTML = "";
      this.c = [];
    };
    j.beginPath = function () {
      this.c = [];
    };
    j.moveTo = function (a, b) {
      this.c.push({ type: "moveTo", x: a, y: b });
      this.f = a;
      this.g = b;
    };
    j.lineTo = function (a, b) {
      this.c.push({ type: "lineTo", x: a, y: b });
      this.f = a;
      this.g = b;
    };
    j.bezierCurveTo = function (a, b, c, d, e, g) {
      this.c.push({
        type: "bezierCurveTo",
        cp1x: a,
        cp1y: b,
        cp2x: c,
        cp2y: d,
        x: e,
        y: g,
      });
      this.f = e;
      this.g = g;
    };
    j.quadraticCurveTo = function (a, b, c, d) {
      var e = this.f + 0.6666666666666666 * (a - this.f),
        g = this.g + 0.6666666666666666 * (b - this.g),
        h = e + (c - this.f) / 3,
        l = g + (d - this.g) / 3;
      this.bezierCurveTo(e, g, h, l, c, d);
    };
    j.arc = function (a, b, c, d, e, g) {
      c *= m;
      var h = g ? "at" : "wa",
        l = a + M(d) * c - A,
        n = b + L(d) * c - A,
        o = a + M(e) * c - A,
        f = b + L(e) * c - A;
      if (l == o && !g) {
        l += 0.125;
      }
      this.c.push({
        type: h,
        x: a,
        y: b,
        radius: c,
        xStart: l,
        yStart: n,
        xEnd: o,
        yEnd: f,
      });
    };
    j.rect = function (a, b, c, d) {
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + d);
      this.lineTo(a, b + d);
      this.closePath();
    };
    j.strokeRect = function (a, b, c, d) {
      this.beginPath();
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + d);
      this.lineTo(a, b + d);
      this.closePath();
      this.stroke();
    };
    j.fillRect = function (a, b, c, d) {
      this.beginPath();
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + d);
      this.lineTo(a, b + d);
      this.closePath();
      this.fill();
    };
    j.createLinearGradient = function (a, b, c, d) {
      var e = new H("gradient");
      return e;
    };
    j.createRadialGradient = function (a, b, c, d, e, g) {
      var h = new H("gradientradial");
      h.n = c;
      h.o = g;
      h.i.x = a;
      h.i.y = b;
      return h;
    };
    j.drawImage = function (a, b) {
      var c,
        d,
        e,
        g,
        h,
        l,
        n,
        o,
        f = a.runtimeStyle.width,
        k = a.runtimeStyle.height;
      a.runtimeStyle.width = "auto";
      a.runtimeStyle.height = "auto";
      var q = a.width,
        r = a.height;
      a.runtimeStyle.width = f;
      a.runtimeStyle.height = k;
      if (arguments.length == 3) {
        c = arguments[1];
        d = arguments[2];
        h = l = 0;
        n = e = q;
        o = g = r;
      } else if (arguments.length == 5) {
        c = arguments[1];
        d = arguments[2];
        e = arguments[3];
        g = arguments[4];
        h = l = 0;
        n = q;
        o = r;
      } else if (arguments.length == 9) {
        h = arguments[1];
        l = arguments[2];
        n = arguments[3];
        o = arguments[4];
        c = arguments[5];
        d = arguments[6];
        e = arguments[7];
        g = arguments[8];
      } else {
        throw "Invalid number of arguments";
      }
      var s = this.b(c, d),
        t = [],
        v = 10,
        w = 10;
      t.push(
        " <g_vml_:group",
        ' coordsize="',
        m * v,
        ",",
        m * w,
        '"',
        ' coordorigin="0,0"',
        ' style="width:',
        v,
        ";height:",
        w,
        ";position:absolute;"
      );
      if (this.a[0][0] != 1 || this.a[0][1]) {
        var x = [];
        x.push(
          "M11='",
          this.a[0][0],
          "',",
          "M12='",
          this.a[1][0],
          "',",
          "M21='",
          this.a[0][1],
          "',",
          "M22='",
          this.a[1][1],
          "',",
          "Dx='",
          i(s.x / m),
          "',",
          "Dy='",
          i(s.y / m),
          "'"
        );
        var p = s,
          y = this.b(c + e, d),
          z = this.b(c, d + g),
          B = this.b(c + e, d + g);
        p.x = Math.max(p.x, y.x, z.x, B.x);
        p.y = Math.max(p.y, y.y, z.y, B.y);
        t.push(
          "padding:0 ",
          i(p.x / m),
          "px ",
          i(p.y / m),
          "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",
          x.join(""),
          ", sizingmethod='clip');"
        );
      } else {
        t.push("top:", i(s.y / m), "px;left:", i(s.x / m), "px;");
      }
      t.push(
        ' ">',
        '<g_vml_:image src="',
        a.src,
        '"',
        ' style="width:',
        m * e,
        ";",
        " height:",
        m * g,
        ';"',
        ' cropleft="',
        h / q,
        '"',
        ' croptop="',
        l / r,
        '"',
        ' cropright="',
        (q - h - n) / q,
        '"',
        ' cropbottom="',
        (r - l - o) / r,
        '"',
        " />",
        "</g_vml_:group>"
      );
      this.j.insertAdjacentHTML("BeforeEnd", t.join(""));
    };
    j.stroke = function (a) {
      var b = [],
        c = O(a ? this.fillStyle : this.strokeStyle),
        d = c[0],
        e = c[1] * this.globalAlpha,
        g = 10,
        h = 10;
      b.push(
        "<g_vml_:shape",
        ' fillcolor="',
        d,
        '"',
        ' filled="',
        Boolean(a),
        '"',
        ' style="position:absolute;width:',
        g,
        ";height:",
        h,
        ';"',
        ' coordorigin="0 0" coordsize="',
        m * g,
        " ",
        m * h,
        '"',
        ' stroked="',
        !a,
        '"',
        ' strokeweight="',
        this.lineWidth,
        '"',
        ' strokecolor="',
        d,
        '"',
        ' path="'
      );
      var l = { x: null, y: null },
        n = { x: null, y: null };
      for (var o = 0; o < this.c.length; o++) {
        var f = this.c[o];
        if (f.type == "moveTo") {
          b.push(" m ");
          var k = this.b(f.x, f.y);
          b.push(i(k.x), ",", i(k.y));
        } else if (f.type == "lineTo") {
          b.push(" l ");
          var k = this.b(f.x, f.y);
          b.push(i(k.x), ",", i(k.y));
        } else if (f.type == "close") {
          b.push(" x ");
        } else if (f.type == "bezierCurveTo") {
          b.push(" c ");
          var k = this.b(f.x, f.y),
            q = this.b(f.cp1x, f.cp1y),
            r = this.b(f.cp2x, f.cp2y);
          b.push(
            i(q.x),
            ",",
            i(q.y),
            ",",
            i(r.x),
            ",",
            i(r.y),
            ",",
            i(k.x),
            ",",
            i(k.y)
          );
        } else if (f.type == "at" || f.type == "wa") {
          b.push(" ", f.type, " ");
          var k = this.b(f.x, f.y),
            s = this.b(f.xStart, f.yStart),
            t = this.b(f.xEnd, f.yEnd);
          b.push(
            i(k.x - this.d * f.radius),
            ",",
            i(k.y - this.e * f.radius),
            " ",
            i(k.x + this.d * f.radius),
            ",",
            i(k.y + this.e * f.radius),
            " ",
            i(s.x),
            ",",
            i(s.y),
            " ",
            i(t.x),
            ",",
            i(t.y)
          );
        }
        if (k) {
          if (l.x == null || k.x < l.x) {
            l.x = k.x;
          }
          if (n.x == null || k.x > n.x) {
            n.x = k.x;
          }
          if (l.y == null || k.y < l.y) {
            l.y = k.y;
          }
          if (n.y == null || k.y > n.y) {
            n.y = k.y;
          }
        }
      }
      b.push(' ">');
      if (typeof this.fillStyle == "object") {
        var v = { x: "50%", y: "50%" },
          w = n.x - l.x,
          x = n.y - l.y,
          p = w > x ? w : x;
        v.x = i((this.fillStyle.i.x / w) * 100 + 50) + "%";
        v.y = i((this.fillStyle.i.y / x) * 100 + 50) + "%";
        var y = [];
        if (this.fillStyle.p == "gradientradial") {
          var z = (this.fillStyle.n / p) * 100,
            B = (this.fillStyle.o / p) * 100 - z;
        } else {
          var z = 0,
            B = 100;
        }
        var C = { offset: null, color: null },
          D = { offset: null, color: null };
        this.fillStyle.h.sort(function (T, U) {
          return T.offset - U.offset;
        });
        for (var o = 0; o < this.fillStyle.h.length; o++) {
          var u = this.fillStyle.h[o];
          y.push(u.offset * B + z, "% ", u.color, ",");
          if (u.offset > C.offset || C.offset == null) {
            C.offset = u.offset;
            C.color = u.color;
          }
          if (u.offset < D.offset || D.offset == null) {
            D.offset = u.offset;
            D.color = u.color;
          }
        }
        y.pop();
        b.push(
          "<g_vml_:fill",
          ' color="',
          D.color,
          '"',
          ' color2="',
          C.color,
          '"',
          ' type="',
          this.fillStyle.p,
          '"',
          ' focusposition="',
          v.x,
          ", ",
          v.y,
          '"',
          ' colors="',
          y.join(""),
          '"',
          ' opacity="',
          e,
          '" />'
        );
      } else if (a) {
        b.push('<g_vml_:fill color="', d, '" opacity="', e, '" />');
      } else {
        b.push(
          "<g_vml_:stroke",
          ' opacity="',
          e,
          '"',
          ' joinstyle="',
          this.lineJoin,
          '"',
          ' miterlimit="',
          this.miterLimit,
          '"',
          ' endcap="',
          S(this.lineCap),
          '"',
          ' weight="',
          this.lineWidth,
          'px"',
          ' color="',
          d,
          '" />'
        );
      }
      b.push("</g_vml_:shape>");
      this.j.insertAdjacentHTML("beforeEnd", b.join(""));
      this.c = [];
    };
    j.fill = function () {
      this.stroke(true);
    };
    j.closePath = function () {
      this.c.push({ type: "close" });
    };
    j.b = function (a, b) {
      return {
        x: m * (a * this.a[0][0] + b * this.a[1][0] + this.a[2][0]) - A,
        y: m * (a * this.a[0][1] + b * this.a[1][1] + this.a[2][1]) - A,
      };
    };
    j.save = function () {
      var a = {};
      N(this, a);
      this.k.push(a);
      this.m.push(this.a);
      this.a = G(J(), this.a);
    };
    j.restore = function () {
      N(this.k.pop(), this);
      this.a = this.m.pop();
    };
    j.translate = function (a, b) {
      var c = [
        [1, 0, 0],
        [0, 1, 0],
        [a, b, 1],
      ];
      this.a = G(c, this.a);
    };
    j.rotate = function (a) {
      var b = M(a),
        c = L(a),
        d = [
          [b, c, 0],
          [-c, b, 0],
          [0, 0, 1],
        ];
      this.a = G(d, this.a);
    };
    j.scale = function (a, b) {
      this.d *= a;
      this.e *= b;
      var c = [
        [a, 0, 0],
        [0, b, 0],
        [0, 0, 1],
      ];
      this.a = G(c, this.a);
    };
    j.clip = function () {};
    j.arcTo = function () {};
    j.createPattern = function () {
      return new P();
    };
    function H(a) {
      this.p = a;
      this.n = 0;
      this.o = 0;
      this.h = [];
      this.i = { x: 0, y: 0 };
    }
    H.prototype.addColorStop = function (a, b) {
      b = O(b);
      this.h.push({ offset: 1 - a, color: b });
    };
    function P() {}
    G_vmlCanvasManager = Q;
    CanvasRenderingContext2D = K;
    CanvasGradient = H;
    CanvasPattern = P;
  })();
}
