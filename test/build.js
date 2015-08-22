(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArrayBufferUtils = (function () {
  function ArrayBufferUtils() {
    _classCallCheck(this, ArrayBufferUtils);
  }

  _createClass(ArrayBufferUtils, null, [{
    key: "StringFromCChar",
    value: function StringFromCChar(buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf));
    }
  }, {
    key: "StringFromCWord",
    value: function StringFromCWord(buf) {
      return String.fromCharCode.apply(null, new Uint16Array(buf));
    }
  }, {
    key: "IntFromCWord",
    value: function IntFromCWord(buf) {
      if (buf.byteLength !== 2) throw "C Word is 2 bytes long";
      return new Uint16Array(buf)[0];
    }
  }, {
    key: "IntFromCDWord",
    value: function IntFromCDWord(buf) {
      if (buf.byteLength !== 4) throw "DWord is 4 bytes long";
      return new Uint32Array(buf)[0];
    }
  }]);

  return ArrayBufferUtils;
})();

exports.ArrayBufferUtils = ArrayBufferUtils;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractFrequency = (function () {
  function AbstractFrequency() {
    _classCallCheck(this, AbstractFrequency);
  }

  _createClass(AbstractFrequency, null, [{
    key: "ComputePeriod",
    value: function ComputePeriod() {
      throw "NEEDS OVERRIDE";
    }
  }, {
    key: "ComputeFrequency",
    value: function ComputeFrequency() {
      throw "NEEDS OVERRIDE";
    }
  }]);

  return AbstractFrequency;
})();

exports.AbstractFrequency = AbstractFrequency;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractFrequency2 = require('./AbstractFrequency');

var AmigaFrequencyTable = (function (_AbstractFrequency) {
  _inherits(AmigaFrequencyTable, _AbstractFrequency);

  function AmigaFrequencyTable() {
    _classCallCheck(this, AmigaFrequencyTable);

    _get(Object.getPrototypeOf(AmigaFrequencyTable.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(AmigaFrequencyTable, null, [{
    key: "ComputePeriod",
    value: function ComputePeriod() {
      /* TODO: IMPLEMENT IT USING 
       *  Period = (PeriodTab[(Note MOD 12)*8 + FineTune/16]*(1-Frac(FineTune/16)) +
       *              PeriodTab[(Note MOD 12)*8 + FineTune/16]*(Frac(FineTune/16)))
       *                          *16/2^(Note DIV 12);
       *                                (The period is interpolated for finer finetune values)
       *
       *
       * PeriodTab = Array[0..12*8-1] of Word = (
       *  907,900,894,887,881,875,868,862,856,850,844,838,832,826,820,814,
       *  808,802,796,791,785,779,774,768,762,757,752,746,741,736,730,725,
       *  720,715,709,704,699,694,689,684,678,675,670,665,660,655,651,646,
       *  640,636,632,628,623,619,614,610,604,601,597,592,588,584,580,575,
       *  570,567,563,559,555,551,547,543,538,535,532,528,524,520,516,513,
       *  508,505,502,498,494,491,487,484,480,477,474,470,467,463,460,457);
       */
      throw "Not implemented yet";
    }
  }, {
    key: "ComputeFrequency",
    value: function ComputeFrequency() {
      //TODO: IMPLEMENT IT
      //Frequency = 8363*1712/Period;
      throw "Not implemented yet";
    }
  }]);

  return AmigaFrequencyTable;
})(_AbstractFrequency2.AbstractFrequency);

exports.AmigaFrequencyTable = AmigaFrequencyTable;

},{"./AbstractFrequency":2}],4:[function(require,module,exports){
/* 
 * The string at offset 38 should read "FastTracker II" but some trackers
 * (e.g. DigiTracker) use this field for other purposes (DigiTracker stores the
 * Composer's name here). This field being trashed doesn't necessarily mean
 * that the XM file is corrupt.
 * Offset Length Type
 * 0     17   (char) ID text: 'Extended module: '
 * 17     20   (char) Module name, padded with spaces
 * 37      1   (char) $1a
 * 38     20   (char) Tracker name
 * 58      2   (word) Version number, hi-byte major and low-byte minor
 * The current format is version $0103
 * 60      4  (dword) Header size
 * +4      2   (word) Song length (in patten order table)
 * +6      2   (word) Restart position
 * +8      2   (word) Number of channels (2,4,6,8,10,...,32)
 * +10      2   (word) Number of patterns (max 256)
 * +12      2   (word) Number of instruments (max 128)
 * +14      2   (word) Flags: bit 0: 0 = Amiga frequency table
 *                                   1 = Linear frequency table
 * +16      2   (word) Default tempo
 * +18      2   (word) Default BPM
 * +20    256   (byte) Pattern order table
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsArrayBufferUtils = require('./../utils/ArrayBufferUtils');

var _AmigaFrequencyTable = require('./AmigaFrequencyTable');

var _LinearFrequencyTable = require('./LinearFrequencyTable');

var XMGeneralHeader = (function () {
  function XMGeneralHeader(arrayBuffer) {
    _classCallCheck(this, XMGeneralHeader);

    this.idText = this._parseIDText(arrayBuffer);
    this.moduleName = this._parseModuleName(arrayBuffer);
    this.$1a = this._parse$1a(arrayBuffer);
    this.trackerName = this._parseTrackerName(arrayBuffer);
    this.versionNumber = this._parseVersionNumber(arrayBuffer); // TODO : This one seems buggy
    this.headerSize = this._parseHeaderSize(arrayBuffer);
    this.songLength = this._parseSongLength(arrayBuffer); // TODO: MAKE SURE LENGTH IS OK
    this.restartPosition = this._parseRestartPosition(arrayBuffer);
    this.numberOfChannels = this._parseNumberOfChannels(arrayBuffer);
    this.numberOfPatterns = this._parseNumberOfPatterns(arrayBuffer);
    this.numberOfInstruments = this._parseNumberOfInstruments(arrayBuffer);
    this.frequencyTable = this._parseFrequencyTable(arrayBuffer);
    this.defaultTempo = this._parseDefaultTempo(arrayBuffer);
    this.defaultBpm = this._parseDefaultBPM(arrayBuffer);
    this.patternOrderTable = this._parsePatternOrderTable(arrayBuffer);
  }

  _createClass(XMGeneralHeader, [{
    key: 'FrequencyTable',
    value: function FrequencyTable() {
      // TODO: Not Tested Yet
      // Should give good object
      if (this.frequencyTable == 0) {
        return _AmigaFrequencyTable.AmigaFrequencyTable;
      } else {
        return _LinearFrequencyTable.LinearFrequencyTable;
      }
    }
  }, {
    key: '_parseIDText',
    value: function _parseIDText(ab) {
      var moduleName = ab.slice(0, 17);
      var parsed = _utilsArrayBufferUtils.ArrayBufferUtils.StringFromCChar(moduleName);
      if (parsed.substr(0, 16) === "Extended Module:") return parsed;else throw "Invalid XM File";
    }
  }, {
    key: '_parseModuleName',
    value: function _parseModuleName(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.StringFromCChar(ab.slice(17, 37));
    }
  }, {
    key: '_parse$1a',
    value: function _parse$1a(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.StringFromCChar(ab.slice(37, 1));
    }
  }, {
    key: '_parseTrackerName',
    value: function _parseTrackerName(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.StringFromCChar(ab.slice(38, 58));
    }
  }, {
    key: '_parseVersionNumber',
    value: function _parseVersionNumber(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.StringFromCWord(ab.slice(58, 60));
    }
  }, {
    key: '_parseHeaderSize',
    value: function _parseHeaderSize(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCDWord(ab.slice(60, 64));
    }
  }, {
    key: '_parseSongLength',
    value: function _parseSongLength(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(64, 66));
    }
  }, {
    key: '_parseRestartPosition',
    value: function _parseRestartPosition(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(66, 68));
    }
  }, {
    key: '_parseNumberOfChannels',
    value: function _parseNumberOfChannels(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(68, 70));
    }
  }, {
    key: '_parseNumberOfPatterns',
    value: function _parseNumberOfPatterns(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(70, 72));
    }
  }, {
    key: '_parseNumberOfInstruments',
    value: function _parseNumberOfInstruments(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(72, 74));
    }
  }, {
    key: '_parseFrequencyTable',
    value: function _parseFrequencyTable(ab) {
      // 0 is Amiga and 1 is linear
      var array = new Uint8Array(ab.slice(74, 76));
      return array[0];
    }
  }, {
    key: '_parseDefaultTempo',
    value: function _parseDefaultTempo(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(76, 78));
    }
  }, {
    key: '_parseDefaultBPM',
    value: function _parseDefaultBPM(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(78, 80));
    }
  }, {
    key: '_parsePatternOrderTable',
    value: function _parsePatternOrderTable(ab) {
      var orderTable = new Int8Array(ab.slice(80, 336));
      return orderTable;
    }
  }]);

  return XMGeneralHeader;
})();

exports.XMGeneralHeader = XMGeneralHeader;

},{"./../utils/ArrayBufferUtils":1,"./AmigaFrequencyTable":3,"./LinearFrequencyTable":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractFrequency2 = require('./AbstractFrequency');

var LinearFrequencyTable = (function (_AbstractFrequency) {
  _inherits(LinearFrequencyTable, _AbstractFrequency);

  function LinearFrequencyTable() {
    _classCallCheck(this, LinearFrequencyTable);

    _get(Object.getPrototypeOf(LinearFrequencyTable.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(LinearFrequencyTable, null, [{
    key: "ComputePeriod",
    value: function ComputePeriod() {
      // TODO: IMPLEMENT IT USING
      //  Period = 10*12*16*4 - Note*16*4 - FineTune/2;
      throw "Not implemented yet";
    }
  }, {
    key: "ComputeFrequency",
    value: function ComputeFrequency() {
      //TODO: IMPLEMENT IT
      //     Frequency = 8363*2^((6*12*16*4 - Period) / (12*16*4));
      throw "Not implemented yet";
    }
  }]);

  return LinearFrequencyTable;
})(_AbstractFrequency2.AbstractFrequency);

exports.LinearFrequencyTable = LinearFrequencyTable;

},{"./AbstractFrequency":2}],6:[function(require,module,exports){
/*
 * This is player code mostly to test as of currently
 */
"use strict";

var _modulesXmGeneralHeader = require('./modules/xm/GeneralHeader');

console.log("Hi World ! ");

var oReq = new XMLHttpRequest();
oReq.open("GET", "age.xm", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var blob = oReq.response;
    var xm_headers = new _modulesXmGeneralHeader.XMGeneralHeader(blob);
    var xm_frequency = xm_headers.FrequencyTable();
    debugger;
  }
};

oReq.send(null);

},{"./modules/xm/GeneralHeader":4}]},{},[6]);
