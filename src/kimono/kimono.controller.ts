import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Injectable } from "@nestjs/common";
import { KimonoService } from './kimono.service';
import { CreateKimonoCashOutDto, RequeryKimonoDto } from "./dto/create-kimono.dto";
import { UpdateKimonoDto } from './dto/update-kimono.dto';
import { AuthGuard } from "../common/guards/auth.guard";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Kimono } from "./interfaces/kimono.interface";
import { TerminalInterface } from "../terminal/interfaces/terminal.interface";

@Controller('kimono')
export class KimonoController {
  constructor(
    private readonly kimonoService: KimonoService,
    @InjectModel('Kimono') private readonly kimono: Model<Kimono>
  ) {}

  //@UseGuards(AuthGuard)
  @Post()
  async create(@Body() createKimonoDto: CreateKimonoCashOutDto) {
    return this.kimonoService.create(createKimonoDto);
  }

  @Post('requery')
  requery(@Body() requeryKimonoDto: RequeryKimonoDto) {
    return this.kimonoService.requery(requeryKimonoDto);

  }

  @Get()
  findAll() {
    return this.kimonoService.findAll();
  }

  @Get(':id/:clientID')
  findOne(@Param('id') id: string, @Param('clientID') clientID: string) {
    return this.kimonoService.findOne(+id, clientID);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKimonoDto: UpdateKimonoDto) {
    return this.kimonoService.update(+id, updateKimonoDto);
  }

  @Delete(':id/:clientID')
  remove(@Param('id') id: string , @Param('clientID') clientID: string) {
    return this.kimonoService.remove(+id, clientID);
  }
}
