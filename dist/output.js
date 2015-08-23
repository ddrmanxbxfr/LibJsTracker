(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
 * LibJsTracker is a library to play old chiptunes formats
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
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
  }, {
    key: "IntFromByte",
    value: function IntFromByte(buf) {
      if (buf.byteLength !== 1) throw "C Byte is 1 byte long..";
      return new Int8Array(buf)[0];
    }
  }]);

  return ArrayBufferUtils;
})();

exports.ArrayBufferUtils = ArrayBufferUtils;

},{}],2:[function(require,module,exports){
/* 
 * LibJsTracker is a library to play old chiptunes formats
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * ------------------------------------------------------------------------------
 * Structure formats
 * ------------------------------------------------------------------------------
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
 * ------------------------------------------------------------------------------
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsArrayBufferUtils = require('./../utils/ArrayBufferUtils');

var _frequency_tableAmigaFrequencyTable = require('./frequency_table/AmigaFrequencyTable');

var _frequency_tableLinearFrequencyTable = require('./frequency_table/LinearFrequencyTable');

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
        return _frequency_tableAmigaFrequencyTable.AmigaFrequencyTable;
      } else {
        return _frequency_tableLinearFrequencyTable.LinearFrequencyTable;
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
      var nbChannel = _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(68, 70));
      if (nbChannel > 64) throw "Invalid number of channel";

      return nbChannel;
    }
  }, {
    key: '_parseNumberOfPatterns',
    value: function _parseNumberOfPatterns(ab) {
      var nbPatterns = _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(70, 72));
      if (nbPatterns > 256) nbPatterns = 256;

      return nbPatterns;
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

},{"./../utils/ArrayBufferUtils":1,"./frequency_table/AmigaFrequencyTable":6,"./frequency_table/LinearFrequencyTable":7}],3:[function(require,module,exports){
/*
 * this file contains a XM single pattern....
 * ------------------------------------------------------------------------
 * Structure formats
 * ------------------------------------------------------------------------
 *
 * ?      4    (dword) Pattern header length
 * +4      1   (byte) Packing type (always 0)
 * +5      2   (word) Number of rows in pattern (1..256)
 * +7      2   (word) Packed patterndata size
 * ?      ?    Packed pattern data
 *
 * Note that if the Module uses a totally empty pattern, this pattern
 * is *NOT* stored in the XM; in other words, you need to create an empty
 * pattern if the module needs one.
 * In fact, to be save, you'll always have to create a "standard" empty
 * pattern: allocate 64*(nr of channels) bytes and set them to value $80
 * (128 dec). Initialise the header of this pattern with the standard
 * values:
 *   pattern header length     = 9
 *   Packing type              = 0
 *   Number of rows in pattern = 64
 *   Packed patterndata size   = 64*(nr of channels)
 *
 * If the field "Packed patterndata size" is set to 0, the pattern is NOT
 * stored in the file but it MAY be used by the song.
 * Also note that whenever a pattern nr in the pattern sequence table is
 * higher than the nr of patterns (common for converted S3M's), you should
 * play the standard empty pattern.
 *
*
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilsArrayBufferUtils = require('./../utils/ArrayBufferUtils');

var XMPattern = (function () {
  function XMPattern(arrayBuffer, offset) {
    _classCallCheck(this, XMPattern);

    this.offset = offset;
    this.patternHeaderLength = this._parsePatternHeaderLength(arrayBuffer);
    this.packingType = this._parsePackingType(arrayBuffer);
    this.numberOfRows = this._parseNumberOfRows(arrayBuffer);
    this.packedPatternDataSize = this._parsePackedPatternDataSize(arrayBuffer);
    this.patternData = this._parsePatternData(arrayBuffer);
  }

  _createClass(XMPattern, [{
    key: "_parsePatternHeaderLength",
    value: function _parsePatternHeaderLength(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCDWord(ab.slice(this.offset, this.offset + 4));
    }
  }, {
    key: "_parsePackingType",
    value: function _parsePackingType(ab) {
      var parsedValue = new Int8Array(ab.slice(this.offset + 4, this.offset + 4 + 1))[0];
      if (parsedValue !== 0) throw "Packing type should always be 0!";
      return parsedValue;
    }
  }, {
    key: "_parseNumberOfRows",
    value: function _parseNumberOfRows(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(this.offset + 5, this.offset + 5 + 2));
    }
  }, {
    key: "_parsePackedPatternDataSize",
    value: function _parsePackedPatternDataSize(ab) {
      return _utilsArrayBufferUtils.ArrayBufferUtils.IntFromCWord(ab.slice(this.offset + 7, this.offset + 7 + 2));
    }
  }, {
    key: "_parsePatternData",
    value: function _parsePatternData(ab) {
      if (this.packedPatternDataSize !== 0) {
        // At 0 no pattern data is present....
        debugger;
        throw "NOT IMPLEMENTED YET!!";
      }
    }
  }]);

  return XMPattern;
})();

exports.XMPattern = XMPattern;

},{"./../utils/ArrayBufferUtils":1}],4:[function(require,module,exports){
/*
 * Constains all the patterns of the XM File
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsArrayBufferUtils = require('./../utils/ArrayBufferUtils');

var _XMPattern = require('./XMPattern');

var XMPatterns = function XMPatterns(numberOfPatterns, arrayBuffer) {
  _classCallCheck(this, XMPatterns);

  this.mPattern = [];
  this.baseOffset = 336;
  this.patternsOffset = 0;
  for (var i = 0; i < numberOfPatterns; ++i) {
    var offset = this.baseOffset + this.patternsOffset;
    var pattern = new _XMPattern.XMPattern(arrayBuffer, offset);
    this.patternsOffset += pattern.patternHeaderLength;
    mPattern += pattern;
  }
};

exports.XMPatterns = XMPatterns;

},{"./../utils/ArrayBufferUtils":1,"./XMPattern":3}],5:[function(require,module,exports){
/*
 *
 * LibJsTracker is a library to play old chiptunes formats
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
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

},{}],6:[function(require,module,exports){
/*
 *
 * LibJsTracker is a library to play old chiptunes formats
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
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

},{"./AbstractFrequency":5}],7:[function(require,module,exports){
/* 
 * LibJsTracker is a library to play old chiptunes formats
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
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

},{"./AbstractFrequency":5}],8:[function(require,module,exports){
/*
 *
 * This is player code mostly to test as of currently
 * Copyright (C) 2015  Mathieu Rheaume <mathieu@codingrhemes.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
'use strict';

var _modulesXmXMGeneralHeader = require('./modules/xm/XMGeneralHeader');

var _modulesXmXMPatterns = require('./modules/xm/XMPatterns');

console.log("Hi World ! ");

var oReq = new XMLHttpRequest();
oReq.open("GET", "age.xm", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var blob = oReq.response;
    var xm_headers = new _modulesXmXMGeneralHeader.XMGeneralHeader(blob);
    var xm_patterns = new _modulesXmXMPatterns.XMPatterns(xm_headers.numberOfPatterns, blob);
    debugger;
  }
};

oReq.send(null);

},{"./modules/xm/XMGeneralHeader":2,"./modules/xm/XMPatterns":4}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tYXRoaWV1L3Byb2cvTGliSnNUcmFja2VyL21vZHVsZXMvdXRpbHMvQXJyYXlCdWZmZXJVdGlscy5qcyIsIi9ob21lL21hdGhpZXUvcHJvZy9MaWJKc1RyYWNrZXIvbW9kdWxlcy94bS9YTUdlbmVyYWxIZWFkZXIuanMiLCIvaG9tZS9tYXRoaWV1L3Byb2cvTGliSnNUcmFja2VyL21vZHVsZXMveG0vWE1QYXR0ZXJuLmpzIiwiL2hvbWUvbWF0aGlldS9wcm9nL0xpYkpzVHJhY2tlci9tb2R1bGVzL3htL1hNUGF0dGVybnMuanMiLCIvaG9tZS9tYXRoaWV1L3Byb2cvTGliSnNUcmFja2VyL21vZHVsZXMveG0vZnJlcXVlbmN5X3RhYmxlL0Fic3RyYWN0RnJlcXVlbmN5LmpzIiwiL2hvbWUvbWF0aGlldS9wcm9nL0xpYkpzVHJhY2tlci9tb2R1bGVzL3htL2ZyZXF1ZW5jeV90YWJsZS9BbWlnYUZyZXF1ZW5jeVRhYmxlLmpzIiwiL2hvbWUvbWF0aGlldS9wcm9nL0xpYkpzVHJhY2tlci9tb2R1bGVzL3htL2ZyZXF1ZW5jeV90YWJsZS9MaW5lYXJGcmVxdWVuY3lUYWJsZS5qcyIsIi9ob21lL21hdGhpZXUvcHJvZy9MaWJKc1RyYWNrZXIvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2tCYSxnQkFBZ0I7V0FBaEIsZ0JBQWdCOzBCQUFoQixnQkFBZ0I7OztlQUFoQixnQkFBZ0I7O1dBQ0wseUJBQUMsR0FBRyxFQUFFO0FBQzFCLGFBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDN0Q7OztXQUVxQix5QkFBQyxHQUFHLEVBQUU7QUFDMUIsYUFBTyxNQUFNLENB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eUI7O0FBRXBELE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTNCLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7QUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDOztBQUVsQyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQzlCLE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDaEMsTUFBSSxXQUFXLEVBQUU7QUFDZixRQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pCLFFBQUksVUFBVSxHQUFHLDhDQUFvQixJQUFJLENBQUMsQ0FBQztBQUMzQyxRQUFJLFdBQVcsR0FBRyxvQ0FBZSxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEUsYUFBUztHQUNWO0NBQ0YsQ0FBQzs7QUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogTGliSnNUcmFja2VyIGlzIGEgbGlicmFyeSB0byBwbGF5IG9sZCBjaGlwdHVuZXMgZm9ybWF0c1xuICogQ29weXJpZ2h0IChDKSAyMDE1ICBNYXRoaWV1IFJoZWF1bWUgPG1hdGhpZXVAY29kaW5ncmhlbWVzLmNvbT5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEFycmF5QnVmZmVyVXRpbHMge1xuICBzdGF0aWMgU3RyaW5nRnJvbUNDaGFyKGJ1Zikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50OEFycmF5KGJ1ZikpO1xuICB9IFxuXG4gIHN0YXRpYyBTdHJpbmdGcm9tQ1dvcmQoYnVmKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQxNkFycmF5KGJ1ZikpO1xuICB9XG5cbiAgc3RhdGljIEludEZyb21DV29yZChidWYpIHtcbiAgICBpZiAoYnVmLmJ5dGVMZW5ndGggIT09IDIpXG4gICAgICB0aHJvdyBcIkMgV29yZCBpcyAyIGJ5dGVzIGxvbmdcIjtcbiAgICByZXR1cm4gbmV3IFVpbnQxNkFycmF5KGJ1ZilbMF07XG4gIH1cblxuICBzdGF0aWMgSW50RnJvbUNEV29yZChidWYpIHtcbiAgICBpZiAoYnVmLmJ5dGVMZW5ndGggIT09IDQpXG4gICAgICB0aHJvdyBcIkRXb3JkIGlzIDQgYnl0ZXMgbG9uZ1wiO1xuICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkoYnVmKVswXTtcbiAgfVxuXG4gIHN0YXRpYyBJbnRGcm9tQnl0ZShidWYpIHtcbiAgICBpZiAoYnVmLmJ5dGVMZW5ndGggIT09IDEpXG4gICAgICB0aHJvdyBcIkMgQnl0ZSBpcyAxIGJ5dGUgbG9uZy4uXCI7XG4gICAgcmV0dXJuIG5ldyBJbnQ4QXJyYXkoYnVmKVswXTtcbiAgfVxufVxuXG4iLCIvKiBcbiAqIExpYkpzVHJhY2tlciBpcyBhIGxpYnJhcnkgdG8gcGxheSBvbGQgY2hpcHR1bmVzIGZvcm1hdHNcbiAqIENvcHlyaWdodCAoQykgMjAxNSAgTWF0aGlldSBSaGVhdW1lIDxtYXRoaWV1QGNvZGluZ3JoZW1lcy5jb20+XG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFN0cnVjdHVyZSBmb3JtYXRzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRoZSBzdHJpbmcgYXQgb2Zmc2V0IDM4IHNob3VsZCByZWFkIFwiRmFzdFRyYWNrZXIgSUlcIiBidXQgc29tZSB0cmFja2Vyc1xuICogKGUuZy4gRGlnaVRyYWNrZXIpIHVzZSB0aGlzIGZpZWxkIGZvciBvdGhlciBwdXJwb3NlcyAoRGlnaVRyYWNrZXIgc3RvcmVzIHRoZVxuICogQ29tcG9zZXIncyBuYW1lIGhlcmUpLiBUaGlzIGZpZWxkIGJlaW5nIHRyYXNoZWQgZG9lc24ndCBuZWNlc3NhcmlseSBtZWFuXG4gKiB0aGF0IHRoZSBYTSBmaWxlIGlzIGNvcnJ1cHQuXG4gKiBPZmZzZXQgTGVuZ3RoIFR5cGVcbiAqIDAgICAgIDE3ICAgKGNoYXIpIElEIHRleHQ6ICdFeHRlbmRlZCBtb2R1bGU6ICdcbiAqIDE3ICAgICAyMCAgIChjaGFyKSBNb2R1bGUgbmFtZSwgcGFkZGVkIHdpdGggc3BhY2VzXG4gKiAzNyAgICAgIDEgICAoY2hhcikgJDFhXG4gKiAzOCAgICAgMjAgICAoY2hhcikgVHJhY2tlciBuYW1lXG4gKiA1OCAgICAgIDIgICAod29yZCkgVmVyc2lvbiBudW1iZXIsIGhpLWJ5dGUgbWFqb3IgYW5kIGxvdy1ieXRlIG1pbm9yXG4gKiBUaGUgY3VycmVudCBmb3JtYXQgaXMgdmVyc2lvbiAkMDEwM1xuICogNjAgICAgICA0ICAoZHdvcmQpIEhlYWRlciBzaXplXG4gKiArNCAgICAgIDIgICAod29yZCkgU29uZyBsZW5ndGggKGluIHBhdHRlbiBvcmRlciB0YWJsZSlcbiAqICs2ICAgICAgMiAgICh3b3JkKSBSZXN0YXJ0IHBvc2l0aW9uXG4gKiArOCAgICAgIDIgICAod29yZCkgTnVtYmVyIG9mIGNoYW5uZWxzICgyLDQsNiw4LDEwLC4uLiwzMilcbiAqICsxMCAgICAgIDIgICAod29yZCkgTnVtYmVyIG9mIHBhdHRlcm5zIChtYXggMjU2KVxuICogKzEyICAgICAgMiAgICh3b3JkKSBOdW1iZXIgb2YgaW5zdHJ1bWVudHMgKG1heCAxMjgpXG4gKiArMTQgICAgICAyICAgKHdvcmQpIEZsYWdzOiBiaXQgMDogMCA9IEFtaWdhIGZyZXF1ZW5jeSB0YWJsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEgPSBMaW5lYXIgZnJlcXVlbmN5IHRhYmxlXG4gKiArMTYgICAgICAyICAgKHdvcmQpIERlZmF1bHQgdGVtcG9cbiAqICsxOCAgICAgIDIgICAod29yZCkgRGVmYXVsdCBCUE1cbiAqICsyMCAgICAyNTYgICAoYnl0ZSkgUGF0dGVybiBvcmRlciB0YWJsZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmltcG9ydCB7IEFycmF5QnVmZmVyVXRpbHMgfSBmcm9tICcuLy4uL3V0aWxzL0FycmF5QnVmZmVyVXRpbHMnO1xuaW1wb3J0IHsgQW1pZ2FGcmVxdWVuY3lUYWJsZSB9IGZyb20gJy4vZnJlcXVlbmN5X3RhYmxlL0FtaWdhRnJlcXVlbmN5VGFibGUnO1xuaW1wb3J0IHsgTGluZWFyRnJlcXVlbmN5VGFibGUgfSBmcm9tICcuL2ZyZXF1ZW5jeV90YWJsZS9MaW5lYXJGcmVxdWVuY3lUYWJsZSc7XG5cbmV4cG9ydCBjbGFzcyBYTUdlbmVyYWxIZWFkZXIge1xuICBjb25zdHJ1Y3RvcihhcnJheUJ1ZmZlcikge1xuICAgIHRoaXMuaWRUZXh0ID0gdGhpcy5fcGFyc2VJRFRleHQoYXJyYXlCdWZmZXIpO1xuICAgIHRoaXMubW9kdWxlTmFtZSA9IHRoaXMuX3BhcnNlTW9kdWxlTmFtZShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy4kMWEgPSB0aGlzLl9wYXJzZSQxYShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy50cmFja2VyTmFtZSA9IHRoaXMuX3BhcnNlVHJhY2tlck5hbWUoYXJyYXlCdWZmZXIpO1xuICAgIHRoaXMudmVyc2lvbk51bWJlciA9IHRoaXMuX3BhcnNlVmVyc2lvbk51bWJlcihhcnJheUJ1ZmZlcik7IC8vIFRPRE8gOiBUaGlzIG9uZSBzZWVtcyBidWdneVxuICAgIHRoaXMuaGVhZGVyU2l6ZSA9IHRoaXMuX3BhcnNlSGVhZGVyU2l6ZShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5zb25nTGVuZ3RoID0gdGhpcy5fcGFyc2VTb25nTGVuZ3RoKGFycmF5QnVmZmVyKTsgLy8gVE9ETzogTUFLRSBTVVJFIExFTkdUSCBJUyBPS1xuICAgIHRoaXMucmVzdGFydFBvc2l0aW9uID0gdGhpcy5fcGFyc2VSZXN0YXJ0UG9zaXRpb24oYXJyYXlCdWZmZXIpO1xuICAgIHRoaXMubnVtYmVyT2ZDaGFubmVscyA9IHRoaXMuX3BhcnNlTnVtYmVyT2ZDaGFubmVscyhhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5udW1iZXJPZlBhdHRlcm5zID0gdGhpcy5fcGFyc2VOdW1iZXJPZlBhdHRlcm5zKGFycmF5QnVmZmVyKTtcbiAgICB0aGlzLm51bWJlck9mSW5zdHJ1bWVudHMgPSB0aGlzLl9wYXJzZU51bWJlck9mSW5zdHJ1bWVudHMoYXJyYXlCdWZmZXIpO1xuICAgIHRoaXMuZnJlcXVlbmN5VGFibGUgPSB0aGlzLl9wYXJzZUZyZXF1ZW5jeVRhYmxlKGFycmF5QnVmZmVyKTtcbiAgICB0aGlzLmRlZmF1bHRUZW1wbyA9IHRoaXMuX3BhcnNlRGVmYXVsdFRlbXBvKGFycmF5QnVmZmVyKTtcbiAgICB0aGlzLmRlZmF1bHRCcG0gPSB0aGlzLl9wYXJzZURlZmF1bHRCUE0oYXJyYXlCdWZmZXIpO1xuICAgIHRoaXMucGF0dGVybk9yZGVyVGFibGUgPSB0aGlzLl9wYXJzZVBhdHRlcm5PcmRlclRhYmxlKGFycmF5QnVmZmVyKTtcbiAgfVxuXG4gIEZyZXF1ZW5jeVRhYmxlKCkge1xuICAgIC8vIFRPRE86IE5vdCBUZXN0ZWQgWWV0XG4gICAgLy8gU2hvdWxkIGdpdmUgZ29vZCBvYmplY3RcbiAgICBpZiAodGhpcy5mcmVxdWVuY3lUYWJsZSA9PSAwKSB7XG4gICAgICByZXR1cm4gQW1pZ2FGcmVxdWVuY3lUYWJsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIExpbmVhckZyZXF1ZW5jeVRhYmxlO1xuICAgIH1cbiAgfVxuXG4gIF9wYXJzZUlEVGV4dChhYikge1xuICAgIHZhciBtb2R1bGVOYW1lID0gYWIuc2xpY2UoMCwgMTcpO1xuICAgIHZhciBwYXJzZWQgPSBBcnJheUJ1ZmZlclV0aWxzLlN0cmluZ0Zyb21DQ2hhcihtb2R1bGVOYW1lKTtcbiAgICBpZiAocGFyc2VkLnN1YnN0cigwLDE2KSA9PT0gXCJFeHRlbmRlZCBNb2R1bGU6XCIpXG4gICAgICByZXR1cm4gcGFyc2VkO1xuICAgIGVsc2VcbiAgICAgIHRocm93IFwiSW52YWxpZCBYTSBGaWxlXCI7XG4gIH1cblxuICBfcGFyc2VNb2R1bGVOYW1lKGFiKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyVXRpbHMuU3RyaW5nRnJvbUNDaGFyKGFiLnNsaWNlKDE3LCAzNykpO1xuICB9XG5cbiAgX3BhcnNlJDFhKGFiKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyVXRpbHMuU3RyaW5nRnJvbUNDaGFyKGFiLnNsaWNlKDM3LCAxKSk7XG4gIH1cblxuICBfcGFyc2VUcmFja2VyTmFtZShhYikge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlclV0aWxzLlN0cmluZ0Zyb21DQ2hhcihhYi5zbGljZSgzOCwgNTgpKTtcbiAgfVxuXG4gIF9wYXJzZVZlcnNpb25OdW1iZXIoYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5TdHJpbmdGcm9tQ1dvcmQoYWIuc2xpY2UoNTgsIDYwKSk7XG4gIH1cblxuICBfcGFyc2VIZWFkZXJTaXplKGFiKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyVXRpbHMuSW50RnJvbUNEV29yZChhYi5zbGljZSg2MCwgNjQpKTtcbiAgfVxuXG4gIF9wYXJzZVNvbmdMZW5ndGgoYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5JbnRGcm9tQ1dvcmQoYWIuc2xpY2UoNjQsIDY2KSk7XG4gIH1cblxuICBfcGFyc2VSZXN0YXJ0UG9zaXRpb24oYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5JbnRGcm9tQ1dvcmQoYWIuc2xpY2UoNjYsIDY4KSk7XG4gIH1cblxuICBfcGFyc2VOdW1iZXJPZkNoYW5uZWxzKGFiKSB7XG4gICAgdmFyIG5iQ2hhbm5lbCA9IEFycmF5QnVmZmVyVXRpbHMuSW50RnJvbUNXb3JkKGFiLnNsaWNlKDY4LCA3MCkpO1xuICAgIGlmIChuYkNoYW5uZWwgPiA2NClcbiAgICAgIHRocm93IFwiSW52YWxpZCBudW1iZXIgb2YgY2hhbm5lbFwiO1xuXG4gICAgcmV0dXJuIG5iQ2hhbm5lbDtcbiAgfVxuXG4gIF9wYXJzZU51bWJlck9mUGF0dGVybnMoYWIpIHtcbiAgICB2YXIgbmJQYXR0ZXJucyA9IEFycmF5QnVmZmVyVXRpbHMuSW50RnJvbUNXb3JkKGFiLnNsaWNlKDcwLCA3MikpO1xuICAgIGlmIChuYlBhdHRlcm5zID4gMjU2KVxuICAgICAgbmJQYXR0ZXJucyA9IDI1NjtcblxuICAgIHJldHVybiBuYlBhdHRlcm5zO1xuICB9XG5cbiAgX3BhcnNlTnVtYmVyT2ZJbnN0cnVtZW50cyhhYikge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlclV0aWxzLkludEZyb21DV29yZChhYi5zbGljZSg3MiwgNzQpKTtcbiAgfVxuXG4gIF9wYXJzZUZyZXF1ZW5jeVRhYmxlKGFiKSB7XG4gICAgLy8gMCBpcyBBbWlnYSBhbmQgMSBpcyBsaW5lYXJcbiAgICB2YXIgYXJyYXkgPSBuZXcgVWludDhBcnJheShhYi5zbGljZSg3NCwgNzYpKTtcbiAgICByZXR1cm4gYXJyYXlbMF07XG4gIH1cblxuICBfcGFyc2VEZWZhdWx0VGVtcG8oYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5JbnRGcm9tQ1dvcmQoYWIuc2xpY2UoNzYsIDc4KSk7XG4gIH1cblxuICBfcGFyc2VEZWZhdWx0QlBNKGFiKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyVXRpbHMuSW50RnJvbUNXb3JkKGFiLnNsaWNlKDc4LCA4MCkpO1xuICB9XG5cbiAgX3BhcnNlUGF0dGVybk9yZGVyVGFibGUoYWIpIHtcbiAgICB2YXIgb3JkZXJUYWJsZSA9IG5ldyBJbnQ4QXJyYXkoYWIuc2xpY2UoODAsIDMzNikpO1xuICAgIHJldHVybiBvcmRlclRhYmxlO1xuICB9XG59XG4iLCIvKlxuICogdGhpcyBmaWxlIGNvbnRhaW5zIGEgWE0gc2luZ2xlIHBhdHRlcm4uLi4uXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFN0cnVjdHVyZSBmb3JtYXRzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiA/ICAgICAgNCAgICAoZHdvcmQpIFBhdHRlcm4gaGVhZGVyIGxlbmd0aFxuICogKzQgICAgICAxICAgKGJ5dGUpIFBhY2tpbmcgdHlwZSAoYWx3YXlzIDApXG4gKiArNSAgICAgIDIgICAod29yZCkgTnVtYmVyIG9mIHJvd3MgaW4gcGF0dGVybiAoMS4uMjU2KVxuICogKzcgICAgICAyICAgKHdvcmQpIFBhY2tlZCBwYXR0ZXJuZGF0YSBzaXplXG4gKiA/ICAgICAgPyAgICBQYWNrZWQgcGF0dGVybiBkYXRhXG4gKlxuICogTm90ZSB0aGF0IGlmIHRoZSBNb2R1bGUgdXNlcyBhIHRvdGFsbHkgZW1wdHkgcGF0dGVybiwgdGhpcyBwYXR0ZXJuXG4gKiBpcyAqTk9UKiBzdG9yZWQgaW4gdGhlIFhNOyBpbiBvdGhlciB3b3JkcywgeW91IG5lZWQgdG8gY3JlYXRlIGFuIGVtcHR5XG4gKiBwYXR0ZXJuIGlmIHRoZSBtb2R1bGUgbmVlZHMgb25lLlxuICogSW4gZmFjdCwgdG8gYmUgc2F2ZSwgeW91J2xsIGFsd2F5cyBoYXZlIHRvIGNyZWF0ZSBhIFwic3RhbmRhcmRcIiBlbXB0eVxuICogcGF0dGVybjogYWxsb2NhdGUgNjQqKG5yIG9mIGNoYW5uZWxzKSBieXRlcyBhbmQgc2V0IHRoZW0gdG8gdmFsdWUgJDgwXG4gKiAoMTI4IGRlYykuIEluaXRpYWxpc2UgdGhlIGhlYWRlciBvZiB0aGlzIHBhdHRlcm4gd2l0aCB0aGUgc3RhbmRhcmRcbiAqIHZhbHVlczpcbiAqICAgcGF0dGVybiBoZWFkZXIgbGVuZ3RoICAgICA9IDlcbiAqICAgUGFja2luZyB0eXBlICAgICAgICAgICAgICA9IDBcbiAqICAgTnVtYmVyIG9mIHJvd3MgaW4gcGF0dGVybiA9IDY0XG4gKiAgIFBhY2tlZCBwYXR0ZXJuZGF0YSBzaXplICAgPSA2NCoobnIgb2YgY2hhbm5lbHMpXG4gKlxuICogSWYgdGhlIGZpZWxkIFwiUGFja2VkIHBhdHRlcm5kYXRhIHNpemVcIiBpcyBzZXQgdG8gMCwgdGhlIHBhdHRlcm4gaXMgTk9UXG4gKiBzdG9yZWQgaW4gdGhlIGZpbGUgYnV0IGl0IE1BWSBiZSB1c2VkIGJ5IHRoZSBzb25nLlxuICogQWxzbyBub3RlIHRoYXQgd2hlbmV2ZXIgYSBwYXR0ZXJuIG5yIGluIHRoZSBwYXR0ZXJuIHNlcXVlbmNlIHRhYmxlIGlzXG4gKiBoaWdoZXIgdGhhbiB0aGUgbnIgb2YgcGF0dGVybnMgKGNvbW1vbiBmb3IgY29udmVydGVkIFMzTSdzKSwgeW91IHNob3VsZFxuICogcGxheSB0aGUgc3RhbmRhcmQgZW1wdHkgcGF0dGVybi5cbiAqXG4qXG4gKi9cblxuaW1wb3J0IHsgQXJyYXlCdWZmZXJVdGlscyB9IGZyb20gJy4vLi4vdXRpbHMvQXJyYXlCdWZmZXJVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBYTVBhdHRlcm4ge1xuICBjb25zdHJ1Y3RvcihhcnJheUJ1ZmZlciwgb2Zmc2V0KSB7XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgdGhpcy5wYXR0ZXJuSGVhZGVyTGVuZ3RoID0gdGhpcy5fcGFyc2VQYXR0ZXJuSGVhZGVyTGVuZ3RoKGFycmF5QnVmZmVyKTtcbiAgICB0aGlzLnBhY2tpbmdUeXBlID0gdGhpcy5fcGFyc2VQYWNraW5nVHlwZShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5udW1iZXJPZlJvd3MgPSB0aGlzLl9wYXJzZU51bWJlck9mUm93cyhhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5wYWNrZWRQYXR0ZXJuRGF0YVNpemUgPSB0aGlzLl9wYXJzZVBhY2tlZFBhdHRlcm5EYXRhU2l6ZShhcnJheUJ1ZmZlcik7XG4gICAgdGhpcy5wYXR0ZXJuRGF0YSA9IHRoaXMuX3BhcnNlUGF0dGVybkRhdGEoYXJyYXlCdWZmZXIpO1xuICB9XG5cbiAgX3BhcnNlUGF0dGVybkhlYWRlckxlbmd0aChhYikge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlclV0aWxzLkludEZyb21DRFdvcmQoYWIuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMub2Zmc2V0ICsgNCkpO1xuICB9XG5cbiAgX3BhcnNlUGFja2luZ1R5cGUoYWIpIHtcbiAgICB2YXIgcGFyc2VkVmFsdWUgPSBuZXcgSW50OEFycmF5KGFiLnNsaWNlKHRoaXMub2Zmc2V0ICsgNCwgdGhpcy5vZmZzZXQgKyA0ICsgMSkpWzBdO1xuICAgIGlmIChwYXJzZWRWYWx1ZSAhPT0gMClcbiAgICAgIHRocm93IFwiUGFja2luZyB0eXBlIHNob3VsZCBhbHdheXMgYmUgMCFcIjtcbiAgICByZXR1cm4gcGFyc2VkVmFsdWU7XG4gIH1cblxuICBfcGFyc2VOdW1iZXJPZlJvd3MoYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5JbnRGcm9tQ1dvcmQoYWIuc2xpY2UodGhpcy5vZmZzZXQgKyA1LCB0aGlzLm9mZnNldCArIDUgKyAyKSk7XG4gIH1cblxuICBfcGFyc2VQYWNrZWRQYXR0ZXJuRGF0YVNpemUoYWIpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXJVdGlscy5JbnRGcm9tQ1dvcmQoYWIuc2xpY2UodGhpcy5vZmZzZXQgKyA3LCB0aGlzLm9mZnNldCArIDcgKyAyKSk7XG4gIH1cblxuICBfcGFyc2VQYXR0ZXJuRGF0YShhYikge1xuICAgIGlmICh0aGlzLnBhY2tlZFBhdHRlcm5EYXRhU2l6ZSAhPT0gMCkgeyAvLyBBdCAwIG5vIHBhdHRlcm4gZGF0YSBpcyBwcmVzZW50Li4uLlxuICAgICAgZGVidWdnZXI7XG4gICAgICB0aHJvdyBcIk5PVCBJTVBMRU1FTlRFRCBZRVQhIVwiO1xuICAgIH1cbiAgfVxufVxuXG4iLCIvKlxuICogQ29uc3RhaW5zIGFsbCB0aGUgcGF0dGVybnMgb2YgdGhlIFhNIEZpbGVcbiAqL1xuXG5pbXBvcnQgeyBBcnJheUJ1ZmZlclV0aWxzIH0gZnJvbSAnLi8uLi91dGlscy9BcnJheUJ1ZmZlclV0aWxzJztcbmltcG9ydCB7IFhNUGF0dGVybiB9IGZyb20gJy4vWE1QYXR0ZXJuJztcblxuZXhwb3J0IGNsYXNzIFhNUGF0dGVybnMge1xuICBjb25zdHJ1Y3RvcihudW1iZXJPZlBhdHRlcm5zLCBhcnJheUJ1ZmZlcikge1xuICAgIHRoaXMubVBhdHRlcm4gPSBbXTtcbiAgICB0aGlzLmJhc2VPZmZzZXQgPSAzMzY7XG4gICAgdGhpcy5wYXR0ZXJuc09mZnNldCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1iZXJPZlBhdHRlcm5zOyArK2kpIHtcbiAgICAgIHZhciBvZmZzZXQgPSAgdGhpcy5iYXNlT2Zmc2V0ICsgdGhpcy5wYXR0ZXJuc09mZnNldDtcbiAgICAgIHZhciBwYXR0ZXJuID0gbmV3IFhNUGF0dGVybihhcnJheUJ1ZmZlciwgb2Zmc2V0KTsgIFxuICAgICAgdGhpcy5wYXR0ZXJuc09mZnNldCArPSBwYXR0ZXJuLnBhdHRlcm5IZWFkZXJMZW5ndGg7XG4gICAgICBtUGF0dGVybiArPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxufVxuIiwiLypcbiAqXG4gKiBMaWJKc1RyYWNrZXIgaXMgYSBsaWJyYXJ5IHRvIHBsYXkgb2xkIGNoaXB0dW5lcyBmb3JtYXRzXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUgIE1hdGhpZXUgUmhlYXVtZSA8bWF0aGlldUBjb2RpbmdyaGVtZXMuY29tPlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RGcmVxdWVuY3kge1xuICBzdGF0aWMgQ29tcHV0ZVBlcmlvZCgpIHsgdGhyb3cgXCJORUVEUyBPVkVSUklERVwiOyB9XG4gIHN0YXRpYyBDb21wdXRlRnJlcXVlbmN5KCkgeyB0aHJvdyBcIk5FRURTIE9WRVJSSURFXCI7IH1cbn1cbiIsIi8qXG4gKlxuICogTGliSnNUcmFja2VyIGlzIGEgbGlicmFyeSB0byBwbGF5IG9sZCBjaGlwdHVuZXMgZm9ybWF0c1xuICogQ29weXJpZ2h0IChDKSAyMDE1ICBNYXRoaWV1IFJoZWF1bWUgPG1hdGhpZXVAY29kaW5ncmhlbWVzLmNvbT5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqL1xuaW1wb3J0IHsgQWJzdHJhY3RGcmVxdWVuY3kgfSBmcm9tICcuL0Fic3RyYWN0RnJlcXVlbmN5JztcbmV4cG9ydCBjbGFzcyBBbWlnYUZyZXF1ZW5jeVRhYmxlIGV4dGVuZHMgQWJzdHJhY3RGcmVxdWVuY3kge1xuICBzdGF0aWMgQ29tcHV0ZVBlcmlvZCgpIHtcbiAgICAvKiBUT0RPOiBJTVBMRU1FTlQgSVQgVVNJTkcgXG4gICAgICogIFBlcmlvZCA9IChQZXJpb2RUYWJbKE5vdGUgTU9EIDEyKSo4ICsgRmluZVR1bmUvMTZdKigxLUZyYWMoRmluZVR1bmUvMTYpKSArXG4gICAgICogICAgICAgICAgICAgIFBlcmlvZFRhYlsoTm90ZSBNT0QgMTIpKjggKyBGaW5lVHVuZS8xNl0qKEZyYWMoRmluZVR1bmUvMTYpKSlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgKjE2LzJeKE5vdGUgRElWIDEyKTtcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFRoZSBwZXJpb2QgaXMgaW50ZXJwb2xhdGVkIGZvciBmaW5lciBmaW5ldHVuZSB2YWx1ZXMpXG4gICAgICpcbiAgICAgKlxuICAgICAqIFBlcmlvZFRhYiA9IEFycmF5WzAuLjEyKjgtMV0gb2YgV29yZCA9IChcbiAgICAgKiAgOTA3LDkwMCw4OTQsODg3LDg4MSw4NzUsODY4LDg2Miw4NTYsODUwLDg0NCw4MzgsODMyLDgyNiw4MjAsODE0LFxuICAgICAqICA4MDgsODAyLDc5Niw3OTEsNzg1LDc3OSw3NzQsNzY4LDc2Miw3NTcsNzUyLDc0Niw3NDEsNzM2LDczMCw3MjUsXG4gICAgICogIDcyMCw3MTUsNzA5LDcwNCw2OTksNjk0LDY4OSw2ODQsNjc4LDY3NSw2NzAsNjY1LDY2MCw2NTUsNjUxLDY0NixcbiAgICAgKiAgNjQwLDYzNiw2MzIsNjI4LDYyMyw2MTksNjE0LDYxMCw2MDQsNjAxLDU5Nyw1OTIsNTg4LDU4NCw1ODAsNTc1LFxuICAgICAqICA1NzAsNTY3LDU2Myw1NTksNTU1LDU1MSw1NDcsNTQzLDUzOCw1MzUsNTMyLDUyOCw1MjQsNTIwLDUxNiw1MTMsXG4gICAgICogIDUwOCw1MDUsNTAyLDQ5OCw0OTQsNDkxLDQ4Nyw0ODQsNDgwLDQ3Nyw0NzQsNDcwLDQ2Nyw0NjMsNDYwLDQ1Nyk7XG4gICAgICovXG4gICAgdGhyb3cgXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIH1cblxuICBzdGF0aWMgQ29tcHV0ZUZyZXF1ZW5jeSgpIHtcbiAgICAvL1RPRE86IElNUExFTUVOVCBJVFxuICAgIC8vRnJlcXVlbmN5ID0gODM2MyoxNzEyL1BlcmlvZDtcbiAgICB0aHJvdyBcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgfVxufVxuIiwiLyogXG4gKiBMaWJKc1RyYWNrZXIgaXMgYSBsaWJyYXJ5IHRvIHBsYXkgb2xkIGNoaXB0dW5lcyBmb3JtYXRzXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUgIE1hdGhpZXUgUmhlYXVtZSA8bWF0aGlldUBjb2RpbmdyaGVtZXMuY29tPlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cbmltcG9ydCB7IEFic3RyYWN0RnJlcXVlbmN5IH0gZnJvbSAnLi9BYnN0cmFjdEZyZXF1ZW5jeSc7XG5leHBvcnQgY2xhc3MgTGluZWFyRnJlcXVlbmN5VGFibGUgZXh0ZW5kcyBBYnN0cmFjdEZyZXF1ZW5jeSB7XG4gIHN0YXRpYyBDb21wdXRlUGVyaW9kKCkge1xuICAgIC8vIFRPRE86IElNUExFTUVOVCBJVCBVU0lORyBcbiAgICAvLyAgUGVyaW9kID0gMTAqMTIqMTYqNCAtIE5vdGUqMTYqNCAtIEZpbmVUdW5lLzI7XG4gICAgdGhyb3cgXCJOb3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIH1cblxuICBzdGF0aWMgQ29tcHV0ZUZyZXF1ZW5jeSgpIHtcbiAgICAvL1RPRE86IElNUExFTUVOVCBJVFxuICAgIC8vICAgICBGcmVxdWVuY3kgPSA4MzYzKjJeKCg2KjEyKjE2KjQgLSBQZXJpb2QpIC8gKDEyKjE2KjQpKTtcbiAgICB0aHJvdyBcIk5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgfVxufVxuIiwiLypcbiAqXG4gKiBUaGlzIGlzIHBsYXllciBjb2RlIG1vc3RseSB0byB0ZXN0IGFzIG9mIGN1cnJlbnRseVxuICogQ29weXJpZ2h0IChDKSAyMDE1ICBNYXRoaWV1IFJoZWF1bWUgPG1hdGhpZXVAY29kaW5ncmhlbWVzLmNvbT5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICpcbiAqL1xuaW1wb3J0IHsgWE1HZW5lcmFsSGVhZGVyIH0gZnJvbSAnLi9tb2R1bGVzL3htL1hNR2VuZXJhbEhlYWRlcic7XG5pbXBvcnQgeyBYTVBhdHRlcm5zIH0gZnJvbSAnLi9tb2R1bGVzL3htL1hNUGF0dGVybnMnO1xuXG5jb25zb2xlLmxvZyhcIkhpIFdvcmxkICEgXCIpO1xuXG52YXIgb1JlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xub1JlcS5vcGVuKFwiR0VUXCIsIFwiYWdlLnhtXCIsIHRydWUpO1xub1JlcS5yZXNwb25zZVR5cGUgPSBcImFycmF5YnVmZmVyXCI7XG5cbm9SZXEub25sb2FkID0gZnVuY3Rpb24gKG9FdmVudCkge1xuICB2YXIgYXJyYXlCdWZmZXIgPSBvUmVxLnJlc3BvbnNlOyAvLyBOb3RlOiBub3Qgb1JlcS5yZXNwb25zZVRleHRcbiAgaWYgKGFycmF5QnVmZmVyKSB7XG4gICAgdmFyIGJsb2IgPSBvUmVxLnJlc3BvbnNlO1xuICAgIHZhciB4bV9oZWFkZXJzID0gbmV3IFhNR2VuZXJhbEhlYWRlcihibG9iKTtcbiAgICB2YXIgeG1fcGF0dGVybnMgPSBuZXcgWE1QYXR0ZXJucyh4bV9oZWFkZXJzLm51bWJlck9mUGF0dGVybnMsIGJsb2IpO1xuICAgIGRlYnVnZ2VyO1xuICB9XG59O1xuXG5vUmVxLnNlbmQobnVsbCk7XG4iXX0=
