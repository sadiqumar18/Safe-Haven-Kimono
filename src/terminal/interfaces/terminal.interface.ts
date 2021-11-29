import { Document, ObjectId } from 'mongoose';

export interface TerminalInterface extends Document{
  isActive: boolean;
  clientId: string;
  serialNumber: string;
  terminalId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: () => Date;
}