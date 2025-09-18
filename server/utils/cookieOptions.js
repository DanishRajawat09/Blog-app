import ms from "ms";
export const cookieOptions = async (sameSite = "none", expiry) => {
  const cookieOption = {
    httpOnly: true,
    secure: false,
    maxAge: ms(process.env[expiry]),
    sameSite: sameSite,
  };
  return cookieOption;
};
