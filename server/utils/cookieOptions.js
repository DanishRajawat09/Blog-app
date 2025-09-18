import ms from "ms";

export const cookieOptions = async (expiryKey, sameSite = "none") => {
  const expiryValue = process.env[expiryKey];
  if (!expiryValue) {
    throw new Error(`Missing expiry value in env: ${expiryKey}`);
  }

  const expiryms = ms(expiryValue);
  if (!expiryms) {
    throw new Error(`Invalid expiry format: ${expiryValue}`);
  }

  return {
    httpOnly: true,
    secure: false, // set to true in production with https
    maxAge: expiryms,
    SameSite: sameSite,
  };
};
