import 'dotenv/config';
export const Constants = {
	HOST: process.env.MYSQL_HOST,
	USER: process.env.MYSQL_USER,
	PASSWORD: process.env.MYSQL_PASSWORD,
	DB: process.env.MYSQL_DB,
};
