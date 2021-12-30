import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { KimonoService } from './kimono.service';
import { CreateKimonoCashOutDto, RequeryKimonoDto } from './dto/create-kimono.dto';
import { UpdateKimonoDto } from './dto/update-kimono.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kimono } from './interfaces/kimono.interface';
import { EncryptionService } from './encryption.service';
import * as fs from 'fs';
import { Response } from 'express';
import { AppConfig } from '../app.config';

@Controller('kimono')
export class KimonoController {
  constructor(
    private readonly kimonoService: KimonoService,
    private readonly encryptionService: EncryptionService,
    @InjectModel('Kimono') private readonly kimono: Model<Kimono>
  ) {}

  //@UseGuards(AuthGuard)
  @Post()
  async create(@Body() createKimonoDto: CreateKimonoCashOutDto) {
    return this.kimonoService.create(createKimonoDto);
  }

  @Post('/decrypt')
  async decrypt(@Body() data: any) {

    let rsaPrivateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqX6giF4VPB2R4\nkswWs9h+aZxUEIM/MMhyT+j92CrpVXNI6pw6EHHO5ucqK8OzeNdT2Jl0iJJ1tZAz\nfumfO6Y+FvGxd7pyOxzzjZez1jDBTHVivS/qH7ClF07apnHLeTFFrrrANFNbm7oD\nCCCWSPr1LClo7uWQ/XDOh14ZUudoupORu8CL0Mnbuptd0pKW4nmnhdQIiNpIm/q7\ncBmYGoeWrAG8a5SY5uhXrHnon8QiNjCylCN7FiVFwydAYYJVho6VQbWXziNmPVPd\n+0/P5FWEJunM3gYsveRd1CYvi/GKNFYea4p7rvKAt58tWdJXBCIjOi2cctBcndVU\nrPjGE2adAgMBAAECggEAWj1AOI5stWcc+CAIqR2o1YvqmTwFyDp2cNWSeqE8WUpB\nPaXGCZscLJJwbg2wIicnJenbnbWYnXAFaMEXzJczfj941J6tykM1GmssprwUJs3w\nftPlxQPz8/1cbsMqErOmPVpG3/bXD/Zzl5d+axtMkP9LD6E5Rop2bW2VkaQvnXAX\niinXjULDaTDRhSIIA7srZ1DzhxjE4q1vvRREvRNMOa9Q4anAAJSITSvKo56LkGjj\nwJ1030awt1v7CV5CIRx9Z+lm6MViJ5ZY+D23dWREyW9tbhRfWh39GPnZoSPnfnkj\nuPPDxRMUvLfbYyc+mWYAncPaoqRQDf9ibxYmX3YZoQKBgQDdl105UlYPxoKqpyit\nWmN/7V2uyCC1BR8azldGhfN9KcdqpIxdJp78HDyGsDnjklntfquJfKOBApwLnIU5\njJxBsax5+hMmGTfQRonn9+q4mBkwlFNlYO2Y4Wf+hME/Wt3rAmvdVo/GeAqzE+mW\ni69veevYHy+wfb96YsDI53s/0wKBgQDE1E3grL905+87ilQhfdghamp/0N2VsRed\nAHp0qU9E233LLs2ubofQIr7GcZ52yHejIBNlGGGmV3kZmDpc96c6gfJ2EaIhBKAH\nwu99iFtcCg2sQmGVTWWR8HuX+wy2TB/yBsM5y1UkuCp5FiyMQ+R3KWunZF8/XALf\neELCJcYpzwKBgF0KGdVgkcwL4H9Asl6fDhn/kw847iqzXM0HiDOPOJ379cP8FQdj\nmOtn+63dvmCj6WhDgEi48XnQm65waKuyM0WOEUohyvp7KikkBPFF8eLR0fnIvX9a\nhEhllCGUogM05uqu2JVVrAZ8DpoEKVbRjbazrWfQKFjlY4lCf4mbT++LAoGBAIXm\niDRYUMcPIci3ihResDHLWzgotxWmrBG6yZOjurF1QFaBOJt5xhrqCC6oDM1yAzGO\nGKOluoiW6WNoFAw6ziEXVgLMbCdaJiQhkRstMDmk/Tg60HfpdzeZCfuSZkt97h2Q\nTC99DCc2wm4tj5C8fygxnXL67XEE/09XWNMLL4wxAoGBALRvz4GyCqfkrz1WIW1Q\ntIdGAR6Ni2wGmZArPGAA7fzs71xqRQfzsG34HqxHzG0sv9OUFzvPKrbi+o2AgwA9\ncskFLMv1/CD3ulRDxFefZtVvW6gnUoJ4/WCQRy9iMkVZiThtg3HfzucLVgOxFuJR R3VFLJKYxbzbpeSavF3gPGOm\n-----END PRIVATE KEY-----"

    try {
      return JSON.parse(this.encryptionService.rsaDecrypt(data.securePayload, rsaPrivateKey));
    }catch (e) {
      return {statusCode: HttpStatus.BAD_REQUEST, message: e.message};
    }
  }

  @Post('requery')
  requery(@Body() requeryKimonoDto: RequeryKimonoDto) {
    return this.kimonoService.requery(requeryKimonoDto);

  }

  @Get()
  findAll() {
    return this.kimonoService.findAll();
  }

  @Get(':id/:clientID')
  findOne(@Param('id') id: string, @Param('clientID') clientID: string) {
    return this.kimonoService.findOne(+id, clientID);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKimonoDto: UpdateKimonoDto) {
    return this.kimonoService.update(+id, updateKimonoDto);
  }

  @Delete(':id/:clientID')
  remove(@Param('id') id: string , @Param('clientID') clientID: string) {
    return this.kimonoService.remove(+id, clientID);
  }
}
