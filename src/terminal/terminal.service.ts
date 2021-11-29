import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TerminalService {

  constructor(@InjectModel('Terminal') private readonly terminalModel) {}


  create(createTerminalDto: CreateTerminalDto) {
    const createdTerminal = new this.terminalModel(createTerminalDto);
    return createdTerminal.save();
  }

  findAll() {
    return this.terminalModel.find();
  }

  findOne(id: number) {



    return this.terminalModel.findOne({ id });
  }

  update(id: number, updateTerminalDto: UpdateTerminalDto) {
    return `This action updates a #${id} terminal`;
  }

  remove(id: number) {
    return this.terminalModel.findOneAndRemove({ id })
  }
}
