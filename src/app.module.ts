import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KimonoModule } from './kimono/kimono.module';

@Module({
  imports: [KimonoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
