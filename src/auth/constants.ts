import 'dotenv/config';
export const jwtConstant = {
  secret: process.env.SECREt,
  expiresIn: process.env.EXPIRESIN,
};
