import { HttpCode, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { EncryptionService } from '../encryption.service';
import fs from 'fs';
import { AppConfig } from '../../app.config';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {

  constructor(private readonly encryptionService: EncryptionService) {}


   async use(req: any, res: any, next: () => void) {

    if (req.body.securePayload === undefined || req.body.securePayload === null) {
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Missing securePayload',
      });
     }

     try {
       const decrypted =  JSON.parse(this.encryptionService.rsaDecrypt(req.body.securePayload, AppConfig.RSA_PRIVATE_KEY));
       req.body.track2 = decrypted.track2;
       req.body.pinData = decrypted.pinData
       next();
     } catch (e) {
       res.status(HttpStatus.BAD_REQUEST).send({
         statusCode: HttpStatus.BAD_REQUEST,
         message: 'Invalid request',
         error: e.reason
       });
     }
   }
}
