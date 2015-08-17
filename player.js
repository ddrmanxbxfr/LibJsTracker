/*
 * This is player code mostly to test as of currently
 */
import { XMGeneralHeader } from './modules/xm/GeneralHeader';

console.log("Hi World ! ");

var oReq = new XMLHttpRequest();
oReq.open("GET", "age.xm", true);
oReq.responseType = "arraybuffer";

oReq.onload = function (oEvent) {
  var arrayBuffer = oReq.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    var blob = oReq.response;
    var xm_headers = new XMGeneralHeader(blob);
    debugger;
  }
};

oReq.send(null);
