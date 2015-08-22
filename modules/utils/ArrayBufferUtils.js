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
export class ArrayBufferUtils {
  static StringFromCChar(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  } 

  static StringFromCWord(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  static IntFromCWord(buf) {
    if (buf.byteLength !== 2)
      throw "C Word is 2 bytes long";
    return new Uint16Array(buf)[0];
  }

  static IntFromCDWord(buf) {
    if (buf.byteLength !== 4)
      throw "DWord is 4 bytes long";
    return new Uint32Array(buf)[0];
  }
}

