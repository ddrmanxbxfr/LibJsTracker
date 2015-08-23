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

