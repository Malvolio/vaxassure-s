import { Nominal } from "simplytyped";
import AWS from "aws-sdk";
import Knex from "knex";
import { BatchInfoUid, BatchTokenUid, fetchBatchInfo } from "./BatchInfo";
import { safeParse } from "./utils";
import { PassportDirectory, PassportId } from "../shared/Passport";

export function isPassportId(s: string): s is PassportId {
  return !!/[0-9a-z]{10,}/i.exec(s);
}

const s3 = new AWS.S3();
const Bucket = "vaxassure-test-data";

const pathFrom = (s: string) => s.match(/..?/g)!.join("/");

const generateUrl = (suffix: string) => (
  passportId: PassportId,
  activationId: string
) => {
  const Key = `${pathFrom(passportId)}/${activationId}.${suffix}`;
  const Expires = 60 * 20;
  return new Promise<string | null>((resolve) => {
    s3.getSignedUrl(
      "putObject",
      {
        Bucket,
        Key,
        Expires,
        ContentType: "binary/octet-stream",
        ACL: "public-read",
        CacheControl: "public, max-age=8640000", // 100 days
      },
      (e: unknown, u: string) => {
        if (e) {
          console.error(e);
        }
        resolve(e ? null : u);
      }
    );
  });
};

export const generateInfoUrl = generateUrl("json.x");
export const generateHeadshotUrl = generateUrl("jpg.x");

export type ActivationUid = Nominal<string, "ActivationRow.uid">;

type ActivationRow = {
  uid: ActivationUid;
  batch_info_uid: BatchInfoUid;
  batch_token_uid: BatchTokenUid;
  passport_id: PassportId;
  ip: string;
};

export const insertActivation = async (
  knex: Knex,
  batch_info_uid: BatchInfoUid,
  batch_token_uid: BatchTokenUid,
  passport_id: PassportId,
  ip: string
): Promise<ActivationRow> => {
  const data: Partial<ActivationRow> = {
    batch_info_uid,
    batch_token_uid,
    passport_id,
    ip,
  };
  const [row] = await knex("activations")
    .insert(data)
    .returning<ActivationRow[]>("*");
  return row;
};

const fetchActivation = (knex: Knex, where: Partial<ActivationRow>) => {
  return knex("activations").select<ActivationRow[]>("*").where(where).first();
};

export const updateDirectory = async (knex: Knex, uid: ActivationUid) => {
  const activation = await fetchActivation(knex, { uid });
  if (!activation) {
    return false;
  }

  const { passport_id, batch_info_uid } = activation;
  const batchInfo = await fetchBatchInfo(knex, { uid: batch_info_uid });
  if (!batchInfo) {
    return false;
  }
  const { vaccine } = batchInfo;
  const Key = `${pathFrom(passport_id)}/dir.json`;
  const contents = await new Promise<string | undefined>((resolve) =>
    s3.getObject({ Bucket, Key }, (e, d) => {
      if (e) {
        if (e.code === "NoSuchKey") {
          resolve(undefined);
        } else {
          console.error(e);
          resolve(undefined);
        }
      } else {
        resolve(d.Body?.toString());
      }
    })
  );

  const now = Date.now();
  const directory = ((contents && safeParse(contents)) ||
    {}) as PassportDirectory;
  const updatedDirectory: PassportDirectory = {
    ...directory,
    [vaccine]: {
      ...directory[vaccine],
      [uid]: now,
    },
  };
  return new Promise<boolean>((resolve) =>
    s3.putObject(
      {
        Bucket,
        Key,
        ContentType: "application/json",
        ACL: "public-read",
        CacheControl: "public, max-age=10",
        Body: JSON.stringify(updatedDirectory),
      },
      (e) => {
        if (e) {
          console.error(e);
        }
        resolve(!e);
      }
    )
  );
};
