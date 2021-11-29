import * as mongoose from 'mongoose';



export enum Status {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

export const kimonoSchema = new mongoose.Schema({
    clientId: {
       type: String, required: true
    },
    terminal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Terminal' ,
        required: true
    },
    retrievalReferenceNumber:{
        type: String,
        required: true
    },
    stan: {type: String, required: true},
    amount: {type: Number, required: true},
    isDeleted: {type: Boolean, default: false},
    transactionDate: Date,
    status: {type: String , enum: Status, required: true , default: Status.PENDING},
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
