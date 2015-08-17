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
import { ArrayBufferUtils } from './../utils/ArrayBufferUtils';
import { AmigaFrequencyTable } from './AmigaFrequencyTable';
import { LinearFrequencyTable } from './LinearFrequencyTable';

export class XMGeneralHeader {
  constructor(arrayBuffer) {
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

  FrequencyTable() {
    // TODO: Not Tested Yet
    // Should give good object
    if (this.frequencyTable == 0) {
      return AmigaFrequencyTable;
    } else {
      return LinearFrequencyTable;
    }
  }

  _parseIDText(ab) {
    var moduleName = ab.slice(0, 17);
    var parsed = ArrayBufferUtils.StringFromCChar(moduleName);
    if (parsed.substr(0,16) === "Extended Module:")
      return parsed;
    else
      throw "Invalid XM File";
  }

  _parseModuleName(ab) {
    return ArrayBufferUtils.StringFromCChar(ab.slice(17, 37));
  }

  _parse$1a(ab) {
    return ArrayBufferUtils.StringFromCChar(ab.slice(37, 1));
  }

  _parseTrackerName(ab) {
    return ArrayBufferUtils.StringFromCChar(ab.slice(38, 58));
  }

  _parseVersionNumber(ab) {
    return ArrayBufferUtils.StringFromCWord(ab.slice(58, 60));
  }

  _parseHeaderSize(ab) {
    return ArrayBufferUtils.IntFromCDWord(ab.slice(60, 64));
  }

  _parseSongLength(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(64, 66));
  }

  _parseRestartPosition(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(66, 68));
  }

  _parseNumberOfChannels(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(68, 70));
  }

  _parseNumberOfPatterns(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(70, 72));
  }

  _parseNumberOfInstruments(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(72, 74));
  }

  _parseFrequencyTable(ab) {
    // 0 is Amiga and 1 is linear
    var array = new Uint8Array(ab.slice(74, 76));
    return array[0];
  }

  _parseDefaultTempo(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(76, 78));
  }

  _parseDefaultBPM(ab) {
    return ArrayBufferUtils.IntFromCWord(ab.slice(78, 80));
  }

  _parsePatternOrderTable(ab) {
    var orderTable = new Int8Array(ab.slice(80, 336));
    return orderTable;
  }
}
