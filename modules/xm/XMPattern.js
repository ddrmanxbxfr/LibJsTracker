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

import { ArrayBufferUtils } from './../utils/ArrayBufferUtils';

export class XMPattern {
  constructor(arrayBuffer, offset) {
    this.offset = offset;
    this.patternHeaderLength = this._parsePatternHeaderLength(arrayBuffer);
    this.packingType = this._parsePackingType(arrayBuffer);
    this.numberOfRows = this._parseNumberOfRows(arrayBuffer);
    this.packedPatternDataSize = this._parsePackedPatternDataSize(arrayBuffer);
    this.patternData = this._parsePatternData(arrayBuffer);
  }

  _parsePatternHeaderLength(ab) {
    return ArrayBufferUtils.IntFromCDWord(ab.slice(this.offset, this.offset + 4));
  }

  _parsePackingType(ab) {
    var parsedValue = new Int8Array(ab.slice(this.offset + 4, this.offset + 4 + 1))[0];
    if (parsedValue !== 0)
      throw "Packing type should always be 0!";
    return parsedValue;
  }

  _parseNumberOfRows(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(this.offset + 5, this.offset + 5 + 2));
  }

  _parsePackedPatternDataSize(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(this.offset + 7, this.offset + 7 + 2));
  }

  _parsePatternData(ab) {
    if (this.packedPatternDataSize !== 0) { // At 0 no pattern data is present....
      debugger;
      throw "NOT IMPLEMENTED YET!!";
    }
  }
}

