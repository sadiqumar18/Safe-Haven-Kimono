import * as dotenv from 'dotenv';

dotenv.config();

export const AppConfig: any = process.env;

import * as Joi from 'joi';

export const AppConfigValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number()
    .default(3000),
  DB_HOST: Joi.string()
    .default('localhost'),
  DB_PORT: Joi.number()
    .default(5432),
  DATABASE_URI: Joi.string().required(),
  SAFEHAVEN_IBS_BASE_URL: Joi.string().required(),
})