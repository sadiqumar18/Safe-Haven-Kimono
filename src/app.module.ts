import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KimonoModule } from './kimono/kimono.module';
import { HttpModule } from "@nestjs/axios";
import { PaygateService } from "./common/services/paygate/paygate.service";
import { EncryptionService } from "./kimono/encryption.service";
import { TerminalModule } from './terminal/terminal.module';
import { ConfigModule } from "@nestjs/config";
import { AppConfig, AppConfigValidationSchema} from './app.config';
import { MongooseModule } from "@nestjs/mongoose";
import { kimonoSchema } from "./kimono/schemas/kimono.schema";
import { EventModule } from './event/event.module';
import { TerminalExists } from "./terminal/decorators/terminal.decorator";
import { EncryptionMiddleware } from "./kimono/middlewares/encryption.middleware";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: AppConfigValidationSchema
    }),
    KimonoModule,
    HttpModule.register({
      timeout: 50000,
    }),
    TerminalModule,
    EventModule,
    MongooseModule.forRootAsync(
      {
        useFactory: () => ({
          uri: AppConfig.DATABASE_URI,
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
      }
    ),
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService,PaygateService,EncryptionService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        EncryptionMiddleware
      )
      .forRoutes({
        path: '/',
        method: RequestMethod.POST,
      });
  }

}
