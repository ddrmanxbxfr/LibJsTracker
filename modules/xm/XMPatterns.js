/*
 * Constains all the patterns of the XM File
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
