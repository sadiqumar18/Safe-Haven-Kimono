import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common";
import { TerminalService } from './terminal.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TerminalInterface } from "./interfaces/terminal.interface";

@Controller('terminal')
export class TerminalController {
  constructor(private readonly terminalService: TerminalService,
              @InjectModel('Terminal') private readonly terminalModel: Model<TerminalInterface>
  ) {}

  @Post()
  create(@Body() createTerminalDto: CreateTerminalDto) {
    return this.terminalService.create(createTerminalDto);
  }

  @Get()
  async findAll() {
    return this.terminalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.terminalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTerminalDto: UpdateTerminalDto) {
    return this.terminalService.update(+id, updateTerminalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.terminalService.remove(+id);
  }
}
