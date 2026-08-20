import { expect, test } from "vitest";
import { isStripeCheckoutUrl } from "./stripe-checkout-url.ts";

test("accepts Stripe hosted checkout URLs only", () => {
  expect(
    isStripeCheckoutUrl("https://checkout.stripe.com/c/pay/cs_test_abc"),
  ).toBe(true);
  expect(isStripeCheckoutUrl("https://pay.stripe.com/something")).toBe(true);
  expect(isStripeCheckoutUrl("http://checkout.stripe.com/c/pay/cs_test")).toBe(
    false,
  );
  expect(isStripeCheckoutUrl("https://evil.test/checkout.stripe.com")).toBe(
    false,
  );
  expect(isStripeCheckoutUrl("not-a-url")).toBe(false);
});
