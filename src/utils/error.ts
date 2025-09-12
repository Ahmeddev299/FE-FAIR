// src/utils/error.ts

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const firstString = (v: unknown): string | undefined => {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
};

type AxiosLikeError = {
  message?: unknown;
  response?: { data?: unknown; status?: unknown };
};

type AxiosLikeData = {
  message?: unknown;
  error?: unknown;
  detail?: unknown;
  errors?: unknown;
};

export const extractErrorMessage = (
  e: unknown,
  fallback = "Failed to update profile"
): string => {
  // plain string or Error
  if (typeof e === "string") return e;
  if (e instanceof Error && typeof e.message === "string") return e.message;

  // axios-like
  if (isRecord(e)) {
    const maybeAxios = e as AxiosLikeError;

    const data = maybeAxios.response?.data;

    // data can be object, string, or string[]
    if (isRecord(data)) {
      const ax = data as AxiosLikeData;

      if (typeof ax.message === "string") return ax.message;
      if (typeof ax.error === "string") return ax.error;
      if (typeof ax.detail === "string") return ax.detail;

      const errs = ax.errors;
      const s = firstString(errs);
      if (s) return s;
    } else {
      const s = firstString(data);
      if (s) return s;
    }

    if (typeof maybeAxios.message === "string") return maybeAxios.message;
  }

  return fallback;
};
