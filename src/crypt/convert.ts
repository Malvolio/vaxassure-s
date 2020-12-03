import * as Crypto from "crypto-js";

export function convertWordArrayToUint8Array(wordArray: Crypto.lib.WordArray) {
  const l = wordArray.sigBytes;
  const words = wordArray.words;
  const result = new Uint8Array(l);
  let i = 0 /*dst*/,
    j = 0; /*src*/
  while (true) {
    // here i is a multiple of 4
    if (i == l) break;
    var w = words[j++];
    result[i++] = (w & 0xff000000) >>> 24;
    if (i == l) break;
    result[i++] = (w & 0x00ff0000) >>> 16;
    if (i == l) break;
    result[i++] = (w & 0x0000ff00) >>> 8;
    if (i == l) break;
    result[i++] = w & 0x000000ff;
  }
  return result;
}

export function convertUint8ArrayToWordArray(
  u8Array: Uint8Array
): Crypto.lib.WordArray {
  var words = [],
    i = 0,
    len = u8Array.length;

  while (i < len) {
    words.push(
      (u8Array[i++] << 24) |
        (u8Array[i++] << 16) |
        (u8Array[i++] << 8) |
        u8Array[i++]
    );
  }

  return Crypto.lib.WordArray.create(words, len);
}
