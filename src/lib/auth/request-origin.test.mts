import { expect, test } from "vitest";
import {
  originFromSiteUrl,
  originFromVercelHost,
} from "./request-origin.ts";

test("accepts http(s) SITE_URL values and strips paths", () => {
  expect(originFromSiteUrl("https://shop.example.com")).toBe(
    "https://shop.example.com",
  );
  expect(originFromSiteUrl("https://shop.example.com/en/checkout")).toBe(
    "https://shop.example.com",
  );
  expect(originFromSiteUrl(" http://localhost:3000 ")).toBe(
    "http://localhost:3000",
  );
});

test("rejects empty or non-http SITE_URL values", () => {
  expect(originFromSiteUrl(undefined)).toBeNull();
  expect(originFromSiteUrl("")).toBeNull();
  expect(originFromSiteUrl("ftp://shop.example.com")).toBeNull();
  expect(originFromSiteUrl("not-a-url")).toBeNull();
});

test("builds https origins from Vercel host env values", () => {
  expect(originFromVercelHost("my-app.vercel.app")).toBe(
    "https://my-app.vercel.app",
  );
  expect(originFromVercelHost("https://my-app.vercel.app")).toBe(
    "https://my-app.vercel.app",
  );
  expect(originFromVercelHost("shop.example.com")).toBe(
    "https://shop.example.com",
  );
});

test("rejects empty or malformed Vercel hosts", () => {
  expect(originFromVercelHost(undefined)).toBeNull();
  expect(originFromVercelHost("")).toBeNull();
  expect(originFromVercelHost("evil,host")).toBeNull();
  expect(originFromVercelHost("a b.com")).toBeNull();
});
