import 'dotenv/config';
export const jwtConstant = {
    secret: process.env.SECRET,
    expiresIn: process.env.EXPIRESIN,
};
