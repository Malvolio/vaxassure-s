import { IncomingHttpHeaders } from "http";
import {
  MutationResolvers,
  MutationCreateBatchTokenArgs,
  BatchTokenReturn,
  MutationActivatePassportArgs,
  ActivatePassportReturn,
  MutationCompleteActivationArgs,
  ActivationCompletionReturn,
} from "../generated/graphql";
import {
  ActivationUid,
  generateHeadshotUrl,
  generateInfoUrl,
  insertActivation,
  isPassportId,
  updateDirectory,
} from "../tasks/Activation";
import {
  verifyBatchInfo,
  upsertBatchInfo,
  insertBatchToken,
  exportBatchInfoRow,
  decrementBatchCount,
  BatchTokenUid,
} from "../tasks/BatchInfo";
import getKnex from "../tasks/getKnex";

const badReturn = (result: string) => ({ result });

export type Context = {
  headers?: IncomingHttpHeaders;
  ip?: string;
};
async function createBatchToken(
  _: unknown,
  { batchCertificate, phone }: MutationCreateBatchTokenArgs,
  { ip }: Context
): Promise<BatchTokenReturn> {
  const batchInfo = verifyBatchInfo(batchCertificate);
  if (!batchInfo) {
    return badReturn("bad-certificate");
  }
  const knex = getKnex();
  return knex.transaction(async (txn) => {
    const batchInfoRow = await upsertBatchInfo(txn, batchInfo);
    const batchTokenRow = await insertBatchToken(
      txn,
      batchInfoRow,
      ip || "",
      phone ?? null
    );
    if (!batchTokenRow) {
      return badReturn("batch-exhausted");
    }
    return Promise.resolve({
      token: batchTokenRow.uid,
      result: "success",
      batchInfo: exportBatchInfoRow(batchInfoRow),
    });
  });
}

async function activatePassport(
  _: unknown,
  { token, passportId }: MutationActivatePassportArgs,
  { ip }: Context
): Promise<ActivatePassportReturn> {
  if (!isPassportId(passportId)) {
    return badReturn("bad-passport-id");
  }
  const knex = getKnex();
  const tokenUid = BatchTokenUid(token);
  return knex.transaction(async (txn) => {
    const batchInfoRow = await decrementBatchCount(knex, tokenUid);
    if (!batchInfoRow) {
      return badReturn("bad-token");
    }
    const activationRow = await insertActivation(
      txn,
      batchInfoRow.uid,
      tokenUid,
      passportId,
      ip ?? ""
    );

    if (!activationRow) {
      return badReturn("unknown-failure");
    }

    const { uid: activationId } = activationRow;

    const headshotURL = await generateInfoUrl(passportId, activationId);
    const infoURL = await generateHeadshotUrl(passportId, activationId);

    if (!headshotURL || !infoURL) {
      return badReturn("unknown-failure");
    }

    return {
      result: "success",
      batchInfo: exportBatchInfoRow(batchInfoRow),
      headshotURL,
      infoURL,
      activationId,
    };
  });
}

async function completeActivation(
  _: unknown,
  { activationId }: MutationCompleteActivationArgs
): Promise<ActivationCompletionReturn> {
  if (!activationId) {
    return badReturn("bad-activation-id");
  }
  const knex = getKnex();
  const activationUid = ActivationUid(activationId);
  const success = knex.transaction((txn) =>
    updateDirectory(txn, activationUid)
  );
  if (!success) {
    return badReturn("unknown-failure");
  }
  return {
    result: "success",
  };
}
const Mutation: MutationResolvers = {
  createBatchToken,
  activatePassport,
  completeActivation,
};
const resolvers = {
  Mutation,
};

export default resolvers;
