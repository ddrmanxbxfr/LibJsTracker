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
 * Constains all the patterns of the XM File
 *
 */

import { ArrayBufferUtils } from './../utils/ArrayBufferUtils';
import { XMPattern } from './XMPattern';

export class XMPatterns {
  constructor(numberOfPatterns, arrayBuffer) {
    this.mPattern = [];
    this.baseOffset = 336;
    this.patternsOffset = 0;
    for (var i = 0; i < numberOfPatterns; ++i) {
      var offset =  this.baseOffset + this.patternsOffset;
      var pattern = new XMPattern(arrayBuffer, offset);  
      this.patternsOffset += pattern.patternHeaderLength;
      mPattern += pattern;
    }
  }
}
