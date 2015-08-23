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
import { XMGeneralHeader } from './modules/xm/XMGeneralHeader';
import { XMPatterns } from './modules/xm/XMPatterns';

console.log("Hi World ! ");

var oReq = new XMLHttpRequest();
oReq.open("GET", "age.xm", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var blob = oReq.response;
    var xm_headers = new XMGeneralHeader(blob);
    var xm_patterns = new XMPatterns(xm_headers.numberOfPatterns, blob);
    debugger;
  }
};

oReq.send(null);
