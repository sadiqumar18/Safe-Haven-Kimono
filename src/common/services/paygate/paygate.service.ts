import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map, tap } from "rxjs";
import { AppConfig } from "../../../app.config";

@Injectable()
export class PaygateService {


  constructor(private httpsService: HttpService) {
    this.httpsService = httpsService;
  }


  //TODO : credit user account

  async verifyClient(token: string, clientId: string): Promise<any> {
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
      'clientId': clientId
    };

    return lastValueFrom(await this.httpsService.get(`${AppConfig.SAFEHAVEN_IBS_BASE_URL}/users/me`, { headers })
      .pipe(
        map(response => {
          return response.data;
        })
      )).catch(error => {
        return {
          statusCode: error.statusCode,
          // message: error.response.data.message,
        };
      });
  }
}
