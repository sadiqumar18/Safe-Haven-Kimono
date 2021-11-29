import * as mongoose from 'mongoose';

const LogRequestSchema = new mongoose.Schema({
  method: String,
  url: String,
  getParams: Object,
  postParams: Object,
  queryString: String,
  requestBody: String,
  ip: String,
  headers: Object,
  clientIp: String,
  source: String,
  sourceUser: String,
  origin: String
});

const LogResponseSchema = new mongoose.Schema({
  status: Number,
  headers: Object,
  body: Object,
  rawBody: String
});