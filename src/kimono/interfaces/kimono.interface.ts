import { Document, ObjectId } from 'mongoose';

class enumStatus {
  static readonly SUCCESS = 'SUCCESS';
  static readonly FAILED = 'FAILED';
}

export interface Kimono extends Document{
  clientId: string;
  terminalId: ObjectId;
  stan: string;
  amount: number;
  originalTransmissionDateTime: Date;
  transactionDate: Date;
  status: enumStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: () => Date;
}