import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { terminalSchema } from "./schemas/terminal.schema";
import { Terminal } from "./entities/terminal.entity";
import { TerminalExists } from "./decorators/terminal.decorator";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Terminal', schema: terminalSchema }])
  ],
  controllers: [TerminalController],
  providers: [TerminalService, TerminalExists],
  exports:[TerminalExists]
})
export class TerminalModule {}
