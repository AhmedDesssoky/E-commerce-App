import { expect, test } from "vitest";
import { hrefWithAuthFlash, parseAuthFlash } from "./auth-flash.ts";

test("parses auth flash query values", () => {
  expect(parseAuthFlash("signed-in")).toBe("signed-in");
  expect(parseAuthFlash("signed-up")).toBe("signed-up");
  expect(parseAuthFlash("evil")).toBeNull();
});

test("appends auth flash to storefront hrefs", () => {
  expect(hrefWithAuthFlash("/cart", "signed-in")).toEqual({
    pathname: "/cart",
    query: { auth: "signed-in" },
  });
  expect(
    hrefWithAuthFlash(
      { pathname: "/products/[id]", params: { id: "6439d61c0049ad0b52b90051" } },
      "signed-up",
    ),
  ).toEqual({
    pathname: "/products/[id]",
    params: { id: "6439d61c0049ad0b52b90051" },
    query: { auth: "signed-up" },
  });
});
