import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PaygateService } from "../services/paygate/paygate.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly paygateService: PaygateService) {
  }

   async canActivate(
     context: ExecutionContext,
   ): Promise<boolean> {
     const request = context.switchToHttp().getRequest();
     const KEY = request.headers.safehaven_kimono_key;
     console.log(request.headers.payload);
     if (KEY === process.env.SAFEHAVEN_KIMONO_KEY) {
       return true;
     }
     return false;
   }
}
