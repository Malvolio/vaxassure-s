import { Base64 } from "js-base64";

export const safeDecode = (s: string | null): string | null => {
  try {
    return s && Base64.decode(s);
  } catch (e) {
    return null;
  }
};

export const safeParse = (s: string | null): object | null => {
  try {
    return s && JSON.parse(s);
  } catch (e) {
    return null;
  }
};
