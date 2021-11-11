import { PartialType } from '@nestjs/mapped-types';
import { CreateKimonoCashOutDto } from './create-kimono.dto';

export class UpdateKimonoDto extends PartialType(CreateKimonoCashOutDto) {}
