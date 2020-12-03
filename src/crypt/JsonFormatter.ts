import * as Crypto from "crypto-js";

const JsonFormatter = {
  stringify: (cipherParams: Crypto.lib.CipherParams) => {
    // create json object with ciphertext
    const ciphertext = {
      ct: cipherParams.ciphertext.toString(Crypto.enc.Base64),
    };
    // optionally add iv or salt
    const iv = cipherParams.iv ? { iv: cipherParams.iv.toString() } : {};
    const salt = cipherParams.salt ? { s: cipherParams.salt.toString() } : {};

    // stringify json object
    return JSON.stringify(Object.assign({}, ciphertext, iv, salt));
  },
  parse: (jsonStr: string) => {
    // parse json string
    const jsonObj = JSON.parse(jsonStr);
    // extract ciphertext from json object, and create cipher params object
    const cipherParams = Crypto.lib.CipherParams.create({
      ciphertext: Crypto.enc.Base64.parse(jsonObj.ct),
    });
    // optionally extract iv or salt
    if (jsonObj.iv) {
      cipherParams.iv = Crypto.enc.Hex.parse(jsonObj.iv);
    }
    if (jsonObj.s) {
      cipherParams.salt = Crypto.enc.Hex.parse(jsonObj.s);
    }
    return cipherParams;
  },
};

export default JsonFormatter;
