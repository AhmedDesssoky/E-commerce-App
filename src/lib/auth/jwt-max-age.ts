export function maxAgeFromJwt(token: string, nowSeconds = Math.floor(Date.now() / 1000)) {
  const payload = token.split(".")[1];

  if (!payload) {
    return undefined;
  }

  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (
      typeof claims !== "object" ||
      claims === null ||
      !("exp" in claims) ||
      typeof claims.exp !== "number"
    ) {
      return undefined;
    }

    const seconds = claims.exp - nowSeconds;
    return seconds > 0 ? seconds : undefined;
  } catch {
    return undefined;
  }
}
