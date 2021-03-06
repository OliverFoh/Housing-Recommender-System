"use strict";
var _baseComponent = _interopRequireDefault(require("../helpers/baseComponent")),
  _classNames = _interopRequireDefault(require("../helpers/classNames")),
  _styleToCssString = _interopRequireDefault(require("../helpers/styleToCssString")),
  _checkIPhoneX = require("../helpers/checkIPhoneX");

function _interopRequireDefault(t) {
  return t && t.__esModule ? t : {
    default: t
  }
}

function _slicedToArray(t, e) {
  return _arrayWithHoles(t) || _iterableToArrayLimit(t, e) || _nonIterableRest()
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit(t, e) {
  var r = [],
    n = !0,
    i = !1,
    a = void 0;
  try {
    for (var o, s = t[Symbol.iterator](); !(n = (o = s.next()).done) && (r.push(o.value), !e || r.length !== e); n = !0);
  } catch (t) {
    i = !0, a = t
  } finally {
    try {
      n || null == s.return || s.return()
    } finally {
      if (i) throw a
    }
  }
  return r
}

function _arrayWithHoles(t) {
  if (Array.isArray(t)) return t
}

function ownKeys(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function (t) {
      return Object.getOwnPropertyDescriptor(e, t).enumerable
    })), r.push.apply(r, n)
  }
  return r
}

function _objectSpread(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = null != arguments[t] ? arguments[t] : {};
    t % 2 ? ownKeys(r, !0).forEach(function (t) {
      _defineProperty(e, t, r[t])
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ownKeys(r).forEach(function (t) {
      Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
    })
  }
  return e
}

function _defineProperty(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t
}(0, _baseComponent.default)({
  relations: {
    "../index-item/index": {
      type: "child",
      observer: function () {
        this.debounce(this.updated)
      }
    }
  },
  properties: {
    prefixCls: {
      type: String,
      value: "wux-index"
    },
    height: {
      type: [String, Number],
      value: 300,
      observer: "updateStyle"
    },
    showIndicator: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    scrollTop: 0,
    sections: [],
    moving: !1,
    current: 0,
    currentName: "",
    extStyle: ""
  },
  computed: {
    classes: ["prefixCls", function (t) {
      return {
        wrap: (0, _classNames.default)(t),
        nav: "".concat(t, "__nav"),
        navItem: "".concat(t, "__nav-item"),
        indicator: "".concat(t, "__indicator")
      }
    }]
  },
  methods: {
    updateStyle: function (t) {
      var e = 0 < arguments.length && void 0 !== t ? t : this.data.height,
        r = (0, _styleToCssString.default)({
          height: e
        });
      r !== this.data.extStyle && this.setData({
        extStyle: r
      })
    },
    updated: function () {
      var t = this.getRelationNodes("../index-item/index");
      0 < t.length && (t.forEach(function (t, e) {
        t.updated(e)
      }), setTimeout(this.getNavPoints.bind(this))), this.data.sections.length !== t.length && this.setData({
        sections: t.map(function (t) {
          return t.data
        })
      })
    },
    setActive: function (e, r) {
      if (e !== this.data.current || r !== this.data.currentName) {
        var t = this.data.sections.filter(function (t) {
          return t.index === e && t.name === r
        })[0];
        t && this.setData({
          current: e,
          currentName: r,
          scrollTop: t.top
        }), this.vibrateShort()
      }
      this.triggerEvent("change", {
        index: e,
        name: r
      })
    },
    onTouchStart: function (t) {
      if (!this.data.moving) {
        var e = t.target.dataset,
          r = e.index,
          n = e.name;
        this.setActive(r, n), this.setData({
          moving: !0
        })
      }
    },
    onTouchMove: function (t) {
      var e = this.getTargetFromPoint(t.changedTouches[0].pageY);
      if (void 0 !== e) {
        var r = e.dataset,
          n = r.index,
          i = r.name;
        this.setActive(n, i)
      }
    },
    onTouchEnd: function (t) {
      var e = this;
      this.data.moving && setTimeout(function () {
        return e.setData({
          moving: !1
        })
      }, 300)
    },
    onScroll: function (t) {
      var r = this;
      if (!this.data.moving) {
        var n = t.detail.scrollTop;
        this.data.sections.forEach(function (t, e) {
          n < t.top + t.height && n >= t.top && (e === r.data.current && t.name === r.data.currentName || r.setData({
            current: e,
            currentName: t.name
          }))
        })
      }
    },
    getNavPoints: function () {
      var e = this,
        t = ".".concat(this.data.prefixCls, "__nav-item");
      wx.createSelectorQuery().in(this).selectAll(t).boundingClientRect(function (t) {
        t.filter(function (t) {
          return !t
        }).length || e.setData({
          points: t.map(function (t) {
            return _objectSpread({}, t, {
              offsets: [t.top, t.top + t.height]
            })
          })
        })
      }).exec()
    },
    getTargetFromPoint: function (t) {
      for (var e, r = this.data.points, n = r.length - 1; 0 <= n; n--) {
        var i = _slicedToArray(r[n].offsets, 2),
          a = i[0],
          o = i[1];
        if (n === r.length - 1 && o < t || 0 === n && t < a || a <= t && t <= o) {
          e = r[n];
          break
        }
      }
      return e
    }
  },
  created: function () {
    var t = (0, _checkIPhoneX.getSystemInfo)();
    this.vibrateShort = function () {
      "devtools" !== t.platform && wx.vibrateShort()
    }
  },
  ready: function () {
    this.updateStyle(), this.getNavPoints()
  }
});