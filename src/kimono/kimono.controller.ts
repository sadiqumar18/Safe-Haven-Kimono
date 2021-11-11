import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KimonoService } from './kimono.service';
import { CreateKimonoCashOutDto, RequeryKimonoDto } from "./dto/create-kimono.dto";
import { UpdateKimonoDto } from './dto/update-kimono.dto';

@Controller('kimono')
export class KimonoController {
  constructor(private readonly kimonoService: KimonoService) {}

  @Post()
  create(@Body() createKimonoDto: CreateKimonoCashOutDto) {
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kimonoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKimonoDto: UpdateKimonoDto) {
    return this.kimonoService.update(+id, updateKimonoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kimonoService.remove(+id);
  }
}
