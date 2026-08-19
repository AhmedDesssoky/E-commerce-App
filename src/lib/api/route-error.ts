import { ZodError } from "zod";

export class RouteApiError extends Error {
  constructor(
    readonly endpoint: string,
    readonly status: number,
    readonly apiMessage?: string,
  ) {
    super(`${endpoint} ${status}`);
    this.name = "RouteApiError";
  }
}

export function logCatalogFailure(label: string, error: unknown) {
  if (error instanceof RouteApiError) {
    console.error(`${label} ${error.status}`);
    return;
  }

  if (error instanceof ZodError) {
    console.error(`${label} schema ${error.issues.length}`);
    return;
  }

  console.error(label);
}

export function isCatalogFailure(error: unknown) {
  return error instanceof RouteApiError || error instanceof ZodError;
}
