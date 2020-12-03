import { Brand, make } from "ts-brand";
import Knex from "knex";
import { InferType } from "yup";
import * as yup from "yup";
import { BatchInfo } from "../generated/graphql";
import { safeParse, safeDecode } from "./utils";

const BatchCertificateSchema = yup
  .object()
  .shape({
    sig: yup.string().required(),
    info: yup.string().required(),
  })
  .required();

export type BatchCertificate = InferType<typeof BatchCertificateSchema>;

const batchInfoInSchema = yup
  .object({
    vaccine: yup.string().required(),
    batchId: yup.string().required(),
    doses: yup.number().required(),
  })
  .required();

export type BatchInfoIn = InferType<typeof batchInfoInSchema>;

function validateObject<T extends object>(
  schema: yup.ObjectSchema<T, object>,
  obj: object | null
): null | T {
  try {
    return obj && schema.validateSync(obj);
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      return null;
    }
    throw e;
  }
}

const extractBatchCertificate = (s: string): BatchCertificate | null =>
  validateObject(BatchCertificateSchema, safeParse(safeDecode(s)));

const verifyBatchCertificate = (
  bs: BatchCertificate | null
): BatchCertificate | null => bs; // TODO: check sig!

export const verifyBatchInfo = (s: string): BatchInfoIn | null => {
  const bs = verifyBatchCertificate(extractBatchCertificate(s));
  return bs && validateObject(batchInfoInSchema, JSON.parse(bs.info));
};

export interface BatchInfoRow {
  uid: Brand<string, BatchInfoRow>;
  vaccine: string;
  batch_id: string;
  doses: number;
  doses_remaining: number;
  created_at: string;
}

export type BatchInfoUid = BatchInfoRow["uid"];

type BatchTokenRow = {
  uid: Brand<string, BatchTokenRow>;
  batch_info_uid: BatchInfoUid;
  ip: string;
  phone?: string;
  created_at: string;
};

export type BatchTokenUid = BatchTokenRow["uid"];
export const BatchTokenUid = make<BatchTokenUid>();

export const upsertBatchInfo = async (
  knex: Knex,
  { vaccine, batchId, doses }: BatchInfoIn
) => {
  const [bi] = await knex("batch_infos")
    .insert({ vaccine, batch_id: batchId, doses, doses_remaining: doses })
    .onConflict(["vaccine", "batch_id"])
    .ignore()
    .returning<BatchInfoRow[]>("*");

  if (bi) {
    return bi;
  }
  const [bn] = await knex
    .select<BatchInfoRow[]>("*")
    .from("batch_infos")
    .where({ vaccine, batch_id: batchId });
  return bn;
};

export const insertBatchToken = async (
  knex: Knex,
  { uid }: BatchInfoRow,
  ip: string,
  phone: string | null
) => {
  const [bt] = await knex("batch_tokens")
    .insert({ batch_info_uid: uid, ip, phone })
    .returning<BatchTokenRow[]>("*");

  return bt;
};

export const exportBatchInfoRow = ({
  uid,
  vaccine,
  batch_id,
  doses_remaining,
}: BatchInfoRow): BatchInfo => {
  return {
    uid,
    vaccine,
    batchId: batch_id,
    dosesRemaining: doses_remaining,
  };
};

const makeTokenSubquery = (knex: Knex, uid: string) =>
  knex.select("batch_info_uid").from("batch_tokens").where({ uid });

export const decrementBatchCount = async (
  knex: Knex,
  token: BatchTokenUid
): Promise<BatchInfoRow | undefined> => {
  const subquery = makeTokenSubquery(knex, token);

  const [bi] = await knex("batch_infos")
    .whereIn("uid", subquery)
    .where("doses_remaining", ">", 1)
    .update({ doses_remaining: knex.raw("doses_remaining - 1") })
    .returning<BatchInfoRow[]>("*");
  return bi;
};

export const fetchBatchInfo = (knex: Knex, where: Partial<BatchInfoRow>) => {
  return knex("batch_infos").select<BatchInfoRow[]>("*").where(where).first();
};
