import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { KimonoService } from "./kimono.service";
import { KimonoController } from "./kimono.controller";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { EncryptionMiddleware } from "./middlewares/encryption.middleware";

@Module({
  imports: [ConfigModule.forRoot(),HttpModule],
  controllers: [KimonoController],
  providers: [KimonoService]
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
