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

