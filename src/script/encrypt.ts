import {
  readEncryptedFile,
  readFile,
  writeEncryptedFile,
  writeFile,
} from "../crypt/io";

const encryptExec = async (args: string[]) => {
  const [fromFile, toFile, password] = args;

  try {
    const contents = await readFile(fromFile);
    await writeEncryptedFile(toFile, password, contents);
  } catch (e) {
    console.error(e);
  }
};

const decryptExec = async (args: string[]) => {
  const [fromFile, toFile, password] = args;
  try {
    const contents = await readEncryptedFile(fromFile, password);
    await writeFile(toFile, contents);
  } catch (e) {
    console.error(e);
  }
};

const [, , command, ...args] = process.argv;

if (command === "encrypt") {
  encryptExec(args);
}

if (command === "decrypt") {
  decryptExec(args);
}
