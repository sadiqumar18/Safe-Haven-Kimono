import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import { TerminalModule } from "./terminal/terminal.module";
import { AppConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  useContainer(app.select(TerminalModule), {fallbackOnErrors: true});
  await app.listen(AppConfig.PORT);

}
bootstrap();
