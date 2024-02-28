import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  // ENV
  RUNTIME: Joi.string().valid('local', 'test', 'prod').required(),
  PORT: Joi.number().required(),
  SERVICE_NAME: Joi.string().required(),

  // BACKEND
  BASE_URL: Joi.string().required(),

  // SWAGGER
  SWAGGER_ID: Joi.string().required(),
  SWAGGER_PW: Joi.string().required(),

  // AUTH
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRY: Joi.string().required(),
  REFRESH_TOKEN_EXPIRY: Joi.string().required(),

  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
