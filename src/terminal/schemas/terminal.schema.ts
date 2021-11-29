import * as mongoose from 'mongoose';

export const terminalSchema = new mongoose.Schema({
  clientId: String,
  creditAccountNumber: String,
  creditBankCode: String,
  serialNumber: String,
  terminalId: String,
  isActive: {
    type: Boolean,
    default: false
  },
  isDeleted: {type: Boolean, default: false},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});