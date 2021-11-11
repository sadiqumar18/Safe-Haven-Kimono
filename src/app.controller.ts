import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    // let res =  this.kimonoService.login();
    //
    // this.kimonoService.cashOut()


    // return res
  }
}
