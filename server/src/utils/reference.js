import { randomBytes } from "node:crypto";
import { DuplicateKeyError } from "../db/errors.js";

// No 0/O/1/I so references are easy to read out over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_ATTEMPTS = 5;

export const PREFIXES = { training: "SAG-TR", quote: "SAG-QT" };

export function generateReference(prefix) {
  return `${prefix}-${Array.from(randomBytes(5), (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

export function isReference(prefix, value) {
  return new RegExp(`^${prefix}-[${ALPHABET}]{5}$`).test(value ?? "");
}

// Creates a record with a unique referenceId. A well-formed `preferred` reference
// (e.g. one the browser already showed the applicant) is used when it is free.
export async function createWithReference(repository, prefix, data, preferred) {
  let referenceId = isReference(prefix, preferred) ? preferred : generateReference(prefix);
  for (let attempt = 1; ; attempt++) {
    try {
      return await repository.create({ ...data, referenceId });
    } catch (err) {
      if (!(err instanceof DuplicateKeyError && err.field === "referenceId") || attempt >= MAX_ATTEMPTS) throw err;
      referenceId = generateReference(prefix);
    }
  }
}
