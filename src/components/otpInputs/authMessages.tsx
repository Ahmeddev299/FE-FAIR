// utils/authMessages.ts
export const isOtpExpiredMsg = (msg?: string) =>
  !!msg && /otp.*expired/i.test(msg);

export const isOtpInvalidMsg = (msg?: string) =>
  !!msg && /invalid.*(otp|code)/i.test(msg);
