import { Injectable } from "@nestjs/common";
import { constants, generateKeyPairSync, privateDecrypt, publicEncrypt } from "crypto";

const CryptoJS = require("crypto-js");


@Injectable()
export class EncryptionService {

  public publicKey: string;
  public privateKey: string;
  public aesKey: string;

  constructor() {
  }


  public async decryptAesPayload(cipherText: string, aesKey: string): Promise<string> {
    return JSON.parse(CryptoJS.AES.decrypt(cipherText, aesKey,{
      mode: CryptoJS.mode.ECB,
    }).toString(CryptoJS.enc.Utf8))
  }


  public async encryptAesPayload(payload: string, aesKey: string): Promise<string> {
    return CryptoJS.AES.encrypt(JSON.stringify(payload), aesKey,{
      mode: CryptoJS.mode.ECB,
    }).toString();
  }


  public async rsaEncrypt(text: string, publicKey: string): Promise<string> {
    const buffer = Buffer.from(JSON.stringify(text));
    const encrypted = publicEncrypt({
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha1",
    }, buffer);
    return encrypted.toString("base64");
  }


  public rsaDecrypt(text: string, privateKey: string): string {
    const buffer = Buffer.from(text, "base64");
    const decrypted = privateDecrypt({
      key: privateKey,
      oaepHash: "sha1",
    }, buffer);
    return decrypted.toString();
  }


  public async generateRsaKeys(): Promise<void> {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    console.log(publicKey);
    console.log(privateKey);
  }





}
