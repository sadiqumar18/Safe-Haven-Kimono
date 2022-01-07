import { Controller, Get, UseGuards, Request, Body, Post, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptionService } from "./kimono/encryption.service";
import { PaygateService } from "./common/services/paygate/paygate.service";
import { AuthGuard } from "./common/guards/auth.guard";
import { atob } from "buffer";
const CryptoJS = require("crypto-js");
import { Crypt, RSA } from 'hybrid-crypto-js';
import { date } from 'joi';
import { isString } from 'class-validator';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  //@UseGuards(AuthGuard)
  @Post()
  async getHello(@Request() request, @Body() body): Promise<any> {

    return 'hello world!'

  }


}
