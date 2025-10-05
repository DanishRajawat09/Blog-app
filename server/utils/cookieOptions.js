import ms from "ms";

export const cookieOptions = async (expiryKey) => {
  const expiryValue = process.env[expiryKey];
  if (!expiryValue) {
    throw new Error(`Missing expiry value in env: ${expiryKey}`);
  }

  const expiryms = ms(expiryValue);
  if (!expiryms) {
    throw new Error(`Invalid expiry format: ${expiryValue}`);
  }
    const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure:  isProduction, // set to true in production with https
    maxAge: expiryms,
    sameSite: isProduction ? "none" : "lax",
  };
};
