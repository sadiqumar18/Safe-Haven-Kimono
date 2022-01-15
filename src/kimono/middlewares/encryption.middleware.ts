import { BadRequestException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { EncryptionService } from '../encryption.service';
import { AppConfig } from '../../app.config';
import { log } from 'util';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {

  constructor(private readonly encryptionService: EncryptionService) {}


   async use(req: any, res: any, next: () => void) {

    try {
      if (req.headers.track2 === undefined || req.headers.track2 === null || req.headers.pindata === undefined || req.headers.pindata === null  ) throw new BadRequestException('Missing track2 or pinData missing')
    }catch (e){
      return res.send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: e.message,
      });
    }

    try {

      const track2 = JSON.parse(this.encryptionService.rsaDecrypt(req.headers.track2, AppConfig.RSA_PRIVATE_KEY));
      const pinData = JSON.parse(this.encryptionService.rsaDecrypt(req.headers.pindata, AppConfig.RSA_PRIVATE_KEY));

      req.body = {...req.body,track2:track2.track2,pinData:pinData.pinData}
      console.log(req.body);
       next();
     } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
         statusCode: HttpStatus.BAD_REQUEST,
         message: 'Invalid request',
         error: e.reason
       });
     }
   }
}
