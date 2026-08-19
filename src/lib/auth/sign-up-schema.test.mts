import { expect, test } from "vitest";
import { signUpSchema } from "./sign-up-schema.ts";

const valid = {
  name: "Shopper One",
  email: "shopper@example.com",
  password: "Ahmed@123",
  rePassword: "Ahmed@123",
  phone: "01010700701",
};

function issueOn(payload: unknown, path: string) {
  const parsed = signUpSchema.safeParse(payload);
  if (parsed.success) {
    return null;
  }

  return parsed.error.issues.find((issue) => issue.path[0] === path)?.message ?? null;
}

test("accepts a Route-shaped signup payload", () => {
  expect(signUpSchema.safeParse(valid).success).toBe(true);
});

test("trims email and phone before validating", () => {
  const parsed = signUpSchema.safeParse({
    ...valid,
    email: "  shopper@example.com  ",
    phone: "  01010700701  ",
  });

  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.email).toBe("shopper@example.com");
    expect(parsed.data.phone).toBe("01010700701");
  }
});

const rejects = [
  ["short name", { ...valid, name: "A" }, "name", "nameMin"],
  ["bad email", { ...valid, email: "not-an-email" }, "email", "email"],
  ["short password", { ...valid, password: "12345", rePassword: "12345" }, "password", "passwordMin"],
  ["non-Egyptian phone", { ...valid, phone: "12345" }, "phone", "phone"],
] as const;

for (const [title, payload, path, code] of rejects) {
  test(`rejects ${title}`, () => {
    expect(issueOn(payload, path)).toBe(code);
  });
}

test("rejects when passwords do not match", () => {
  expect(issueOn({ ...valid, rePassword: "Other@123" }, "rePassword")).toBe("rePassword");
});
