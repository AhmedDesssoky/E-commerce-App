import { expect, test } from "vitest";
import { signInSchema } from "./sign-in-schema.ts";

const valid = {
  email: "shopper@example.com",
  password: "Ahmed@123",
};

test("accepts a Route-shaped signin payload and trims email", () => {
  const parsed = signInSchema.safeParse({
    email: "  shopper@example.com  ",
    password: "Ahmed@123",
  });

  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.email).toBe("shopper@example.com");
  }
});

test("rejects invalid email", () => {
  expect(
    signInSchema.safeParse({ ...valid, email: "not-an-email" }).success,
  ).toBe(false);
});

test("rejects an empty password", () => {
  expect(
    signInSchema.safeParse({ ...valid, password: "" }).success,
  ).toBe(false);
});
