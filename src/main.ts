import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { useContainer } from "class-validator";
import { TerminalModule } from "./terminal/terminal.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(TerminalModule), {fallbackOnErrors: true});
  await app.listen(3000);

}
bootstrap();
