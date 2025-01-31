/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version: 0.2.3
(window.PolymerGestures = {}),
  (function (a) {
    var b = {
      shadow: function (a) {
        return a ? a.shadowRoot || a.webkitShadowRoot : void 0;
      },
      canTarget: function (a) {
        return a && Boolean(a.elementFromPoint);
      },
      targetingShadow: function (a) {
        var b = this.shadow(a);
        return this.canTarget(b) ? b : void 0;
      },
      olderShadow: function (a) {
        var b = a.olderShadowRoot;
        if (!b) {
          var c = a.querySelector("shadow");
          c && (b = c.olderShadowRoot);
        }
        return b;
      },
      allShadows: function (a) {
        for (var b = [], c = this.shadow(a); c; )
          b.push(c), (c = this.olderShadow(c));
        return b;
      },
      searchRoot: function (a, b, c) {
        if (a) {
          var d,
            e,
            f = a.elementFromPoint(b, c);
          for (e = this.targetingShadow(f); e; ) {
            if ((d = e.elementFromPoint(b, c))) {
              var g = this.targetingShadow(d);
              return this.searchRoot(g, b, c) || d;
            }
            e = this.olderShadow(e);
          }
          return f;
        }
      },
      owner: function (a) {
        if (!a) return document;
        for (var b = a; b.parentNode; ) b = b.parentNode;
        return (
          b.nodeType != Node.DOCUMENT_NODE &&
            b.nodeType != Node.DOCUMENT_FRAGMENT_NODE &&
            (b = document),
          b
        );
      },
      findTarget: function (a) {
        var b = a.clientX,
          c = a.clientY,
          d = this.owner(a.target);
        return (
          d.elementFromPoint(b, c) || (d = document), this.searchRoot(d, b, c)
        );
      },
      LCA: function (a, b) {
        if (a === b) return a;
        if (a.contains) {
          if (a.contains(b)) return a;
          if (b.contains(a)) return b;
        }
        var c = this.depth(a),
          d = this.depth(b),
          e = c - d;
        for (
          e > 0 ? (a = this.walk(a, e)) : (b = this.walk(b, -e));
          a && b && a !== b;

        )
          (a = this.walk(a, 1)), (b = this.walk(b, 1));
        return a;
      },
      walk: function (a, b) {
        for (var c = 0; a && b > c; c++) a = a.parentNode || a.host;
        return a;
      },
      depth: function (a) {
        for (var b = 0; a; ) b++, (a = a.parentNode || a.host);
        return b;
      },
      deepContains: function (a, b) {
        var c = this.LCA(a, b);
        return c === a;
      },
      insideNode: function (a, b, c) {
        var d = a.getBoundingClientRect();
        return d.left <= b && b <= d.right && d.top <= c && c <= d.bottom;
      },
    };
    (a.targetFinding = b),
      (a.findTarget = b.findTarget.bind(b)),
      (a.deepContains = b.deepContains.bind(b)),
      (a.insideNode = b.insideNode);
  })(window.PolymerGestures),
  (function () {
    function a(a) {
      return "body /deep/ " + b(a);
    }
    function b(a) {
      return '[touch-action="' + a + '"]';
    }
    function c(a) {
      return "{ -ms-touch-action: " + a + "; touch-action: " + a + ";}";
    }
    var d = [
        "none",
        "auto",
        "pan-x",
        "pan-y",
        { rule: "pan-x pan-y", selectors: ["pan-x pan-y", "pan-y pan-x"] },
      ],
      e = "",
      f = (document.head, "string" == typeof document.head.style.touchAction),
      g = !window.ShadowDOMPolyfill && document.head.createShadowRoot;
    if (f) {
      d.forEach(function (d) {
        String(d) === d
          ? ((e += b(d) + c(d) + "\n"), g && (e += a(d) + c(d) + "\n"))
          : ((e += d.selectors.map(b) + c(d.rule) + "\n"),
            g && (e += d.selectors.map(a) + c(d.rule) + "\n"));
      });
      var h = document.createElement("style");
      (h.textContent = e), document.head.appendChild(h);
    }
  })(),
  (function (a) {
    var b = [
        "bubbles",
        "cancelable",
        "view",
        "detail",
        "screenX",
        "screenY",
        "clientX",
        "clientY",
        "ctrlKey",
        "altKey",
        "shiftKey",
        "metaKey",
        "button",
        "relatedTarget",
        "pageX",
        "pageY",
      ],
      c = [!1, !1, null, null, 0, 0, 0, 0, !1, !1, !1, !1, 0, null, 0, 0],
      d = function () {
        return function () {};
      },
      e = {
        preventTap: d,
        makeBaseEvent: function (a, b) {
          var c = document.createEvent("Event");
          return (
            c.initEvent(a, b.bubbles || !1, b.cancelable || !1),
            (c.preventTap = e.preventTap(c)),
            c
          );
        },
        makeGestureEvent: function (a, b) {
          b = b || Object.create(null);
          for (
            var c, d = this.makeBaseEvent(a, b), e = 0, f = Object.keys(b);
            e < f.length;
            e++
          )
            (c = f[e]), (d[c] = b[c]);
          return d;
        },
        makePointerEvent: function (a, d) {
          d = d || Object.create(null);
          for (var e, f = this.makeBaseEvent(a, d), g = 0; g < b.length; g++)
            (e = b[g]), (f[e] = d[e] || c[g]);
          f.buttons = d.buttons || 0;
          var h = 0;
          return (
            (h = d.pressure ? d.pressure : f.buttons ? 0.5 : 0),
            (f.x = f.clientX),
            (f.y = f.clientY),
            (f.pointerId = d.pointerId || 0),
            (f.width = d.width || 0),
            (f.height = d.height || 0),
            (f.pressure = h),
            (f.tiltX = d.tiltX || 0),
            (f.tiltY = d.tiltY || 0),
            (f.pointerType = d.pointerType || ""),
            (f.hwTimestamp = d.hwTimestamp || 0),
            (f.isPrimary = d.isPrimary || !1),
            f
          );
        },
      };
    a.eventFactory = e;
  })(window.PolymerGestures),
  (function (a) {
    function b() {
      if (c) {
        var a = new Map();
        return (a.pointers = d), a;
      }
      (this.keys = []), (this.values = []);
    }
    var c = window.Map && window.Map.prototype.forEach,
      d = function () {
        return this.size;
      };
    (b.prototype = {
      set: function (a, b) {
        var c = this.keys.indexOf(a);
        c > -1
          ? (this.values[c] = b)
          : (this.keys.push(a), this.values.push(b));
      },
      has: function (a) {
        return this.keys.indexOf(a) > -1;
      },
      delete: function (a) {
        var b = this.keys.indexOf(a);
        b > -1 && (this.keys.splice(b, 1), this.values.splice(b, 1));
      },
      get: function (a) {
        var b = this.keys.indexOf(a);
        return this.values[b];
      },
      clear: function () {
        (this.keys.length = 0), (this.values.length = 0);
      },
      forEach: function (a, b) {
        this.values.forEach(function (c, d) {
          a.call(b, c, this.keys[d], this);
        }, this);
      },
      pointers: function () {
        return this.keys.length;
      },
    }),
      (a.PointerMap = b);
  })(window.PolymerGestures),
  (function (a) {
    var b = [
        "bubbles",
        "cancelable",
        "view",
        "detail",
        "screenX",
        "screenY",
        "clientX",
        "clientY",
        "ctrlKey",
        "altKey",
        "shiftKey",
        "metaKey",
        "button",
        "relatedTarget",
        "buttons",
        "pointerId",
        "width",
        "height",
        "pressure",
        "tiltX",
        "tiltY",
        "pointerType",
        "hwTimestamp",
        "isPrimary",
        "type",
        "target",
        "currentTarget",
        "which",
        "pageX",
        "pageY",
        "timeStamp",
        "preventTap",
        "tapPrevented",
      ],
      c = [
        !1,
        !1,
        null,
        null,
        0,
        0,
        0,
        0,
        !1,
        !1,
        !1,
        !1,
        0,
        null,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "",
        0,
        !1,
        "",
        null,
        null,
        0,
        0,
        0,
        0,
        function () {},
        !1,
      ],
      d = "undefined" != typeof SVGElementInstance,
      e = a.eventFactory,
      f = {
        pointermap: new a.PointerMap(),
        eventMap: Object.create(null),
        eventSources: Object.create(null),
        eventSourceList: [],
        gestures: [],
        gestureQueue: [],
        registerSource: function (a, b) {
          var c = b,
            d = c.events;
          d &&
            (d.forEach(function (a) {
              c[a] && (this.eventMap[a] = c[a].bind(c));
            }, this),
            (this.eventSources[a] = c),
            this.eventSourceList.push(c));
        },
        registerGesture: function (a, b) {
          this.gestures.push(b);
        },
        register: function (a) {
          for (
            var b, c = this.eventSourceList.length, d = 0;
            c > d && (b = this.eventSourceList[d]);
            d++
          )
            b.register.call(b, a);
        },
        unregister: function (a) {
          for (
            var b, c = this.eventSourceList.length, d = 0;
            c > d && (b = this.eventSourceList[d]);
            d++
          )
            b.unregister.call(b, a);
        },
        down: function (a) {
          this.fireEvent("down", a);
        },
        move: function (a) {
          (a.type = "move"), this.fillGestureQueue(a);
        },
        up: function (a) {
          this.fireEvent("up", a);
        },
        eventHandler: function (a) {
          if (!a._handledByPG) {
            var b = a.type,
              c = this.eventMap && this.eventMap[b];
            c && c(a), (a._handledByPG = !0);
          }
        },
        listen: function (a, b) {
          b.forEach(function (b) {
            this.addEvent(a, b);
          }, this);
        },
        unlisten: function (a, b) {
          b.forEach(function (b) {
            this.removeEvent(a, b);
          }, this);
        },
        addEvent: function (a, b) {
          a.addEventListener(b, this.boundHandler);
        },
        removeEvent: function (a, b) {
          a.removeEventListener(b, this.boundHandler);
        },
        makeEvent: function (a, b) {
          var c = e.makePointerEvent(a, b);
          return (
            (c.preventDefault = b.preventDefault),
            (c._target = c._target || b.target),
            c
          );
        },
        fireEvent: function (a, b) {
          var c = this.makeEvent(a, b);
          return this.dispatchEvent(c);
        },
        cloneEvent: function (a) {
          for (var e, f = Object.create(null), g = 0; g < b.length; g++)
            (e = b[g]),
              (f[e] = a[e] || c[g]),
              !d ||
                ("target" !== e && "relatedTarget" !== e) ||
                (f[e] instanceof SVGElementInstance &&
                  (f[e] = f[e].correspondingUseElement));
          return (f.preventDefault = a.preventDefault), f;
        },
        dispatchEvent: function (a) {
          var b = a._target;
          if (b) {
            b.dispatchEvent(a);
            var c = this.cloneEvent(a);
            (c.target = a._target), this.fillGestureQueue(c);
          }
        },
        gestureTrigger: function () {
          for (var a, b = 0; b < this.gestureQueue.length; b++) {
            a = this.gestureQueue[b];
            for (var c, d = 0; d < this.gestures.length; d++)
              (c = this.gestures[d]),
                c.events.indexOf(a.type) >= 0 && c[a.type].call(c, a);
          }
          this.gestureQueue.length = 0;
        },
        fillGestureQueue: function (a) {
          this.gestureQueue.length ||
            requestAnimationFrame(this.boundGestureTrigger),
            this.gestureQueue.push(a);
        },
      };
    (f.boundHandler = f.eventHandler.bind(f)),
      (f.boundGestureTrigger = f.gestureTrigger.bind(f)),
      (a.dispatcher = f),
      (a.register = f.register.bind(f)),
      (a.unregister = f.unregister.bind(f));
  })(window.PolymerGestures),
  (function (a) {
    function b(a, b, c, d) {
      (this.addCallback = a.bind(d)),
        (this.removeCallback = b.bind(d)),
        (this.changedCallback = c.bind(d)),
        g && (this.observer = new g(this.mutationWatcher.bind(this)));
    }
    var c = Array.prototype.forEach.call.bind(Array.prototype.forEach),
      d = Array.prototype.map.call.bind(Array.prototype.map),
      e = Array.prototype.slice.call.bind(Array.prototype.slice),
      f = Array.prototype.filter.call.bind(Array.prototype.filter),
      g = window.MutationObserver || window.WebKitMutationObserver,
      h = "[touch-action]",
      i = {
        subtree: !0,
        childList: !0,
        attributes: !0,
        attributeOldValue: !0,
        attributeFilter: ["touch-action"],
      };
    (b.prototype = {
      watchSubtree: function (b) {
        a.targetFinding.canTarget(b) && this.observer.observe(b, i);
      },
      enableOnSubtree: function (a) {
        this.watchSubtree(a),
          a === document && "complete" !== document.readyState
            ? this.installOnLoad()
            : this.installNewSubtree(a);
      },
      installNewSubtree: function (a) {
        c(this.findElements(a), this.addElement, this);
      },
      findElements: function (a) {
        return a.querySelectorAll ? a.querySelectorAll(h) : [];
      },
      removeElement: function (a) {
        this.removeCallback(a);
      },
      addElement: function (a) {
        this.addCallback(a);
      },
      elementChanged: function (a, b) {
        this.changedCallback(a, b);
      },
      concatLists: function (a, b) {
        return a.concat(e(b));
      },
      installOnLoad: function () {
        document.addEventListener(
          "readystatechange",
          function () {
            "complete" === document.readyState &&
              this.installNewSubtree(document);
          }.bind(this)
        );
      },
      isElement: function (a) {
        return a.nodeType === Node.ELEMENT_NODE;
      },
      flattenMutationTree: function (a) {
        var b = d(a, this.findElements, this);
        return b.push(f(a, this.isElement)), b.reduce(this.concatLists, []);
      },
      mutationWatcher: function (a) {
        a.forEach(this.mutationHandler, this);
      },
      mutationHandler: function (a) {
        if ("childList" === a.type) {
          var b = this.flattenMutationTree(a.addedNodes);
          b.forEach(this.addElement, this);
          var c = this.flattenMutationTree(a.removedNodes);
          c.forEach(this.removeElement, this);
        } else
          "attributes" === a.type && this.elementChanged(a.target, a.oldValue);
      },
    }),
      g ||
        (b.prototype.watchSubtree = function () {
          console.warn(
            "PolymerGestures: MutationObservers not found, touch-action will not be dynamically detected"
          );
        }),
      (a.Installer = b);
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher,
      c = b.pointermap,
      d = 25,
      e = [0, 1, 4, 2],
      f = !1;
    try {
      f = 1 === new MouseEvent("test", { buttons: 1 }).buttons;
    } catch (g) {}
    var h = {
      POINTER_ID: 1,
      POINTER_TYPE: "mouse",
      events: ["mousedown", "mousemove", "mouseup"],
      register: function (a) {
        b.listen(a, this.events);
      },
      unregister: function (a) {
        b.unlisten(a, this.events);
      },
      lastTouches: [],
      isEventSimulatedFromTouch: function (a) {
        for (
          var b,
            c = this.lastTouches,
            e = a.clientX,
            f = a.clientY,
            g = 0,
            h = c.length;
          h > g && (b = c[g]);
          g++
        ) {
          var i = Math.abs(e - b.x),
            j = Math.abs(f - b.y);
          if (d >= i && d >= j) return !0;
        }
      },
      prepareEvent: function (a) {
        var c = b.cloneEvent(a);
        return (
          (c.pointerId = this.POINTER_ID),
          (c.isPrimary = !0),
          (c.pointerType = this.POINTER_TYPE),
          f || (c.buttons = e[c.which] || 0),
          c
        );
      },
      mousedown: function (a) {
        if (!this.isEventSimulatedFromTouch(a)) {
          var d = c.has(this.POINTER_ID);
          d && this.mouseup(a);
          var e = this.prepareEvent(a);
          c.set(this.POINTER_ID, a.target), b.down(e);
        }
      },
      mousemove: function (a) {
        if (!this.isEventSimulatedFromTouch(a)) {
          var d = this.prepareEvent(a);
          (d.target = c.get(this.POINTER_ID)), b.move(d);
        }
      },
      mouseup: function (a) {
        if (!this.isEventSimulatedFromTouch(a)) {
          var d = this.prepareEvent(a);
          (d.target = c.get(this.POINTER_ID)),
            (d.relatedTarget = a.target),
            b.up(d),
            this.cleanupMouse();
        }
      },
      cleanupMouse: function () {
        c["delete"](this.POINTER_ID);
      },
    };
    a.mouseEvents = h;
  })(window.PolymerGestures),
  (function (a) {
    var b,
      c = a.dispatcher,
      d = a.targetFinding.allShadows.bind(a.targetFinding),
      e = c.pointermap,
      f = (Array.prototype.map.call.bind(Array.prototype.map), 2500),
      g = 200,
      h = "touch-action",
      i = "string" == typeof document.head.style.touchAction,
      j = {
        events: ["touchstart", "touchmove", "touchend", "touchcancel"],
        register: function (a) {
          i ? c.listen(a, this.events) : b.enableOnSubtree(a);
        },
        unregister: function (a) {
          i && c.unlisten(a, this.events);
        },
        elementAdded: function (a) {
          var b = a.getAttribute(h),
            e = this.touchActionToScrollType(b);
          e &&
            ((a._scrollType = e),
            c.listen(a, this.events),
            d(a).forEach(function (a) {
              (a._scrollType = e), c.listen(a, this.events);
            }, this));
        },
        elementRemoved: function (a) {
          (a._scrollType = void 0),
            c.unlisten(a, this.events),
            d(a).forEach(function (a) {
              (a._scrollType = void 0), c.unlisten(a, this.events);
            }, this);
        },
        elementChanged: function (a, b) {
          var c = a.getAttribute(h),
            e = this.touchActionToScrollType(c),
            f = this.touchActionToScrollType(b);
          e && f
            ? ((a._scrollType = e),
              d(a).forEach(function (a) {
                a._scrollType = e;
              }, this))
            : f
            ? this.elementRemoved(a)
            : e && this.elementAdded(a);
        },
        scrollTypes: {
          EMITTER: "none",
          XSCROLLER: "pan-x",
          YSCROLLER: "pan-y",
          SCROLLER: /^(?:pan-x pan-y)|(?:pan-y pan-x)|auto$/,
        },
        touchActionToScrollType: function (a) {
          var b = a,
            c = this.scrollTypes;
          return "none" === b
            ? "none"
            : b === c.XSCROLLER
            ? "X"
            : b === c.YSCROLLER
            ? "Y"
            : c.SCROLLER.exec(b)
            ? "XY"
            : void 0;
        },
        POINTER_TYPE: "touch",
        firstTouch: null,
        isPrimaryTouch: function (a) {
          return this.firstTouch === a.identifier;
        },
        setPrimaryTouch: function (a) {
          (0 === e.pointers() || (1 === e.pointers() && e.has(1))) &&
            ((this.firstTouch = a.identifier),
            (this.firstXY = { X: a.clientX, Y: a.clientY }),
            (this.scrolling = !1),
            this.cancelResetClickCount());
        },
        removePrimaryPointer: function (a) {
          a.isPrimary &&
            ((this.firstTouch = null),
            (this.firstXY = null),
            this.resetClickCount());
        },
        clickCount: 0,
        resetId: null,
        resetClickCount: function () {
          var a = function () {
            (this.clickCount = 0), (this.resetId = null);
          }.bind(this);
          this.resetId = setTimeout(a, g);
        },
        cancelResetClickCount: function () {
          this.resetId && clearTimeout(this.resetId);
        },
        typeToButtons: function (a) {
          var b = 0;
          return ("touchstart" === a || "touchmove" === a) && (b = 1), b;
        },
        findTarget: function (b, c) {
          return "touchstart" === this.currentTouchEvent.type
            ? a.findTarget(b)
            : e.get(c);
        },
        touchToPointer: function (a) {
          var b = this.currentTouchEvent,
            d = c.cloneEvent(a),
            e = (d.pointerId = a.identifier + 2);
          (d.target = this.findTarget(a, e)),
            (d.bubbles = !0),
            (d.cancelable = !0),
            (d.detail = this.clickCount),
            (d.buttons = this.typeToButtons(b.type)),
            (d.width = a.webkitRadiusX || a.radiusX || 0),
            (d.height = a.webkitRadiusY || a.radiusY || 0),
            (d.pressure = a.webkitForce || a.force || 0.5),
            (d.isPrimary = this.isPrimaryTouch(a)),
            (d.pointerType = this.POINTER_TYPE);
          var f = this;
          return (
            (d.preventDefault = function () {
              (f.scrolling = !1), (f.firstXY = null), b.preventDefault();
            }),
            d
          );
        },
        processTouches: function (a, b) {
          var c = a.changedTouches;
          this.currentTouchEvent = a;
          for (var d, e = 0; e < c.length; e++)
            (d = c[e]), b.call(this, this.touchToPointer(d));
        },
        shouldScroll: function (a) {
          if (this.firstXY) {
            var b,
              c = a.currentTarget._scrollType;
            if ("none" === c) b = !1;
            else if ("XY" === c) b = !0;
            else {
              var d = a.changedTouches[0],
                e = c,
                f = "Y" === c ? "X" : "Y",
                g = Math.abs(d["client" + e] - this.firstXY[e]),
                h = Math.abs(d["client" + f] - this.firstXY[f]);
              b = g >= h;
            }
            return (this.firstXY = null), b;
          }
        },
        findTouch: function (a, b) {
          for (var c, d = 0, e = a.length; e > d && (c = a[d]); d++)
            if (c.identifier === b) return !0;
        },
        vacuumTouches: function (a) {
          var b = a.touches;
          if (e.pointers() >= b.length) {
            var c = [];
            e.forEach(function (a, d) {
              if (1 !== d && !this.findTouch(b, d - 2)) {
                var e = a.out;
                c.push(e);
              }
            }, this),
              c.forEach(this.cancelOut, this);
          }
        },
        touchstart: function (a) {
          this.vacuumTouches(a),
            this.setPrimaryTouch(a.changedTouches[0]),
            this.dedupSynthMouse(a),
            this.scrolling ||
              (this.clickCount++, this.processTouches(a, this.down));
        },
        down: function (a) {
          e.set(a.pointerId, a.target);
          c.down(a);
        },
        touchmove: function (a) {
          i
            ? this.processTouches(a, this.move)
            : this.scrolling ||
              (this.shouldScroll(a)
                ? ((this.scrolling = !0), this.touchcancel(a))
                : (a.preventDefault(), this.processTouches(a, this.move)));
        },
        move: function (a) {
          var b = e.get(a.pointerId);
          b && c.move(a);
        },
        touchend: function (a) {
          this.dedupSynthMouse(a), this.processTouches(a, this.up);
        },
        up: function (b) {
          this.scrolling || ((b.relatedTarget = a.findTarget(b)), c.up(b)),
            this.cleanUpPointer(b);
        },
        touchcancel: function (a) {
          this.processTouches(a, this.up);
        },
        cleanUpPointer: function (a) {
          e["delete"](a.pointerId), this.removePrimaryPointer(a);
        },
        dedupSynthMouse: function (b) {
          var c = a.mouseEvents.lastTouches,
            d = b.changedTouches[0];
          if (this.isPrimaryTouch(d)) {
            var e = { x: d.clientX, y: d.clientY };
            c.push(e);
            var g = function (a, b) {
              var c = a.indexOf(b);
              c > -1 && a.splice(c, 1);
            }.bind(null, c, e);
            setTimeout(g, f);
          }
        },
      };
    i ||
      (b = new a.Installer(
        j.elementAdded,
        j.elementRemoved,
        j.elementChanged,
        j
      )),
      (a.touchEvents = j);
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher,
      c = b.pointermap,
      d =
        window.MSPointerEvent &&
        "number" == typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,
      e = {
        events: [
          "MSPointerDown",
          "MSPointerMove",
          "MSPointerUp",
          "MSPointerCancel",
        ],
        register: function (a) {
          b.listen(a, this.events);
        },
        unregister: function (a) {
          b.unlisten(a, this.events);
        },
        POINTER_TYPES: ["", "unavailable", "touch", "pen", "mouse"],
        prepareEvent: function (a) {
          var c = a;
          return (
            d &&
              ((c = b.cloneEvent(a)),
              (c.pointerType = this.POINTER_TYPES[a.pointerType])),
            c
          );
        },
        cleanup: function (a) {
          c["delete"](a);
        },
        MSPointerDown: function (a) {
          c.set(a.pointerId, a.target);
          var d = this.prepareEvent(a);
          b.down(d);
        },
        MSPointerMove: function (a) {
          var d = this.prepareEvent(a);
          (d.target = c.get(a.pointerId)), b.move(d);
        },
        MSPointerUp: function (a) {
          var d = this.prepareEvent(a);
          (d.target = c.get(a.pointerId)),
            (d.relatedTarget = a.target),
            b.up(d),
            this.cleanup(a.pointerId);
        },
        MSPointerCancel: function (a) {
          this.MSPointerUp(a);
        },
      };
    a.msEvents = e;
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher,
      c = b.pointermap,
      d = {
        events: ["pointerdown", "pointermove", "pointerup", "pointercancel"],
        prepareEvent: function (a) {
          return b.cloneEvent(a);
        },
        register: function (a) {
          b.listen(a, this.events);
        },
        unregister: function (a) {
          b.unlisten(a, this.events);
        },
        cleanup: function (a) {
          c["delete"](a);
        },
        pointerdown: function (a) {
          c.set(a.pointerId, a.target);
          var d = this.prepareEvent(a);
          b.down(d);
        },
        pointermove: function (a) {
          var d = this.prepareEvent(a);
          (d.target = c.get(a.pointerId)), b.move(d);
        },
        pointerup: function (a) {
          var d = this.prepareEvent(a);
          (d.target = c.get(a.pointerId)),
            (d.relatedTarget = a.target),
            b.up(d),
            this.cleanup(a.pointerId);
        },
        pointercancel: function (a) {
          this.pointerup(a);
        },
      };
    a.pointerEvents = d;
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher;
    window.PointerEvent
      ? b.registerSource("pointer", a.pointerEvents)
      : window.navigator.msPointerEnabled
      ? b.registerSource("ms", a.msEvents)
      : (b.registerSource("mouse", a.mouseEvents),
        void 0 !== window.ontouchstart &&
          b.registerSource("touch", a.touchEvents)),
      b.register(document);
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher,
      c = a.eventFactory,
      d = new a.PointerMap(),
      e = {
        events: ["down", "move", "up"],
        WIGGLE_THRESHOLD: 4,
        clampDir: function (a) {
          return a > 0 ? 1 : -1;
        },
        calcPositionDelta: function (a, b) {
          var c = 0,
            d = 0;
          return (
            a && b && ((c = b.pageX - a.pageX), (d = b.pageY - a.pageY)),
            { x: c, y: d }
          );
        },
        fireTrack: function (a, b, d) {
          var e = d,
            f = this.calcPositionDelta(e.downEvent, b),
            g = this.calcPositionDelta(e.lastMoveEvent, b);
          g.x && (e.xDirection = this.clampDir(g.x)),
            g.y && (e.yDirection = this.clampDir(g.y));
          var h = c.makeGestureEvent(a, {
            bubbles: !0,
            cancelable: !0,
            dx: f.x,
            dy: f.y,
            ddx: g.x,
            ddy: g.y,
            x: b.x,
            y: b.y,
            clientX: b.clientX,
            clientY: b.clientY,
            pageX: b.pageX,
            pageY: b.pageY,
            screenX: b.screenX,
            screenY: b.screenY,
            xDirection: e.xDirection,
            yDirection: e.yDirection,
            trackInfo: e.trackInfo,
            relatedTarget: b.relatedTarget,
            pointerType: b.pointerType,
            pointerId: b.pointerId,
          });
          e.downTarget.dispatchEvent(h);
        },
        down: function (a) {
          if (
            a.isPrimary &&
            ("mouse" === a.pointerType ? 1 === a.buttons : !0)
          ) {
            var b = {
              downEvent: a,
              downTarget: a.target,
              trackInfo: {},
              lastMoveEvent: null,
              xDirection: 0,
              yDirection: 0,
              tracking: !1,
            };
            d.set(a.pointerId, b);
          }
        },
        move: function (a) {
          var b = d.get(a.pointerId);
          if (b) {
            if (b.tracking) this.fireTrack("track", a, b);
            else {
              var c = this.calcPositionDelta(b.downEvent, a),
                e = c.x * c.x + c.y * c.y;
              e > this.WIGGLE_THRESHOLD &&
                ((b.tracking = !0),
                this.fireTrack("trackstart", b.downEvent, b),
                this.fireTrack("track", a, b));
            }
            b.lastMoveEvent = a;
          }
        },
        up: function (a) {
          var b = d.get(a.pointerId);
          b &&
            (b.tracking && this.fireTrack("trackend", a, b),
            d.delete(a.pointerId));
        },
      };
    b.registerGesture("track", e);
  })(window.PolymerGestures),
  (function (a) {
    var b = a.dispatcher,
      c = a.eventFactory,
      d = new a.PointerMap(),
      e = {
        events: ["down", "up"],
        down: function (a) {
          a.isPrimary &&
            !a.tapPrevented &&
            d.set(a.pointerId, {
              target: a.target,
              buttons: a.buttons,
              x: a.clientX,
              y: a.clientY,
            });
        },
        shouldTap: function (a, b) {
          return "mouse" === a.pointerType ? 1 === b.buttons : !0;
        },
        up: function (b) {
          var e = d.get(b.pointerId);
          if (e && this.shouldTap(b, e)) {
            var f = a.targetFinding.LCA(e.target, b.relatedTarget);
            if (f) {
              var g = c.makeGestureEvent("tap", {
                bubbles: !0,
                cancelable: !0,
                x: b.clientX,
                y: b.clientY,
                detail: b.detail,
                pointerType: b.pointerType,
                pointerId: b.pointerId,
                altKey: b.altKey,
                ctrlKey: b.ctrlKey,
                metaKey: b.metaKey,
                shiftKey: b.shiftKey,
              });
              f.dispatchEvent(g);
            }
          }
          d.delete(b.pointerId);
        },
      };
    (c.preventTap = function (a) {
      return function () {
        d.delete(a.pointerId);
      };
    }),
      b.registerGesture("tap", e);
  })(window.PolymerGestures),
  (function (a) {
    "use strict";
    function b(a, b) {
      if (!a) throw new Error("ASSERT: " + b);
    }
    function c(a) {
      return a >= 48 && 57 >= a;
    }
    function d(a) {
      return (
        32 === a ||
        9 === a ||
        11 === a ||
        12 === a ||
        160 === a ||
        (a >= 5760 && " ᠎             　﻿".indexOf(String.fromCharCode(a)) > 0)
      );
    }
    function e(a) {
      return 10 === a || 13 === a || 8232 === a || 8233 === a;
    }
    function f(a) {
      return (
        36 === a || 95 === a || (a >= 65 && 90 >= a) || (a >= 97 && 122 >= a)
      );
    }
    function g(a) {
      return (
        36 === a ||
        95 === a ||
        (a >= 65 && 90 >= a) ||
        (a >= 97 && 122 >= a) ||
        (a >= 48 && 57 >= a)
      );
    }
    function h(a) {
      return "this" === a;
    }
    function i() {
      for (; Y > X && d(W.charCodeAt(X)); ) ++X;
    }
    function j() {
      var a, b;
      for (a = X++; Y > X && ((b = W.charCodeAt(X)), g(b)); ) ++X;
      return W.slice(a, X);
    }
    function k() {
      var a, b, c;
      return (
        (a = X),
        (b = j()),
        (c =
          1 === b.length
            ? S.Identifier
            : h(b)
            ? S.Keyword
            : "null" === b
            ? S.NullLiteral
            : "true" === b || "false" === b
            ? S.BooleanLiteral
            : S.Identifier),
        { type: c, value: b, range: [a, X] }
      );
    }
    function l() {
      var a,
        b,
        c = X,
        d = W.charCodeAt(X),
        e = W[X];
      switch (d) {
        case 46:
        case 40:
        case 41:
        case 59:
        case 44:
        case 123:
        case 125:
        case 91:
        case 93:
        case 58:
        case 63:
          return (
            ++X,
            { type: S.Punctuator, value: String.fromCharCode(d), range: [c, X] }
          );
        default:
          if (((a = W.charCodeAt(X + 1)), 61 === a))
            switch (d) {
              case 37:
              case 38:
              case 42:
              case 43:
              case 45:
              case 47:
              case 60:
              case 62:
              case 124:
                return (
                  (X += 2),
                  {
                    type: S.Punctuator,
                    value: String.fromCharCode(d) + String.fromCharCode(a),
                    range: [c, X],
                  }
                );
              case 33:
              case 61:
                return (
                  (X += 2),
                  61 === W.charCodeAt(X) && ++X,
                  { type: S.Punctuator, value: W.slice(c, X), range: [c, X] }
                );
            }
      }
      return (
        (b = W[X + 1]),
        e === b && "&|".indexOf(e) >= 0
          ? ((X += 2), { type: S.Punctuator, value: e + b, range: [c, X] })
          : "<>=!+-*%&|^/".indexOf(e) >= 0
          ? (++X, { type: S.Punctuator, value: e, range: [c, X] })
          : void s({}, V.UnexpectedToken, "ILLEGAL")
      );
    }
    function m() {
      var a, d, e;
      if (
        ((e = W[X]),
        b(
          c(e.charCodeAt(0)) || "." === e,
          "Numeric literal must start with a decimal digit or a decimal point"
        ),
        (d = X),
        (a = ""),
        "." !== e)
      ) {
        for (
          a = W[X++],
            e = W[X],
            "0" === a &&
              e &&
              c(e.charCodeAt(0)) &&
              s({}, V.UnexpectedToken, "ILLEGAL");
          c(W.charCodeAt(X));

        )
          a += W[X++];
        e = W[X];
      }
      if ("." === e) {
        for (a += W[X++]; c(W.charCodeAt(X)); ) a += W[X++];
        e = W[X];
      }
      if ("e" === e || "E" === e)
        if (
          ((a += W[X++]),
          (e = W[X]),
          ("+" === e || "-" === e) && (a += W[X++]),
          c(W.charCodeAt(X)))
        )
          for (; c(W.charCodeAt(X)); ) a += W[X++];
        else s({}, V.UnexpectedToken, "ILLEGAL");
      return (
        f(W.charCodeAt(X)) && s({}, V.UnexpectedToken, "ILLEGAL"),
        { type: S.NumericLiteral, value: parseFloat(a), range: [d, X] }
      );
    }
    function n() {
      var a,
        c,
        d,
        f = "",
        g = !1;
      for (
        a = W[X],
          b("'" === a || '"' === a, "String literal must starts with a quote"),
          c = X,
          ++X;
        Y > X;

      ) {
        if (((d = W[X++]), d === a)) {
          a = "";
          break;
        }
        if ("\\" === d)
          if (((d = W[X++]), d && e(d.charCodeAt(0))))
            "\r" === d && "\n" === W[X] && ++X;
          else
            switch (d) {
              case "n":
                f += "\n";
                break;
              case "r":
                f += "\r";
                break;
              case "t":
                f += "	";
                break;
              case "b":
                f += "\b";
                break;
              case "f":
                f += "\f";
                break;
              case "v":
                f += "";
                break;
              default:
                f += d;
            }
        else {
          if (e(d.charCodeAt(0))) break;
          f += d;
        }
      }
      return (
        "" !== a && s({}, V.UnexpectedToken, "ILLEGAL"),
        { type: S.StringLiteral, value: f, octal: g, range: [c, X] }
      );
    }
    function o(a) {
      return (
        a.type === S.Identifier ||
        a.type === S.Keyword ||
        a.type === S.BooleanLiteral ||
        a.type === S.NullLiteral
      );
    }
    function p() {
      var a;
      return (
        i(),
        X >= Y
          ? { type: S.EOF, range: [X, X] }
          : ((a = W.charCodeAt(X)),
            40 === a || 41 === a || 58 === a
              ? l()
              : 39 === a || 34 === a
              ? n()
              : f(a)
              ? k()
              : 46 === a
              ? c(W.charCodeAt(X + 1))
                ? m()
                : l()
              : c(a)
              ? m()
              : l())
      );
    }
    function q() {
      var a;
      return (a = $), (X = a.range[1]), ($ = p()), (X = a.range[1]), a;
    }
    function r() {
      var a;
      (a = X), ($ = p()), (X = a);
    }
    function s(a, c) {
      var d,
        e = Array.prototype.slice.call(arguments, 2),
        f = c.replace(/%(\d)/g, function (a, c) {
          return b(c < e.length, "Message reference must be in range"), e[c];
        });
      throw ((d = new Error(f)), (d.index = X), (d.description = f), d);
    }
    function t(a) {
      s(a, V.UnexpectedToken, a.value);
    }
    function u(a) {
      var b = q();
      (b.type !== S.Punctuator || b.value !== a) && t(b);
    }
    function v(a) {
      return $.type === S.Punctuator && $.value === a;
    }
    function w(a) {
      return $.type === S.Keyword && $.value === a;
    }
    function x() {
      var a = [];
      for (u("["); !v("]"); )
        v(",") ? (q(), a.push(null)) : (a.push(bb()), v("]") || u(","));
      return u("]"), Z.createArrayExpression(a);
    }
    function y() {
      var a;
      return (
        i(),
        (a = q()),
        a.type === S.StringLiteral || a.type === S.NumericLiteral
          ? Z.createLiteral(a)
          : Z.createIdentifier(a.value)
      );
    }
    function z() {
      var a, b;
      return (
        (a = $),
        i(),
        (a.type === S.EOF || a.type === S.Punctuator) && t(a),
        (b = y()),
        u(":"),
        Z.createProperty("init", b, bb())
      );
    }
    function A() {
      var a = [];
      for (u("{"); !v("}"); ) a.push(z()), v("}") || u(",");
      return u("}"), Z.createObjectExpression(a);
    }
    function B() {
      var a;
      return u("("), (a = bb()), u(")"), a;
    }
    function C() {
      var a, b, c;
      return v("(")
        ? B()
        : ((a = $.type),
          a === S.Identifier
            ? (c = Z.createIdentifier(q().value))
            : a === S.StringLiteral || a === S.NumericLiteral
            ? (c = Z.createLiteral(q()))
            : a === S.Keyword
            ? w("this") && (q(), (c = Z.createThisExpression()))
            : a === S.BooleanLiteral
            ? ((b = q()),
              (b.value = "true" === b.value),
              (c = Z.createLiteral(b)))
            : a === S.NullLiteral
            ? ((b = q()), (b.value = null), (c = Z.createLiteral(b)))
            : v("[")
            ? (c = x())
            : v("{") && (c = A()),
          c ? c : void t(q()));
    }
    function D() {
      var a = [];
      if ((u("("), !v(")"))) for (; Y > X && (a.push(bb()), !v(")")); ) u(",");
      return u(")"), a;
    }
    function E() {
      var a;
      return (a = q()), o(a) || t(a), Z.createIdentifier(a.value);
    }
    function F() {
      return u("."), E();
    }
    function G() {
      var a;
      return u("["), (a = bb()), u("]"), a;
    }
    function H() {
      var a, b;
      for (a = C(); v(".") || v("["); )
        v("[")
          ? ((b = G()), (a = Z.createMemberExpression("[", a, b)))
          : ((b = F()), (a = Z.createMemberExpression(".", a, b)));
      return a;
    }
    function I() {
      var a, b;
      return (
        $.type !== S.Punctuator && $.type !== S.Keyword
          ? (b = ab())
          : v("+") || v("-") || v("!")
          ? ((a = q()), (b = I()), (b = Z.createUnaryExpression(a.value, b)))
          : w("delete") || w("void") || w("typeof")
          ? s({}, V.UnexpectedToken)
          : (b = ab()),
        b
      );
    }
    function J(a) {
      var b = 0;
      if (a.type !== S.Punctuator && a.type !== S.Keyword) return 0;
      switch (a.value) {
        case "||":
          b = 1;
          break;
        case "&&":
          b = 2;
          break;
        case "==":
        case "!=":
        case "===":
        case "!==":
          b = 6;
          break;
        case "<":
        case ">":
        case "<=":
        case ">=":
        case "instanceof":
          b = 7;
          break;
        case "in":
          b = 7;
          break;
        case "+":
        case "-":
          b = 9;
          break;
        case "*":
        case "/":
        case "%":
          b = 11;
      }
      return b;
    }
    function K() {
      var a, b, c, d, e, f, g, h;
      if (((g = I()), (b = $), (c = J(b)), 0 === c)) return g;
      for (b.prec = c, q(), e = I(), d = [g, b, e]; (c = J($)) > 0; ) {
        for (; d.length > 2 && c <= d[d.length - 2].prec; )
          (e = d.pop()),
            (f = d.pop().value),
            (g = d.pop()),
            (a = Z.createBinaryExpression(f, g, e)),
            d.push(a);
        (b = q()), (b.prec = c), d.push(b), (a = I()), d.push(a);
      }
      for (h = d.length - 1, a = d[h]; h > 1; )
        (a = Z.createBinaryExpression(d[h - 1].value, d[h - 2], a)), (h -= 2);
      return a;
    }
    function L() {
      var a, b, c;
      return (
        (a = K()),
        v("?") &&
          (q(),
          (b = L()),
          u(":"),
          (c = L()),
          (a = Z.createConditionalExpression(a, b, c))),
        a
      );
    }
    function M() {
      var a, b;
      return (
        (a = q()),
        a.type !== S.Identifier && t(a),
        (b = v("(") ? D() : []),
        Z.createFilter(a.value, b)
      );
    }
    function N() {
      for (; v("|"); ) q(), M();
    }
    function O() {
      i(), r();
      var a = bb();
      a &&
        ("," === $.value || ("in" == $.value && a.type === U.Identifier)
          ? Q(a)
          : (N(), "as" === $.value ? P(a) : Z.createTopLevel(a))),
        $.type !== S.EOF && t($);
    }
    function P(a) {
      q();
      var b = q().value;
      Z.createAsExpression(a, b);
    }
    function Q(a) {
      var b;
      "," === $.value &&
        (q(), $.type !== S.Identifier && t($), (b = q().value)),
        q();
      var c = bb();
      N(), Z.createInExpression(a.name, b, c);
    }
    function R(a, b) {
      return (
        (Z = b),
        (W = a),
        (X = 0),
        (Y = W.length),
        ($ = null),
        (_ = { labelSet: {} }),
        O()
      );
    }
    var S, T, U, V, W, X, Y, Z, $, _;
    (S = {
      BooleanLiteral: 1,
      EOF: 2,
      Identifier: 3,
      Keyword: 4,
      NullLiteral: 5,
      NumericLiteral: 6,
      Punctuator: 7,
      StringLiteral: 8,
    }),
      (T = {}),
      (T[S.BooleanLiteral] = "Boolean"),
      (T[S.EOF] = "<end>"),
      (T[S.Identifier] = "Identifier"),
      (T[S.Keyword] = "Keyword"),
      (T[S.NullLiteral] = "Null"),
      (T[S.NumericLiteral] = "Numeric"),
      (T[S.Punctuator] = "Punctuator"),
      (T[S.StringLiteral] = "String"),
      (U = {
        ArrayExpression: "ArrayExpression",
        BinaryExpression: "BinaryExpression",
        CallExpression: "CallExpression",
        ConditionalExpression: "ConditionalExpression",
        EmptyStatement: "EmptyStatement",
        ExpressionStatement: "ExpressionStatement",
        Identifier: "Identifier",
        Literal: "Literal",
        LabeledStatement: "LabeledStatement",
        LogicalExpression: "LogicalExpression",
        MemberExpression: "MemberExpression",
        ObjectExpression: "ObjectExpression",
        Program: "Program",
        Property: "Property",
        ThisExpression: "ThisExpression",
        UnaryExpression: "UnaryExpression",
      }),
      (V = {
        UnexpectedToken: "Unexpected token %0",
        UnknownLabel: "Undefined label '%0'",
        Redeclaration: "%0 '%1' has already been declared",
      });
    var ab = H,
      bb = L;
    a.esprima = { parse: R };
  })(this),
  (function (a) {
    "use strict";
    function b(a, b, d, e) {
      var f;
      try {
        if (
          ((f = c(a)),
          f.scopeIdent &&
            (d.nodeType !== Node.ELEMENT_NODE ||
              "TEMPLATE" !== d.tagName ||
              ("bind" !== b && "repeat" !== b)))
        )
          throw Error(
            "as and in can only be used within <template bind/repeat>"
          );
      } catch (g) {
        return void console.error("Invalid expression syntax: " + a, g);
      }
      return function (a, b, c) {
        var d = f.getBinding(a, e, c);
        return (
          f.scopeIdent &&
            d &&
            ((b.polymerExpressionScopeIdent_ = f.scopeIdent),
            f.indexIdent && (b.polymerExpressionIndexIdent_ = f.indexIdent)),
          d
        );
      };
    }
    function c(a) {
      var b = t[a];
      if (!b) {
        var c = new j();
        esprima.parse(a, c), (b = new l(c)), (t[a] = b);
      }
      return b;
    }
    function d(a) {
      (this.value = a), (this.valueFn_ = void 0);
    }
    function e(a) {
      (this.name = a), (this.path = Path.get(a));
    }
    function f(a, b, c) {
      "[" == c &&
        b instanceof d &&
        Path.get(b.value).valid &&
        ((c = "."), (b = new e(b.value))),
        (this.dynamicDeps = "function" == typeof a || a.dynamic),
        (this.dynamic = "function" == typeof b || b.dynamic || "[" == c),
        (this.simplePath =
          !this.dynamic &&
          !this.dynamicDeps &&
          b instanceof e &&
          (a instanceof f || a instanceof e)),
        (this.object = this.simplePath ? a : i(a)),
        (this.property = "." == c ? b : i(b));
    }
    function g(a, b) {
      (this.name = a), (this.args = []);
      for (var c = 0; c < b.length; c++) this.args[c] = i(b[c]);
    }
    function h() {
      throw Error("Not Implemented");
    }
    function i(a) {
      return "function" == typeof a ? a : a.valueFn();
    }
    function j() {
      (this.expression = null),
        (this.filters = []),
        (this.deps = {}),
        (this.currentPath = void 0),
        (this.scopeIdent = void 0),
        (this.indexIdent = void 0),
        (this.dynamicDeps = !1);
    }
    function k(a) {
      this.value_ = a;
    }
    function l(a) {
      if (
        ((this.scopeIdent = a.scopeIdent),
        (this.indexIdent = a.indexIdent),
        !a.expression)
      )
        throw Error("No expression found.");
      (this.expression = a.expression),
        i(this.expression),
        (this.filters = a.filters),
        (this.dynamicDeps = a.dynamicDeps);
    }
    function m(a) {
      return String(a).replace(/[A-Z]/g, function (a) {
        return "-" + a.toLowerCase();
      });
    }
    function n(a) {
      return "o" === a[0] && "n" === a[1] && "-" === a[2];
    }
    function o(a, b) {
      for (; a[x] && !Object.prototype.hasOwnProperty.call(a, b); ) a = a[x];
      return a;
    }
    function p(a, b) {
      if (0 == b.length) return void 0;
      if (1 == b.length) return o(a, b[0]);
      for (var c = 0; null != a && c < b.length - 1; c++) a = a[b[c]];
      return a;
    }
    function q(a, b, c) {
      var d = b.substring(3);
      return (
        (d = w[d] || d),
        function (b, e, f) {
          function g() {
            return "{{ " + a + " }}";
          }
          var h, i, j;
          return (
            (j =
              "function" == typeof c.resolveEventHandler
                ? function (d) {
                    (h = h || c.resolveEventHandler(b, a, e)),
                      h &&
                        (h(d, d.detail, d.currentTarget),
                        Platform &&
                          "function" == typeof Platform.flush &&
                          Platform.flush());
                  }
                : function (c) {
                    (h = h || a.getValueFrom(b)),
                      (i = i || p(b, a, e)),
                      h &&
                        (h.apply(i, [c, c.detail, c.currentTarget]),
                        Platform &&
                          "function" == typeof Platform.flush &&
                          Platform.flush());
                  }),
            e.addEventListener(d, j),
            f
              ? void 0
              : {
                  open: g,
                  discardChanges: g,
                  close: function () {
                    e.removeEventListener(d, j);
                  },
                }
          );
        }
      );
    }
    function r(a) {
      switch (a) {
        case "":
          return !1;
        case "false":
        case "null":
        case "true":
          return !0;
      }
      return isNaN(Number(a)) ? !1 : !0;
    }
    function s() {}
    var t = Object.create(null);
    (d.prototype = {
      valueFn: function () {
        if (!this.valueFn_) {
          var a = this.value;
          this.valueFn_ = function () {
            return a;
          };
        }
        return this.valueFn_;
      },
    }),
      (e.prototype = {
        valueFn: function () {
          if (!this.valueFn_) {
            var a = (this.name, this.path);
            this.valueFn_ = function (b, c) {
              return c && c.addPath(b, a), a.getValueFrom(b);
            };
          }
          return this.valueFn_;
        },
        setValue: function (a, b) {
          return (
            1 == this.path.length,
            (a = o(a, this.path[0])),
            this.path.setValueFrom(a, b)
          );
        },
      }),
      (f.prototype = {
        get fullPath() {
          if (!this.fullPath_) {
            var a =
              this.object instanceof e
                ? this.object.name
                : this.object.fullPath;
            this.fullPath_ = Path.get(a + "." + this.property.name);
          }
          return this.fullPath_;
        },
        valueFn: function () {
          if (!this.valueFn_) {
            var a = this.object;
            if (this.simplePath) {
              var b = this.fullPath;
              this.valueFn_ = function (a, c) {
                return c && c.addPath(a, b), b.getValueFrom(a);
              };
            } else if (this.property instanceof e) {
              var b = Path.get(this.property.name);
              this.valueFn_ = function (c, d) {
                var e = a(c, d);
                return d && d.addPath(e, b), b.getValueFrom(e);
              };
            } else {
              var c = this.property;
              this.valueFn_ = function (b, d) {
                var e = a(b, d),
                  f = c(b, d);
                return d && d.addPath(e, f), e ? e[f] : void 0;
              };
            }
          }
          return this.valueFn_;
        },
        setValue: function (a, b) {
          if (this.simplePath) return this.fullPath.setValueFrom(a, b), b;
          var c = this.object(a),
            d =
              this.property instanceof e
                ? this.property.name
                : this.property(a);
          return (c[d] = b);
        },
      }),
      (g.prototype = {
        transform: function (a, b, c, d, e) {
          var f = c[this.name],
            g = d;
          if (f) g = void 0;
          else if (((f = g[this.name]), !f))
            return void console.error("Cannot find filter: " + this.name);
          if (
            (b
              ? (f = f.toModel)
              : "function" == typeof f.toDOM && (f = f.toDOM),
            "function" != typeof f)
          )
            return void console.error(
              "No " + (b ? "toModel" : "toDOM") + " found on" + this.name
            );
          for (var h = [a], j = 0; j < this.args.length; j++)
            h[j + 1] = i(this.args[j])(d, e);
          return f.apply(g, h);
        },
      });
    var u = {
        "+": function (a) {
          return +a;
        },
        "-": function (a) {
          return -a;
        },
        "!": function (a) {
          return !a;
        },
      },
      v = {
        "+": function (a, b) {
          return a + b;
        },
        "-": function (a, b) {
          return a - b;
        },
        "*": function (a, b) {
          return a * b;
        },
        "/": function (a, b) {
          return a / b;
        },
        "%": function (a, b) {
          return a % b;
        },
        "<": function (a, b) {
          return b > a;
        },
        ">": function (a, b) {
          return a > b;
        },
        "<=": function (a, b) {
          return b >= a;
        },
        ">=": function (a, b) {
          return a >= b;
        },
        "==": function (a, b) {
          return a == b;
        },
        "!=": function (a, b) {
          return a != b;
        },
        "===": function (a, b) {
          return a === b;
        },
        "!==": function (a, b) {
          return a !== b;
        },
        "&&": function (a, b) {
          return a && b;
        },
        "||": function (a, b) {
          return a || b;
        },
      };
    (j.prototype = {
      createUnaryExpression: function (a, b) {
        if (!u[a]) throw Error("Disallowed operator: " + a);
        return (
          (b = i(b)),
          function (c, d) {
            return u[a](b(c, d));
          }
        );
      },
      createBinaryExpression: function (a, b, c) {
        if (!v[a]) throw Error("Disallowed operator: " + a);
        return (
          (b = i(b)),
          (c = i(c)),
          function (d, e) {
            return v[a](b(d, e), c(d, e));
          }
        );
      },
      createConditionalExpression: function (a, b, c) {
        return (
          (a = i(a)),
          (b = i(b)),
          (c = i(c)),
          function (d, e) {
            return a(d, e) ? b(d, e) : c(d, e);
          }
        );
      },
      createIdentifier: function (a) {
        var b = new e(a);
        return (b.type = "Identifier"), b;
      },
      createMemberExpression: function (a, b, c) {
        var d = new f(b, c, a);
        return d.dynamicDeps && (this.dynamicDeps = !0), d;
      },
      createLiteral: function (a) {
        return new d(a.value);
      },
      createArrayExpression: function (a) {
        for (var b = 0; b < a.length; b++) a[b] = i(a[b]);
        return function (b, c) {
          for (var d = [], e = 0; e < a.length; e++) d.push(a[e](b, c));
          return d;
        };
      },
      createProperty: function (a, b, c) {
        return { key: b instanceof e ? b.name : b.value, value: c };
      },
      createObjectExpression: function (a) {
        for (var b = 0; b < a.length; b++) a[b].value = i(a[b].value);
        return function (b, c) {
          for (var d = {}, e = 0; e < a.length; e++)
            d[a[e].key] = a[e].value(b, c);
          return d;
        };
      },
      createFilter: function (a, b) {
        this.filters.push(new g(a, b));
      },
      createAsExpression: function (a, b) {
        (this.expression = a), (this.scopeIdent = b);
      },
      createInExpression: function (a, b, c) {
        (this.expression = c), (this.scopeIdent = a), (this.indexIdent = b);
      },
      createTopLevel: function (a) {
        this.expression = a;
      },
      createThisExpression: h,
    }),
      (k.prototype = {
        open: function () {
          return this.value_;
        },
        discardChanges: function () {
          return this.value_;
        },
        deliver: function () {},
        close: function () {},
      }),
      (l.prototype = {
        getBinding: function (a, b, c) {
          function d() {
            if (h) return (h = !1), g;
            i.dynamicDeps && f.startReset();
            var c = i.getValue(a, i.dynamicDeps ? f : void 0, b);
            return i.dynamicDeps && f.finishReset(), c;
          }
          function e(c) {
            return i.setValue(a, c, b), c;
          }
          if (c) return this.getValue(a, void 0, b);
          var f = new CompoundObserver(),
            g = this.getValue(a, f, b),
            h = !0,
            i = this;
          return new ObserverTransform(f, d, e, !0);
        },
        getValue: function (a, b, c) {
          for (
            var d = i(this.expression)(a, b), e = 0;
            e < this.filters.length;
            e++
          )
            d = this.filters[e].transform(d, !1, c, a, b);
          return d;
        },
        setValue: function (a, b, c) {
          for (var d = this.filters ? this.filters.length : 0; d-- > 0; )
            b = this.filters[d].transform(b, !0, c, a);
          return this.expression.setValue
            ? this.expression.setValue(a, b)
            : void 0;
        },
      });
    var w = {};
    [
      "webkitAnimationStart",
      "webkitAnimationEnd",
      "webkitTransitionEnd",
      "DOMFocusOut",
      "DOMFocusIn",
      "DOMMouseScroll",
    ].forEach(function (a) {
      w[a.toLowerCase()] = a;
    });
    var x = "@" + Math.random().toString(36).slice(2);
    (s.prototype = {
      styleObject: function (a) {
        var b = [];
        for (var c in a) b.push(m(c) + ": " + a[c]);
        return b.join("; ");
      },
      tokenList: function (a) {
        var b = [];
        for (var c in a) a[c] && b.push(c);
        return b.join(" ");
      },
      prepareInstancePositionChanged: function (a) {
        var b = a.polymerExpressionIndexIdent_;
        if (b)
          return function (a, c) {
            a.model[b] = c;
          };
      },
      prepareBinding: function (a, c, d) {
        var e = Path.get(a);
        if (n(c))
          return e.valid
            ? q(e, c, this)
            : void console.error(
                "on-* bindings must be simple path expressions"
              );
        {
          if (r(a) || !e.valid) return b(a, c, d, this);
          if (1 == e.length)
            return function (a, b, c) {
              if (c) return e.getValueFrom(a);
              var d = o(a, e[0]);
              return new PathObserver(d, e);
            };
        }
      },
      prepareInstanceModel: function (a) {
        var b = a.polymerExpressionScopeIdent_;
        if (b) {
          var c = a.templateInstance ? a.templateInstance.model : a.model,
            d = a.polymerExpressionIndexIdent_;
          return function (a) {
            var e = Object.create(c);
            return (e[b] = a), (e[d] = void 0), (e[x] = c), e;
          };
        }
      },
    }),
      (a.PolymerExpressions = s),
      a.exposeGetExpression && (a.getExpression_ = c),
      (a.PolymerExpressions.prepareEventBinding = q);
  })(this),
  (Polymer = {}),
  "function" == typeof window.Polymer && (Polymer = {}),
  (function (a) {
    function b(a, b) {
      return (
        a &&
          b &&
          Object.getOwnPropertyNames(b).forEach(function (c) {
            var d = Object.getOwnPropertyDescriptor(b, c);
            d &&
              (Object.defineProperty(a, c, d),
              "function" == typeof d.value && (d.value.nom = c));
          }),
        a
      );
    }
    a.extend = b;
  })(Polymer),
  (function (a) {
    function b(a, b, d) {
      return a ? a.stop() : (a = new c(this)), a.go(b, d), a;
    }
    var c = function (a) {
      (this.context = a), (this.boundComplete = this.complete.bind(this));
    };
    (c.prototype = {
      go: function (a, b) {
        this.callback = a;
        var c;
        b
          ? ((c = setTimeout(this.boundComplete, b)),
            (this.handle = function () {
              clearTimeout(c);
            }))
          : ((c = requestAnimationFrame(this.boundComplete)),
            (this.handle = function () {
              cancelAnimationFrame(c);
            }));
      },
      stop: function () {
        this.handle && (this.handle(), (this.handle = null));
      },
      complete: function () {
        this.handle && (this.stop(), this.callback.call(this.context));
      },
    }),
      (a.job = b);
  })(Polymer),
  (function () {
    var a = {};
    (HTMLElement.register = function (b, c) {
      a[b] = c;
    }),
      (HTMLElement.getPrototypeForTag = function (b) {
        var c = b ? a[b] : HTMLElement.prototype;
        return c || Object.getPrototypeOf(document.createElement(b));
      });
    var b = Event.prototype.stopPropagation;
    Event.prototype.stopPropagation = function () {
      (this.cancelBubble = !0), b.apply(this, arguments);
    };
  })(Polymer),
  (function (a) {
    function b(a) {
      var c = b.caller,
        g = c.nom,
        h = c._super;
      if (
        (h ||
          (g || (g = c.nom = e.call(this, c)),
          g ||
            console.warn(
              "called super() on a method not installed declaratively (has no .nom property)"
            ),
          (h = d(c, g, f(this)))),
        h)
      ) {
        var i = h[g];
        return i._super || d(i, g, h), i.apply(this, a || []);
      }
    }
    function c(a, b, c) {
      for (; a; ) {
        if (a[b] !== c && a[b]) return a;
        a = f(a);
      }
    }
    function d(a, b, d) {
      return (
        (a._super = c(d, b, a)), a._super && (a._super[b].nom = b), a._super
      );
    }
    function e(a) {
      for (var b = this.__proto__; b && b !== HTMLElement.prototype; ) {
        for (
          var c, d = Object.getOwnPropertyNames(b), e = 0, f = d.length;
          f > e && (c = d[e]);
          e++
        ) {
          var g = Object.getOwnPropertyDescriptor(b, c);
          if ("function" == typeof g.value && g.value === a) return c;
        }
        b = b.__proto__;
      }
    }
    function f(a) {
      return a.__proto__;
    }
    a.super = b;
  })(Polymer),
  (function (a) {
    function b(a, b) {
      var d = typeof b;
      return b instanceof Date && (d = "date"), c[d](a, b);
    }
    var c = {
      string: function (a) {
        return a;
      },
      date: function (a) {
        return new Date(Date.parse(a) || Date.now());
      },
      boolean: function (a) {
        return "" === a ? !0 : "false" === a ? !1 : !!a;
      },
      number: function (a) {
        var b = parseFloat(a);
        return 0 === b && (b = parseInt(a)), isNaN(b) ? a : b;
      },
      object: function (a, b) {
        if (null === b) return a;
        try {
          return JSON.parse(a.replace(/'/g, '"'));
        } catch (c) {
          return a;
        }
      },
      function: function (a, b) {
        return b;
      },
    };
    a.deserializeValue = b;
  })(Polymer),
  (function (a) {
    var b = a.extend,
      c = {};
    (c.declaration = {}),
      (c.instance = {}),
      (c.publish = function (a, c) {
        for (var d in a) b(c, a[d]);
      }),
      (a.api = c);
  })(Polymer),
  (function (a) {
    var b = {
        async: function (a, b, c) {
          Platform.flush(), (b = b && b.length ? b : [b]);
          var d = function () {
              (this[a] || a).apply(this, b);
            }.bind(this),
            e = c ? setTimeout(d, c) : requestAnimationFrame(d);
          return c ? e : ~e;
        },
        cancelAsync: function (a) {
          0 > a ? cancelAnimationFrame(~a) : clearTimeout(a);
        },
        fire: function (a, b, c, d, e) {
          var f = c || this,
            b = b || {},
            g = new CustomEvent(a, {
              bubbles: void 0 !== d ? d : !0,
              cancelable: void 0 !== e ? e : !0,
              detail: b,
            });
          return f.dispatchEvent(g), g;
        },
        asyncFire: function () {
          this.async("fire", arguments);
        },
        classFollows: function (a, b, c) {
          b && b.classList.remove(c), a && a.classList.add(c);
        },
      },
      c = function () {},
      d = {};
    (b.asyncMethod = b.async),
      (a.api.instance.utils = b),
      (a.nop = c),
      (a.nob = d);
  })(Polymer),
  (function (a) {
    var b = window.logFlags || {},
      c = "on-",
      d = {
        EVENT_PREFIX: c,
        addHostListeners: function () {
          var a = this.eventDelegates;
          b.events &&
            Object.keys(a).length > 0 &&
            console.log("[%s] addHostListeners:", this.localName, a);
          var d,
            e,
            f = this;
          for (var g in a)
            (e = c + g),
              (d = PolymerExpressions.prepareEventBinding(Path.get(a[g]), e, {
                resolveEventHandler: function (a, b) {
                  var c = b.getValueFrom(f);
                  return c ? c.bind(f) : void 0;
                },
              }))(this, this, !1);
        },
        dispatchMethod: function (a, c, d) {
          if (a) {
            b.events && console.group("[%s] dispatch [%s]", a.localName, c);
            var e = "function" == typeof c ? c : a[c];
            e && e[d ? "apply" : "call"](a, d),
              b.events && console.groupEnd(),
              Platform.flush();
          }
        },
      };
    a.api.instance.events = d;
  })(Polymer),
  (function (a) {
    var b = {
      copyInstanceAttributes: function () {
        var a = this._instanceAttributes;
        for (var b in a) this.hasAttribute(b) || this.setAttribute(b, a[b]);
      },
      takeAttributes: function () {
        if (this._publishLC)
          for (
            var a, b = 0, c = this.attributes, d = c.length;
            (a = c[b]) && d > b;
            b++
          )
            this.attributeToProperty(a.name, a.value);
      },
      attributeToProperty: function (b, c) {
        var b = this.propertyForAttribute(b);
        if (b) {
          if (c && c.search(a.bindPattern) >= 0) return;
          var d = this[b],
            c = this.deserializeValue(c, d);
          c !== d && (this[b] = c);
        }
      },
      propertyForAttribute: function (a) {
        var b = this._publishLC && this._publishLC[a];
        return b;
      },
      deserializeValue: function (b, c) {
        return a.deserializeValue(b, c);
      },
      serializeValue: function (a, b) {
        return "boolean" === b
          ? a
            ? ""
            : void 0
          : "object" !== b && "function" !== b && void 0 !== a
          ? a
          : void 0;
      },
      reflectPropertyToAttribute: function (a) {
        var b = typeof this[a],
          c = this.serializeValue(this[a], b);
        void 0 !== c
          ? this.setAttribute(a, c)
          : "boolean" === b && this.removeAttribute(a);
      },
    };
    a.api.instance.attributes = b;
  })(Polymer),
  (function (a) {
    function b(a, b, e) {
      return (
        d.bind && console.log(f, e.path_, inPath, a.localName, b),
        Observer.bindToInstance(a, b, e, c)
      );
    }
    function c(a, b) {
      return null === b || void 0 === b ? a : b;
    }
    var d = window.logFlags || {},
      e = {
        createPropertyObserver: function () {
          var a = this._observeNames;
          if (a && a.length) {
            var b = (this._propertyObserver = new CompoundObserver(!0));
            this.registerObservers([b]);
            for (var c, d = 0, e = a.length; e > d && (c = a[d]); d++)
              b.addPath(this, c), this.observeArrayValue(c, this[c], null);
          }
        },
        openPropertyObserver: function () {
          this._propertyObserver &&
            this._propertyObserver.open(this.notifyPropertyChanges, this);
        },
        notifyPropertyChanges: function (a, b, c) {
          var d,
            e,
            f = {};
          for (var g in b)
            (d = c[2 * g + 1]),
              (e = this.observe[d]),
              e &&
                (this.observeArrayValue(d, a[g], b[g]),
                f[e] ||
                  ((f[e] = !0), this.invokeMethod(e, [b[g], a[g], arguments])));
        },
        propertyChanged_: function (a) {
          this.reflect[a] && this.reflectPropertyToAttribute(a);
        },
        observeArrayValue: function (a, b, c) {
          var e = this.observe[a];
          if (
            e &&
            (Array.isArray(c) &&
              (d.observe &&
                console.log(
                  "[%s] observeArrayValue: unregister observer [%s]",
                  this.localName,
                  a
                ),
              this.closeNamedObserver(a + "__array")),
            Array.isArray(b))
          ) {
            d.observe &&
              console.log(
                "[%s] observeArrayValue: register observer [%s]",
                this.localName,
                a,
                b
              );
            var f = new ArrayObserver(b);
            f.open(function (a, b) {
              this.invokeMethod(e, [b]);
            }, this),
              this.registerNamedObserver(a + "__array", f);
          }
        },
        bindProperty: function (a, c, d) {
          return d ? void (this[a] = c) : b(this, a, c);
        },
        invokeMethod: function (a, b) {
          var c = this[a] || a;
          "function" == typeof c && c.apply(this, b);
        },
        registerObservers: function (a) {
          (this._observers = this._observers || []), this._observers.push(a);
        },
        closeObservers: function () {
          for (var a = 0, b = this._observers.length; b > a; a++)
            this.closeObserverArray(this._observers[a]);
          this._observers = [];
        },
        closeObserverArray: function (a) {
          for (var b, c = 0, d = a.length; d > c; c++)
            (b = a[c]), b && b.close && b.close();
        },
        registerNamedObserver: function (a, b) {
          var c = this._namedObservers || (this._namedObservers = {});
          c[a] = b;
        },
        closeNamedObserver: function (a) {
          var b = this._namedObservers;
          return b && b[a] ? (b[a].close(), (b[a] = null), !0) : void 0;
        },
        closeNamedObservers: function () {
          if (this._namedObservers) {
            for (
              var a,
                b,
                c = Object.keys(this._namedObservers),
                d = 0,
                e = c.length;
              e > d && (a = c[d]);
              d++
            )
              (b = this._namedObservers[a]), b.close();
            this._namedObservers = {};
          }
        },
      },
      f = "[%s]: bindProperties: [%s] to [%s].[%s]";
    a.api.instance.properties = e;
  })(Polymer),
  (function (a) {
    var b = window.logFlags || 0,
      c = {
        instanceTemplate: function (a) {
          var b = this.syntax || (!a.bindingDelegate && this.element.syntax),
            c = a.createInstance(this, b);
          return this.registerObservers(c.bindings_), c;
        },
        bind: function (a, b, c) {
          var d = this.propertyForAttribute(a);
          if (d) {
            var e = this.bindProperty(d, b, c);
            return (
              Platform.enableBindingsReflection &&
                e &&
                ((e.path = b.path_),
                (this.bindings_ = this.bindings_ || {}),
                (this.bindings_[d] = e)),
              this.reflect[d] && this.reflectPropertyToAttribute(d),
              e
            );
          }
          return this.mixinSuper(arguments);
        },
        bindFinished: function () {
          this.makeElementReady();
        },
        asyncUnbindAll: function () {
          this._unbound ||
            (b.unbind && console.log("[%s] asyncUnbindAll", this.localName),
            (this._unbindAllJob = this.job(
              this._unbindAllJob,
              this.unbindAll,
              0
            )));
        },
        unbindAll: function () {
          this._unbound ||
            (this.closeObservers(),
            this.closeNamedObservers(),
            (this._unbound = !0));
        },
        cancelUnbindAll: function () {
          return this._unbound
            ? void (
                b.unbind &&
                console.warn(
                  "[%s] already unbound, cannot cancel unbindAll",
                  this.localName
                )
              )
            : (b.unbind && console.log("[%s] cancelUnbindAll", this.localName),
              void (
                this._unbindAllJob &&
                (this._unbindAllJob = this._unbindAllJob.stop())
              ));
        },
      },
      d = /\{\{([^{}]*)}}/;
    (a.bindPattern = d), (a.api.instance.mdv = c);
  })(Polymer),
  (function (a) {
    function b(a) {
      return a.hasOwnProperty("PolymerBase");
    }
    function c() {}
    var d = {
      PolymerBase: !0,
      job: function (a, b, c) {
        if ("string" != typeof a) return Polymer.job.call(this, a, b, c);
        var d = "___" + a;
        this[d] = Polymer.job.call(this, this[d], b, c);
      },
      super: Polymer.super,
      created: function () {},
      ready: function () {},
      createdCallback: function () {
        this.templateInstance &&
          this.templateInstance.model &&
          console.warn(
            "Attributes on " +
              this.localName +
              " were data bound prior to Polymer upgrading the element. This may result in incorrect binding types."
          ),
          this.created(),
          this.prepareElement(),
          (!this.ownerDocument.isStagingDocument || window.ShadowDOMPolyfill) &&
            this.makeElementReady();
      },
      prepareElement: function () {
        return this._elementPrepared
          ? void console.warn("Element already prepared", this.localName)
          : ((this._elementPrepared = !0),
            (this.shadowRoots = {}),
            this.createPropertyObserver(),
            this.openPropertyObserver(),
            this.copyInstanceAttributes(),
            this.takeAttributes(),
            void this.addHostListeners());
      },
      makeElementReady: function () {
        this._readied ||
          ((this._readied = !0),
          this.parseDeclarations(this.__proto__),
          this.removeAttribute("unresolved"),
          this.ready());
      },
      attachedCallback: function () {
        this.cancelUnbindAll(),
          this.attached && this.attached(),
          this.enteredView && this.enteredView(),
          this.hasBeenAttached ||
            ((this.hasBeenAttached = !0),
            this.domReady && this.async("domReady"));
      },
      detachedCallback: function () {
        this.preventDispose || this.asyncUnbindAll(),
          this.detached && this.detached(),
          this.leftView && this.leftView();
      },
      enteredViewCallback: function () {
        this.attachedCallback();
      },
      leftViewCallback: function () {
        this.detachedCallback();
      },
      enteredDocumentCallback: function () {
        this.attachedCallback();
      },
      leftDocumentCallback: function () {
        this.detachedCallback();
      },
      parseDeclarations: function (a) {
        a &&
          a.element &&
          (this.parseDeclarations(a.__proto__),
          a.parseDeclaration.call(this, a.element));
      },
      parseDeclaration: function (a) {
        var b = this.fetchTemplate(a);
        if (b) {
          var c = this.shadowFromTemplate(b);
          this.shadowRoots[a.name] = c;
        }
      },
      fetchTemplate: function (a) {
        return a.querySelector("template");
      },
      shadowFromTemplate: function (a) {
        if (a) {
          var b = this.createShadowRoot(),
            c = this.instanceTemplate(a);
          return b.appendChild(c), this.shadowRootReady(b, a), b;
        }
      },
      lightFromTemplate: function (a, b) {
        if (a) {
          this.lightDomController = !0;
          var c = this.instanceTemplate(a);
          return (
            b ? this.insertBefore(c, b) : this.appendChild(c),
            this.shadowRootReady(this),
            c
          );
        }
      },
      shadowRootReady: function (a) {
        this.marshalNodeReferences(a), PolymerGestures.register(a);
      },
      marshalNodeReferences: function (a) {
        var b = (this.$ = this.$ || {});
        if (a)
          for (
            var c, d = a.querySelectorAll("[id]"), e = 0, f = d.length;
            f > e && (c = d[e]);
            e++
          )
            b[c.id] = c;
      },
      attributeChangedCallback: function (a) {
        "class" !== a &&
          "style" !== a &&
          this.attributeToProperty(a, this.getAttribute(a)),
          this.attributeChanged && this.attributeChanged.apply(this, arguments);
      },
      onMutation: function (a, b) {
        var c = new MutationObserver(
          function (a) {
            b.call(this, c, a), c.disconnect();
          }.bind(this)
        );
        c.observe(a, { childList: !0, subtree: !0 });
      },
    };
    (c.prototype = d),
      (d.constructor = c),
      (a.Base = c),
      (a.isBase = b),
      (a.api.instance.base = d);
  })(Polymer),
  (function (a) {
    function b(a) {
      return a.__proto__;
    }
    function c(a, b) {
      var c = "",
        d = !1;
      b && ((c = b.localName), (d = b.hasAttribute("is")));
      var e = Platform.ShadowCSS.makeScopeSelector(c, d);
      return Platform.ShadowCSS.shimCssText(a, e);
    }
    var d = (window.logFlags || {}, "element"),
      e = "controller",
      f = {
        STYLE_SCOPE_ATTRIBUTE: d,
        installControllerStyles: function () {
          var a = this.findStyleScope();
          if (a && !this.scopeHasNamedStyle(a, this.localName)) {
            for (var c = b(this), d = ""; c && c.element; )
              (d += c.element.cssTextForScope(e)), (c = b(c));
            d && this.installScopeCssText(d, a);
          }
        },
        installScopeStyle: function (a, b, c) {
          var c = c || this.findStyleScope(),
            b = b || "";
          if (c && !this.scopeHasNamedStyle(c, this.localName + b)) {
            var d = "";
            if (a instanceof Array)
              for (var e, f = 0, g = a.length; g > f && (e = a[f]); f++)
                d += e.textContent + "\n\n";
            else d = a.textContent;
            this.installScopeCssText(d, c, b);
          }
        },
        installScopeCssText: function (a, b, d) {
          if (((b = b || this.findStyleScope()), (d = d || ""), b)) {
            window.ShadowDOMPolyfill && (a = c(a, b.host));
            var f = this.element.cssTextToScopeStyle(a, e);
            Polymer.applyStyleToScope(f, b),
              (b._scopeStyles[this.localName + d] = !0);
          }
        },
        findStyleScope: function (a) {
          for (var b = a || this; b.parentNode; ) b = b.parentNode;
          return b;
        },
        scopeHasNamedStyle: function (a, b) {
          return (a._scopeStyles = a._scopeStyles || {}), a._scopeStyles[b];
        },
      };
    a.api.instance.styles = f;
  })(Polymer),
  (function (a) {
    function b(a, b) {
      if (1 === arguments.length && "string" != typeof arguments[0]) {
        b = a;
        var c = document._currentScript;
        if (
          ((a =
            c && c.parentNode && c.parentNode.getAttribute
              ? c.parentNode.getAttribute("name")
              : ""),
          !a)
        )
          throw "Element name could not be inferred.";
      }
      if (f[a]) throw "Already registered (Polymer) prototype for element " + a;
      e(a, b), d(a);
    }
    function c(a, b) {
      h[a] = b;
    }
    function d(a) {
      h[a] && (h[a].registerWhenReady(), delete h[a]);
    }
    function e(a, b) {
      return (i[a] = b || {});
    }
    function f(a) {
      return i[a];
    }
    var g = a.extend,
      h = (a.api, {}),
      i = {};
    (a.getRegisteredPrototype = f),
      (a.waitingForPrototype = c),
      (window.Polymer = b),
      g(Polymer, a);
    var j = Platform.deliverDeclarations();
    if (j)
      for (var k, l = 0, m = j.length; m > l && (k = j[l]); l++)
        b.apply(null, k);
  })(Polymer),
  (function (a) {
    var b = {
      resolveElementPaths: function (a) {
        Platform.urlResolver.resolveDom(a);
      },
      addResolvePathApi: function () {
        var a = this.getAttribute("assetpath") || "",
          b = new URL(a, this.ownerDocument.baseURI);
        this.prototype.resolvePath = function (a, c) {
          var d = new URL(a, c || b);
          return d.href;
        };
      },
    };
    a.api.declaration.path = b;
  })(Polymer),
  (function (a) {
    function b(a, b) {
      var c = new URL(a.getAttribute("href"), b).href;
      return "@import '" + c + "';";
    }
    function c(a, b) {
      if (a) {
        b === document && (b = document.head),
          window.ShadowDOMPolyfill && (b = document.head);
        var c = d(a.textContent),
          e = a.getAttribute(h);
        e && c.setAttribute(h, e);
        var f = b.firstElementChild;
        if (b === document.head) {
          var g = "style[" + h + "]",
            i = document.head.querySelectorAll(g);
          i.length && (f = i[i.length - 1].nextElementSibling);
        }
        b.insertBefore(c, f);
      }
    }
    function d(a, b) {
      (b = b || document), (b = b.createElement ? b : b.ownerDocument);
      var c = b.createElement("style");
      return (c.textContent = a), c;
    }
    function e(a) {
      return (a && a.__resource) || "";
    }
    function f(a, b) {
      return p ? p.call(a, b) : void 0;
    }
    var g = (window.logFlags || {}, a.api.instance.styles),
      h = g.STYLE_SCOPE_ATTRIBUTE,
      i = "style",
      j = "@import",
      k = "link[rel=stylesheet]",
      l = "global",
      m = "polymer-scope",
      n = {
        loadStyles: function (a) {
          var b = this.templateContent();
          b && this.convertSheetsToStyles(b);
          var c = this.findLoadableStyles(b);
          c.length ? Platform.styleResolver.loadStyles(c, a) : a && a();
        },
        convertSheetsToStyles: function (a) {
          for (
            var c, e, f = a.querySelectorAll(k), g = 0, h = f.length;
            h > g && (c = f[g]);
            g++
          )
            (e = d(b(c, this.ownerDocument.baseURI), this.ownerDocument)),
              this.copySheetAttributes(e, c),
              c.parentNode.replaceChild(e, c);
        },
        copySheetAttributes: function (a, b) {
          for (
            var c, d = 0, e = b.attributes, f = e.length;
            (c = e[d]) && f > d;
            d++
          )
            "rel" !== c.name &&
              "href" !== c.name &&
              a.setAttribute(c.name, c.value);
        },
        findLoadableStyles: function (a) {
          var b = [];
          if (a)
            for (
              var c, d = a.querySelectorAll(i), e = 0, f = d.length;
              f > e && (c = d[e]);
              e++
            )
              c.textContent.match(j) && b.push(c);
          return b;
        },
        installSheets: function () {
          this.cacheSheets(),
            this.cacheStyles(),
            this.installLocalSheets(),
            this.installGlobalStyles();
        },
        cacheSheets: function () {
          (this.sheets = this.findNodes(k)),
            this.sheets.forEach(function (a) {
              a.parentNode && a.parentNode.removeChild(a);
            });
        },
        cacheStyles: function () {
          (this.styles = this.findNodes(i + "[" + m + "]")),
            this.styles.forEach(function (a) {
              a.parentNode && a.parentNode.removeChild(a);
            });
        },
        installLocalSheets: function () {
          var a = this.sheets.filter(function (a) {
              return !a.hasAttribute(m);
            }),
            b = this.templateContent();
          if (b) {
            var c = "";
            if (
              (a.forEach(function (a) {
                c += e(a) + "\n";
              }),
              c)
            ) {
              var f = d(c, this.ownerDocument);
              b.insertBefore(f, b.firstChild);
            }
          }
        },
        findNodes: function (a, b) {
          var c = this.querySelectorAll(a).array(),
            d = this.templateContent();
          if (d) {
            var e = d.querySelectorAll(a).array();
            c = c.concat(e);
          }
          return b ? c.filter(b) : c;
        },
        installGlobalStyles: function () {
          var a = this.styleForScope(l);
          c(a, document.head);
        },
        cssTextForScope: function (a) {
          var b = "",
            c = "[" + m + "=" + a + "]",
            d = function (a) {
              return f(a, c);
            },
            g = this.sheets.filter(d);
          g.forEach(function (a) {
            b += e(a) + "\n\n";
          });
          var h = this.styles.filter(d);
          return (
            h.forEach(function (a) {
              b += a.textContent + "\n\n";
            }),
            b
          );
        },
        styleForScope: function (a) {
          var b = this.cssTextForScope(a);
          return this.cssTextToScopeStyle(b, a);
        },
        cssTextToScopeStyle: function (a, b) {
          if (a) {
            var c = d(a);
            return c.setAttribute(h, this.getAttribute("name") + "-" + b), c;
          }
        },
      },
      o = HTMLElement.prototype,
      p =
        o.matches ||
        o.matchesSelector ||
        o.webkitMatchesSelector ||
        o.mozMatchesSelector;
    (a.api.declaration.styles = n), (a.applyStyleToScope = c);
  })(Polymer),
  (function (a) {
    var b = (window.logFlags || {}, a.api.instance.events),
      c = b.EVENT_PREFIX,
      d = {
        parseHostEvents: function () {
          var a = this.prototype.eventDelegates;
          this.addAttributeDelegates(a);
        },
        addAttributeDelegates: function (a) {
          for (var b, c = 0; (b = this.attributes[c]); c++)
            this.hasEventPrefix(b.name) &&
              (a[this.removeEventPrefix(b.name)] = b.value
                .replace("{{", "")
                .replace("}}", "")
                .trim());
        },
        hasEventPrefix: function (a) {
          return a && "o" === a[0] && "n" === a[1] && "-" === a[2];
        },
        removeEventPrefix: function (a) {
          return a.slice(e);
        },
      },
      e = c.length;
    a.api.declaration.events = d;
  })(Polymer),
  (function (a) {
    var b = {
      inferObservers: function (a) {
        var b,
          c = a.observe;
        for (var d in a)
          "Changed" === d.slice(-7) &&
            (c || (c = a.observe = {}),
            (b = d.slice(0, -7)),
            (c[b] = c[b] || d));
      },
      explodeObservers: function (a) {
        var b = a.observe;
        if (b) {
          var c = {};
          for (var d in b)
            for (var e, f = d.split(" "), g = 0; (e = f[g]); g++) c[e] = b[d];
          a.observe = c;
        }
      },
      optimizePropertyMaps: function (a) {
        if (a.observe) {
          var b = (a._observeNames = []);
          for (var c in a.observe)
            for (var d, e = c.split(" "), f = 0; (d = e[f]); f++) b.push(d);
        }
        if (a.publish) {
          var b = (a._publishNames = []);
          for (var c in a.publish) b.push(c);
        }
      },
      publishProperties: function (a, b) {
        var c = a.publish;
        c &&
          (this.requireProperties(c, a, b),
          (a._publishLC = this.lowerCaseMap(c)));
      },
      requireProperties: function (a, b, c) {
        b.reflect = b.reflect || {};
        for (var d in a)
          this.valueReflects(a[d]) && (b.reflect[d] = !0),
            void 0 === b[d] &&
              void 0 === c[d] &&
              (b[d] = this.valueForProperty(a[d]));
      },
      valueForProperty: function (a) {
        return "object" == typeof a && null !== a
          ? void 0 !== a.value
            ? a.value
            : null
          : a;
      },
      valueReflects: function (a) {
        return "object" == typeof a && null !== a && a.reflect;
      },
      lowerCaseMap: function (a) {
        var b = {};
        for (var c in a) b[c.toLowerCase()] = c;
        return b;
      },
      createPropertyAccessors: function (a) {
        var b = a._publishNames;
        if (b && b.length)
          for (var c, d = 0, e = b.length; e > d && (c = b[d]); d++)
            Observer.createBindablePrototypeAccessor(a, c);
      },
    };
    a.api.declaration.properties = b;
  })(Polymer),
  (function (a) {
    var b = "attributes",
      c = /\s|,/,
      d = {
        inheritAttributesObjects: function (a) {
          this.inheritObject(a, "publishLC"),
            this.inheritObject(a, "_instanceAttributes");
        },
        publishAttributes: function (a, d) {
          var e = this.getAttribute(b);
          if (e)
            for (
              var f,
                g = a.publish || (a.publish = {}),
                h = e.split(c),
                i = 0,
                j = h.length;
              j > i;
              i++
            )
              (f = h[i].trim()),
                f && void 0 === g[f] && void 0 === d[f] && (g[f] = null);
        },
        accumulateInstanceAttributes: function () {
          for (
            var a,
              b = this.prototype._instanceAttributes,
              c = this.attributes,
              d = 0,
              e = c.length;
            e > d && (a = c[d]);
            d++
          )
            this.isInstanceAttribute(a.name) && (b[a.name] = a.value);
        },
        isInstanceAttribute: function (a) {
          return !this.blackList[a] && "on-" !== a.slice(0, 3);
        },
        blackList: {
          name: 1,
          extends: 1,
          constructor: 1,
          noscript: 1,
          assetpath: 1,
          "cache-csstext": 1,
        },
      };
    (d.blackList[b] = 1), (a.api.declaration.attributes = d);
  })(Polymer),
  (function (a) {
    function b(a) {
      for (; a.parentNode; ) {
        if (a.lightDomController) return a;
        a = a.parentNode;
      }
      return a.host;
    }
    var c = new PolymerExpressions();
    c.resolveEventHandler = function (a, c, d) {
      var e = b(d);
      if (e) {
        var f = c.getValueFrom(e);
        if (f) return f.bind(e);
      }
    };
    var d = {
      syntax: c,
      fetchTemplate: function () {
        return this.querySelector("template");
      },
      templateContent: function () {
        var a = this.fetchTemplate();
        return a && templateContent(a);
      },
      installBindingDelegate: function (a) {
        a && (a.bindingDelegate = this.syntax);
      },
    };
    a.api.declaration.mdv = d;
  })(Polymer),
  (function (a) {
    function b(a) {
      if (!Object.__proto__) {
        var b = Object.getPrototypeOf(a);
        (a.__proto__ = b), d(b) && (b.__proto__ = Object.getPrototypeOf(b));
      }
    }
    var c = a.api,
      d = a.isBase,
      e = a.extend,
      f = {
        register: function (a, b) {
          this.buildPrototype(a, b),
            this.registerPrototype(a, b),
            this.publishConstructor();
        },
        buildPrototype: function (b, c) {
          var d = a.getRegisteredPrototype(b),
            e = this.generateBasePrototype(c);
          this.desugarBeforeChaining(d, e),
            (this.prototype = this.chainPrototypes(d, e)),
            this.desugarAfterChaining(b, c);
        },
        desugarBeforeChaining: function (a, b) {
          (a.element = this),
            this.publishAttributes(a, b),
            this.publishProperties(a, b),
            this.inferObservers(a),
            this.explodeObservers(a);
        },
        chainPrototypes: function (a, c) {
          this.inheritMetaData(a, c);
          var d = this.chainObject(a, c);
          return b(d), d;
        },
        inheritMetaData: function (a, b) {
          this.inheritObject("observe", a, b),
            this.inheritObject("publish", a, b),
            this.inheritObject("reflect", a, b),
            this.inheritObject("_publishLC", a, b),
            this.inheritObject("_instanceAttributes", a, b),
            this.inheritObject("eventDelegates", a, b);
        },
        desugarAfterChaining: function (a, b) {
          this.optimizePropertyMaps(this.prototype),
            this.createPropertyAccessors(this.prototype),
            this.installBindingDelegate(this.fetchTemplate()),
            this.installSheets(),
            this.resolveElementPaths(this),
            this.accumulateInstanceAttributes(),
            this.parseHostEvents(),
            this.addResolvePathApi(),
            window.ShadowDOMPolyfill &&
              Platform.ShadowCSS.shimStyling(this.templateContent(), a, b),
            this.prototype.registerCallback &&
              this.prototype.registerCallback(this);
        },
        publishConstructor: function () {
          var a = this.getAttribute("constructor");
          a && (window[a] = this.ctor);
        },
        generateBasePrototype: function (a) {
          var b = this.findBasePrototype(a);
          if (!b) {
            var b = HTMLElement.getPrototypeForTag(a);
            (b = this.ensureBaseApi(b)), (g[a] = b);
          }
          return b;
        },
        findBasePrototype: function (a) {
          return g[a];
        },
        ensureBaseApi: function (a) {
          if (a.PolymerBase) return a;
          var b = Object.create(a);
          return (
            c.publish(c.instance, b),
            this.mixinMethod(b, a, c.instance.mdv, "bind"),
            b
          );
        },
        mixinMethod: function (a, b, c, d) {
          var e = function (a) {
            return b[d].apply(this, a);
          };
          a[d] = function () {
            return (this.mixinSuper = e), c[d].apply(this, arguments);
          };
        },
        inheritObject: function (a, b, c) {
          var d = b[a] || {};
          b[a] = this.chainObject(d, c[a]);
        },
        registerPrototype: function (a, b) {
          var c = { prototype: this.prototype },
            d = this.findTypeExtension(b);
          d && (c.extends = d),
            HTMLElement.register(a, this.prototype),
            (this.ctor = document.registerElement(a, c));
        },
        findTypeExtension: function (a) {
          if (a && a.indexOf("-") < 0) return a;
          var b = this.findBasePrototype(a);
          return b.element ? this.findTypeExtension(b.element.extends) : void 0;
        },
      },
      g = {};
    (f.chainObject = Object.__proto__
      ? function (a, b) {
          return a && b && a !== b && (a.__proto__ = b), a;
        }
      : function (a, b) {
          if (a && b && a !== b) {
            var c = Object.create(b);
            a = e(c, a);
          }
          return a;
        }),
      (c.declaration.prototype = f);
  })(Polymer),
  (function (a) {
    function b(a) {
      return document.contains(a) ? g : f;
    }
    function c() {
      return f.length ? f[0] : g[0];
    }
    function d(a) {
      (e.waitToReady = !0),
        (CustomElements.ready = !1),
        HTMLImports.whenImportsReady(function () {
          e.addReadyCallback(a), (e.waitToReady = !1), e.check();
        });
    }
    var e = {
        wait: function (a, b, c) {
          return (
            -1 === this.indexOf(a) &&
              (this.add(a), (a.__check = b), (a.__go = c)),
            0 !== this.indexOf(a)
          );
        },
        add: function (a) {
          b(a).push(a);
        },
        indexOf: function (a) {
          var c = b(a).indexOf(a);
          return (
            c >= 0 &&
              document.contains(a) &&
              (c +=
                HTMLImports.useNative || HTMLImports.ready ? f.length : 1e9),
            c
          );
        },
        go: function (a) {
          var b = this.remove(a);
          b && (b.__go.call(b), (b.__check = b.__go = null), this.check());
        },
        remove: function (a) {
          var c = this.indexOf(a);
          if (0 === c) return b(a).shift();
        },
        check: function () {
          var a = this.nextElement();
          return (
            a && a.__check.call(a),
            this.canReady() ? (this.ready(), !0) : void 0
          );
        },
        nextElement: function () {
          return c();
        },
        canReady: function () {
          return !this.waitToReady && this.isEmpty();
        },
        isEmpty: function () {
          return !f.length && !g.length;
        },
        ready: function () {
          if (
            (CustomElements.ready === !1 &&
              (CustomElements.upgradeDocumentTree(document),
              (CustomElements.ready = !0)),
            h)
          )
            for (var a; h.length; ) (a = h.shift())();
        },
        addReadyCallback: function (a) {
          a && h.push(a);
        },
        waitToReady: !0,
      },
      f = [],
      g = [],
      h = [];
    document.addEventListener("WebComponentsReady", function () {
      CustomElements.ready = !1;
    }),
      (a.queue = e),
      (a.whenPolymerReady = d);
  })(Polymer),
  (function (a) {
    function b(a, b) {
      a ? (document.head.appendChild(a), d(b)) : b && b();
    }
    function c(a, c) {
      if (a && a.length) {
        for (
          var d, e, f = document.createDocumentFragment(), g = 0, h = a.length;
          h > g && (d = a[g]);
          g++
        )
          (e = document.createElement("link")),
            (e.rel = "import"),
            (e.href = d),
            f.appendChild(e);
        b(f, c);
      } else c && c();
    }
    var d = a.whenPolymerReady;
    (a.import = c), (a.importElements = b);
  })(Polymer),
  (function (a) {
    function b(a) {
      return Boolean(HTMLElement.getPrototypeForTag(a));
    }
    function c(a) {
      return a && a.indexOf("-") >= 0;
    }
    var d = a.extend,
      e = a.api,
      f = a.queue,
      g = a.whenPolymerReady,
      h = a.getRegisteredPrototype,
      i = a.waitingForPrototype,
      j = d(Object.create(HTMLElement.prototype), {
        createdCallback: function () {
          this.getAttribute("name") && this.init();
        },
        init: function () {
          (this.name = this.getAttribute("name")),
            (this.extends = this.getAttribute("extends")),
            this.loadResources(),
            this.registerWhenReady();
        },
        registerWhenReady: function () {
          this.registered ||
            this.waitingForPrototype(this.name) ||
            this.waitingForQueue() ||
            this.waitingForResources() ||
            f.go(this);
        },
        _register: function () {
          c(this.extends) &&
            !b(this.extends) &&
            console.warn(
              "%s is attempting to extend %s, an unregistered element or one that was not registered with Polymer.",
              this.name,
              this.extends
            ),
            this.register(this.name, this.extends),
            (this.registered = !0);
        },
        waitingForPrototype: function (a) {
          return h(a) ? void 0 : (i(a, this), this.handleNoScript(a), !0);
        },
        handleNoScript: function (a) {
          if (this.hasAttribute("noscript") && !this.noscript)
            if (
              ((this.noscript = !0),
              window.CustomElements && !CustomElements.useNative)
            )
              Polymer(a);
            else {
              var b = document.createElement("script");
              (b.textContent = "Polymer('" + a + "');"), this.appendChild(b);
            }
        },
        waitingForResources: function () {
          return this._needsResources;
        },
        waitingForQueue: function () {
          return f.wait(this, this.registerWhenReady, this._register);
        },
        loadResources: function () {
          (this._needsResources = !0),
            this.loadStyles(
              function () {
                (this._needsResources = !1), this.registerWhenReady();
              }.bind(this)
            );
        },
      });
    e.publish(e.declaration, j),
      g(function () {
        document.body.removeAttribute("unresolved"),
          document.dispatchEvent(
            new CustomEvent("polymer-ready", { bubbles: !0 })
          );
      }),
      document.registerElement("polymer-element", { prototype: j });
  })(Polymer);
//# sourceMappingURL=polymer.js.map
