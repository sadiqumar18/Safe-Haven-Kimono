import * as dotenv from 'dotenv';

dotenv.config({ path: 'environments/.env' });

export const AppConfig: any = process.env;

console.log(AppConfig);

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
  DATABASE_URI_TEST: Joi.string().required(),

  SAFEHAVEN_IBS_BASE_URL: Joi.string().required(),
  SAFEHAVEN_IBS_BASE_URL_SANDBOX: Joi.string().required(),

  MERCHANT_ID: Joi.string().required(),
  MERCHANT_ID_TEST: Joi.string().required(),

  KIMONO_TOKEN_URL: Joi.string().required(),
  KIMONO_TOKEN_URL_TEST: Joi.string().required(),

  KIMONO_CASHOUT_URL: Joi.string().required(),
  KIMONO_CASHOUT_URL_TEST: Joi.string().required(),

  KIMONO_REQUERY_URL: Joi.string().required(),
  KIMONO_REQUERY_URL_TEST: Joi.string().required(),



  RSA_PRIVATE_KEY: Joi.string().required(),
  RSA_PRIVATE_KEY_TEST: Joi.string().required(),

  EXTENDED_TRANSACTION_TYPE: Joi.string().required(),
  EXTENDED_TRANSACTION_TYPE_TEST: Joi.string().required(),

  SURCHARGE_AMOUNT_TEST: Joi.string().required(),
  SURCHARGE_AMOUNT: Joi.string().required(),

  DESTINATION_ACCOUNT_NUMBER_TEST: Joi.string().required(),
  DESTINATION_ACCOUNT_NUMBER: Joi.string().required(),

  KEYLABEL_TEST: Joi.string().required(),
  KEYLABEL: Joi.string().required(),

  RECEIVING_INSTITUTION_ID_TEST: Joi.string().required(),
  RECEIVING_INSTITUTION_ID:Joi.string().required(),


})