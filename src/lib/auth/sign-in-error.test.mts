import { expect, test } from "vitest";
import { signInErrorFromRoute } from "./sign-in-error.ts";

test("maps incorrect-credentials Route responses to credentials", () => {
  expect(signInErrorFromRoute(401, "Incorrect email or password")).toBe("credentials");
  expect(signInErrorFromRoute(401)).toBe("credentials");
});

test("maps other Route failures to failed without using the raw message", () => {
  expect(signInErrorFromRoute(500, "fail")).toBe("failed");
  expect(signInErrorFromRoute(400)).toBe("failed");
});
