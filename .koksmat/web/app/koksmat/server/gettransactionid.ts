import { randomBytes } from "crypto";
export default async function getTransactionId() {
  return randomBytes(16).toString("hex");
}
