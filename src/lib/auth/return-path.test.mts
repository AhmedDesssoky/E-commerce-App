import { expect, test } from "vitest";
import { hrefFromInternalPath, parseInternalPath, parseNextParam } from "./return-path.ts";

test("allows storefront paths and product ids", () => {
  expect(parseInternalPath("/")).toBe("/");
  expect(parseInternalPath("/products")).toBe("/products");
  expect(parseInternalPath("/cart")).toBe("/cart");
  expect(parseInternalPath("/checkout")).toBe("/checkout");
  expect(parseInternalPath("/orders")).toBe("/orders");
  expect(parseInternalPath("/account")).toBe("/account");
  expect(parseInternalPath("/addresses")).toBe("/addresses");
  expect(parseInternalPath("/products/6439d61c0049ad0b52b90051")).toBe(
    "/products/6439d61c0049ad0b52b90051",
  );
});

test("rejects open redirects and unknown paths", () => {
  expect(parseInternalPath("https://evil.test")).toBeNull();
  expect(parseInternalPath("//evil.test")).toBeNull();
  expect(parseInternalPath("/en/products")).toBeNull();
  expect(parseInternalPath("/sign-in")).toBeNull();
  expect(parseInternalPath("/products/../cart")).toBeNull();
  expect(parseInternalPath("/products/%2e%2e")).toBeNull();
  expect(parseInternalPath(undefined)).toBeNull();
});

test("maps allowlisted next paths to next-intl hrefs and falls back to home", () => {
  expect(hrefFromInternalPath("/cart")).toBe("/cart");
  expect(hrefFromInternalPath("/products/6439d61c0049ad0b52b90051")).toEqual({
    pathname: "/products/[id]",
    params: { id: "6439d61c0049ad0b52b90051" },
  });
  expect(hrefFromInternalPath("https://evil.test")).toBe("/");
  expect(hrefFromInternalPath("/sign-in")).toBe("/");
});

test("reads allowlisted next from a search param string or first array value", () => {
  expect(parseNextParam("/cart")).toBe("/cart");
  expect(parseNextParam(["/cart", "/products"])).toBe("/cart");
  expect(parseNextParam("https://evil.test")).toBeNull();
  expect(parseNextParam(undefined)).toBeNull();
});
