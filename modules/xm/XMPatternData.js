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
 * -------------------------------------------------------------------------
 * Pattern DATA 
 * -------------------------------------------------------------------------
 *
 * The patterns are stored as ordinary MOD patterns, except that each
 * note is stored as 5 bytes:
 *
 * ?      1   (byte) Note (1-96, 1 = C-0)
 * +1      1   (byte) Instrument (1-128)
 * +2      1   (byte) Volume column byte (see below)
 * +3      1   (byte) Effect type
 * +4      1   (byte) Effect parameter
 *
 * (When Note = 97, a "key off" command occurs).
 *
 * A simple packing scheme is also adopted, so that the patterns not become
 * TOO large: Since the MSB in the note value is never used, if is used for
 * the compression. If the bit is set, then the other bits are interpreted
 * as follows:
 *
 * bit 0 set: Note follows
 * 1 set: Instrument follows
 * 2 set: Volume column byte follows
 * 3 set: Effect type follows
 * 4 set: Guess what!
 *
 * It is very simple, but far from optimal. If you want a better,
 * you can always repack the patterns in your loader.
 *
 * XM patterns are stored as following:
 *
 * - A pattern is a sequence of lines.
 * - A line is a sequence of notes.
 * - a note is stored as described above.
 */

import { ArrayBufferUtils } from './../utils/ArrayBufferUtils';

export class XMPatternData {
  constructor(arrayBuffer, offset) {
    this.dataSize = 0;
  }





}
 
