import { expect, test } from "vitest";
import { maxAgeFromJwt } from "./jwt-max-age.ts";

function jwtWithPayload(payload: unknown) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${encoded}.sig`;
}

test("returns remaining seconds from a future exp claim", () => {
  expect(maxAgeFromJwt(jwtWithPayload({ exp: 1_700_000_060 }), 1_700_000_000)).toBe(60);
});

test("returns undefined for expired, missing, or malformed tokens", () => {
  expect(maxAgeFromJwt(jwtWithPayload({ exp: 1_700_000_000 }), 1_700_000_001)).toBeUndefined();
  expect(maxAgeFromJwt(jwtWithPayload({}), 1_700_000_000)).toBeUndefined();
  expect(maxAgeFromJwt("not-a-jwt", 1_700_000_000)).toBeUndefined();
});
