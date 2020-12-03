import * as fs from "fs";
import * as Crypto from "crypto-js";
import JsonFormatter from "./JsonFormatter";
import {
  convertUint8ArrayToWordArray,
  convertWordArrayToUint8Array,
} from "./convert";
const readFile = async (filename: string) =>
  new Promise<Uint8Array>((resolve, reject) => {
    fs.readFile(filename, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
const writeFile = async (filename: string, data: string | Uint8Array) =>
  new Promise<void>((resolve, reject) => {
    fs.writeFile(filename, data, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const readEncryptedFile = async (filename: string, password: string) => {
  const b = await readFile(filename);
  const contents = Crypto.AES.decrypt(b.toString(), password, {
    format: JsonFormatter,
  });
  return convertWordArrayToUint8Array(contents);
};

const writeEncryptedFile = (
  filename: string,
  password: string,
  data: Uint8Array
) => {
  const waFile = convertUint8ArrayToWordArray(data);
  const enFile = Crypto.AES.encrypt(waFile, password, {
    format: JsonFormatter,
  });
  return writeFile(filename, enFile.toString());
};

export { readFile, writeFile, readEncryptedFile, writeEncryptedFile };
