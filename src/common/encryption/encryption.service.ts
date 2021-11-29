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
    const bytes = await CryptoJS.AES.decrypt(cipherText, aesKey);
    return  JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }


  public async encryptAesPayload(payload: string, aesKey: string): Promise<string> {
    return CryptoJS.AES.encrypt(JSON.stringify(payload), aesKey);
  }


  public rsaEncrypt(text: string, publicKey: string): string {
    const buffer = Buffer.from(JSON.stringify(text));
    const encrypted = publicEncrypt({
      key: publicKey
      // oaepHash: "sha256",
    }, buffer);
    return encrypted.toString("base64");
  }


  public rsaDecrypt(text: string, privateKey: string): string {
    const buffer = Buffer.from(text, "base64");
    const decrypted = privateDecrypt({
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING
      // oaepHash: "sha256",
    }, buffer);
    return decrypted.toString();
  }


  public async generateKeyPairSync(bits: number): Promise<any> {
    let { publicKey, privateKey } =
      generateKeyPairSync("rsa", {
        modulusLength: bits,
        publicKeyEncoding: {
          type: "spki",
          format: "pem"
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem"
        }
      });
    this.publicKey = publicKey;
    this.privateKey = privateKey;

    console.log("publicKey: ", publicKey);
    console.log("privateKey: ", privateKey);
  }


}
