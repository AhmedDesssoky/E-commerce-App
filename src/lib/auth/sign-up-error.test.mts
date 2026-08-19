import { expect, test } from "vitest";
import { signUpErrorFromRoute } from "./sign-up-error.ts";

test("maps duplicate-account Route responses to exists", () => {
  expect(signUpErrorFromRoute(409, "Account Already Exists")).toBe("exists");
  expect(signUpErrorFromRoute(409)).toBe("exists");
  expect(signUpErrorFromRoute(400, "Account Already Exists")).toBe("exists");
});

test("maps other Route failures to failed without using the raw message", () => {
  expect(signUpErrorFromRoute(400, "Invalid email ")).toBe("failed");
  expect(signUpErrorFromRoute(500)).toBe("failed");
});
