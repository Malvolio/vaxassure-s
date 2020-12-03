import { Base64 } from "js-base64";
import { BatchCertificate, BatchInfoIn } from "../tasks/BatchInfo";
const [, , batchId] = process.argv;

const batchInfo: BatchInfoIn = {
  vaccine: "pft01",
  batchId,
  doses: 1000,
};

const batchCertificate: BatchCertificate = {
  info: JSON.stringify(batchInfo),
  sig: "unsigned",
};

const summary = Base64.encode(JSON.stringify(batchCertificate));

console.log(`The cert summary for ${batchId} is ${summary}`);
