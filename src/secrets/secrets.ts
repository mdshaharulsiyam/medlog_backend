import dotenv from "dotenv";
dotenv.config();

export const secrets = Object.freeze({
  db: process.env.DB,
  port: process.env.PORT,
  MAIL_EMAIL: process.env.MAIL_EMAIL,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  TOKEN_NAME: process.env.TOKEN_NAME,
  ACCESS_TOKEN_NAME: process.env.ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  USER: ['user', 'doctor', 'admin'],
});

export const httpStatus = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
});
