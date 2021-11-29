import { Controller, Get, UseGuards, Request, Body, Post } from "@nestjs/common";
import { AppService } from './app.service';
import { EncryptionService } from "./common/encryption/encryption.service";
import { PaygateService } from "./common/services/paygate/paygate.service";
import { AuthGuard } from "./common/guards/auth.guard";
import { atob } from "buffer";
const CryptoJS = require("crypto-js");



@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly encryptService: EncryptionService,private readonly paygate: PaygateService) {}

  //@UseGuards(AuthGuard)
  @Post()
  async getHello(@Request() request, @Body() body): Promise<any> {

    //await this.encryptService.generateKeyPairSync(1024);

    const fs = await require("fs");
    let privateKey = await fs.readFileSync("private-key.pem", "utf8").trim();
    let publicKey = await fs.readFileSync("public-key.pem", "utf8").trim();


    let key = 'hello world';

    ////encrypt payload with aes and rsa the key
    let encrytedPayload = request.headers.payload;// await this.encryptService.encryptAesPayload(body,key);
    let encryptTedKey =  request.headers['x-secret-key']; //this.encryptService.rsaEncrypt(key, publicKey);




    //decrypt key with rsa and decrypt payload with aes using key
    let decryptedKey = this.encryptService.rsaDecrypt(encryptTedKey,privateKey);
    console.log(await this.encryptService.decryptAesPayload(encrytedPayload,decryptedKey));


    return 'test';


  }



}
