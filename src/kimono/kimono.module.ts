import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { KimonoService } from "./kimono.service";
import { KimonoController } from "./kimono.controller";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { EncryptionMiddleware } from "../common/middlewares/encryption.middleware";
import { PaygateService } from "../common/services/paygate/paygate.service";
import { MongooseModule } from "@nestjs/mongoose";
import { kimonoSchema } from "./schemas/kimono.schema";
import { TerminalModule } from "../terminal/terminal.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature([{ name: 'Kimono', schema: kimonoSchema }]),
    TerminalModule
  ],
  controllers: [KimonoController],
  providers: [KimonoService,PaygateService]
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
