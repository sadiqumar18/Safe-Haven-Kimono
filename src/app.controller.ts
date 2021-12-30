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
  constructor(private readonly appService: AppService,private readonly encryptService: EncryptionService,private readonly paygate: PaygateService) {}

  //@UseGuards(AuthGuard)
  @Post()
  async getHello(@Request() request, @Body() body): Promise<any> {


   // await this.encryptService.generateKeyPairSync(1024);


    //
    const fs = await require("fs");
    let privateKey = await fs.readFileSync("private-key.pem", "utf8").trim();
    let publicKey = await fs.readFileSync("public-key.pem", "utf8").trim();


    const key = 'abubakarumarabubakarumarabubakar';


    let encrype_2 =  await this.aes256BitEncrypt(body, key,'gpG388l8rT02vBH4');

    //return encrype_2;

    return await this.aes256BitDecrypt(encrype_2,key,'gpG388l8rT02vBH4');

    return 'stop';

    console.log(key);


    let aesEncryptPayload = await this.encryptService.encryptAesPayload(body, key);
     aesEncryptPayload = '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'
    console.log(btoa(aesEncryptPayload));

    const rsaEncryptedKey = await this.encryptService.rsaEncrypt(key, publicKey);

    const decryptedKey = await this.encryptService.rsaDecrypt(rsaEncryptedKey, privateKey)

    const decryptedPayload = await this.encryptService.decryptAesPayload(aesEncryptPayload, key);

   return decryptedPayload;



    return 'test';


  }



  async aes256BitEncrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string
  ): Promise<string> {
    let dataParse: string = data as string;
    if (!isString(data)) {
      dataParse = JSON.stringify(data);
    }

    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', crp, iv);

    const encryptedText = Buffer.concat([
      cipher.update(dataParse),
      cipher.final()
    ]);

    return encryptedText.toString('base64');
  }


  async aes256BitDecrypt(
    encrypted: string,
    key: string,
    iv: string
  ): Promise<string> {
    const data: Buffer = Buffer.from(encrypted, 'base64');
    const crp = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', crp, iv);
    const decryptedText = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);

    return JSON.parse(decryptedText.toString('utf8'));
  }




}
