import { Brand, make } from "ts-brand";

type PassportId = Brand<string, "PassportId">;

export function isPassportId(s: string): s is PassportId {
  return !!/[0-9a-z]{10,}/i.exec(s);
}

export type PassportDirectory = {
  [vaccine: string]: { [activationId: string]: number };
};

export const pathFromPassportId = (s: PassportId) => s.match(/..?/g)!.join("/");
