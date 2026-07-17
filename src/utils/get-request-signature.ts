
import CryptoJS from "crypto-js";

const REQUEST_SECRET = import.meta.env.VITE_REQUEST_SECRET_KEY!;

export function getRequestSignature(
  method: string,
  body: string
) {
  const data = `${method}${body}`;
  const signature = CryptoJS.HmacSHA256(data, `${REQUEST_SECRET}`).toString(
    CryptoJS.enc.Hex
  );

  const payload = {
    signature,
  };

  return payload.signature;
}
