import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { KimonoService } from "./kimono.service";
import { KimonoController } from "./kimono.controller";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { EncryptionMiddleware } from "./middlewares/encryption.middleware";
import { PaygateService } from "../common/services/paygate/paygate.service";
import { MongooseModule } from "@nestjs/mongoose";
import { kimonoSchema } from "./schemas/kimono.schema";
import { TerminalModule } from "../terminal/terminal.module";
import { terminalSchema } from '../terminal/schemas/terminal.schema';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TerminalModule,
    MongooseModule.forFeature([{ name: 'Kimono', schema: kimonoSchema }]),
    MongooseModule.forFeature([{ name: 'Terminal', schema: terminalSchema }])
  ],
  controllers: [KimonoController],
  providers: [KimonoService,PaygateService,EncryptionService]
})
export class KimonoModule {


  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        EncryptionMiddleware
      )
      .forRoutes({
        path: '/kimono',
        method: RequestMethod.POST,
      });
  }


}
