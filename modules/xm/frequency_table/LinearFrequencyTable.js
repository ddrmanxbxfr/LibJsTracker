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
import { AbstractFrequency } from './AbstractFrequency';
export class LinearFrequencyTable extends AbstractFrequency {
  static ComputePeriod() {
    // TODO: IMPLEMENT IT USING 
    //  Period = 10*12*16*4 - Note*16*4 - FineTune/2;
    throw "Not implemented yet";
  }

  static ComputeFrequency() {
    //TODO: IMPLEMENT IT
    //     Frequency = 8363*2^((6*12*16*4 - Period) / (12*16*4));
    throw "Not implemented yet";
  }
}
