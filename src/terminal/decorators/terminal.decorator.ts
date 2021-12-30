import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TerminalInterface } from "../interfaces/terminal.interface";


@ValidatorConstraint({ name: 'TerminalExists', async: true })
@Injectable()
export class TerminalExists implements ValidatorConstraintInterface {
    constructor(@InjectModel('Terminal') private readonly terminalModel: Model<TerminalInterface>) { }

    async validate(terminalId: string, args: ValidationArguments) {

        try {
            return  await this.terminalModel.exists({terminalId})
        }catch (error) {
            return false
        }

    }

    defaultMessage(args: ValidationArguments) {
        return `terminalId with id ${args.value} does not exist`;
    }
}