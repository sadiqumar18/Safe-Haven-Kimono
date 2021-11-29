import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateKimonoCashOutDto, RequeryKimonoDto } from "./dto/create-kimono.dto";
import { UpdateKimonoDto } from "./dto/update-kimono.dto";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map, tap } from "rxjs";
import { xml2json } from "xml-js";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Kimono } from "./interfaces/kimono.interface";
import { Status } from "./schemas/kimono.schema";

@Injectable()
export class KimonoService {

  private token;

  constructor(
    private httpsService: HttpService,
    @InjectModel('Kimono') private readonly kimonoModel: Model<Kimono>
  ) {
    this.httpsService = httpsService;
  }

  async login(terminalId: string) {

    console.log(process.env.MERCHANT_ID);

    let data = `<tokenPassportRequest>
                    <terminalInformation>
                    <merchantId>${process.env.MERCHANT_ID}</merchantId>
                    <terminalId>${terminalId}</terminalId>
                    </terminalInformation>
                    </tokenPassportRequest>`;

    let config = {
      headers: { 'Content-Type': 'text/xml' }
    };

    try {
      return  await lastValueFrom(this.httpsService.post("https://qa.interswitchng.com/kmw/requesttoken/perform-process", data, config).pipe(
        map(response => response.data),
        tap(data => {
          this.token = data.token;
        })
      ));
    }catch (e) {
      return {
        statusCode: 400,
        message: "Transaction failed"
      }
    }
  }


  async create(createKimonoDto: CreateKimonoCashOutDto) {

    await this.login(createKimonoDto.terminalInformation.terminalId);

    let xml = this.cashOutXml(createKimonoDto)

    let record;
    try {

      let res = await lastValueFrom(this.httpsService.post(`https://qa.interswitchng.com/kmw/kimonoservice`, xml, {
        headers: { "Content-Type": "text/xml" }
      }).pipe(
        map(response => response.data)
      ));

      let response = KimonoService.convertXml2Json(res);

      if (response.transferResponse) {
       // record = await this.createRecord('74343884399434', '619b8b3f15081dda7283cf09', createKimonoDto, Status.FAILED);
        return { statusCode: HttpStatus.BAD_REQUEST, message: response.transferResponse.description._text, data: {} };
      }

      let responseCode = response.channelResponse.field39._text;

      if (responseCode != "00") {
        record = await this.createRecord('74343884399434', '619b8b3f15081dda7283cf09', createKimonoDto, Status.SUCCESS);
        //
        return { statusCode: HttpStatus.BAD_REQUEST, message: response.channelResponse.description._text, data: record };
      }

      record = await this.createRecord('74343884399434', '619b8b3f15081dda7283cf09', createKimonoDto, Status.SUCCESS);
      return { statusCode: HttpStatus.OK, message: response.channelResponse.description._text, data: record };
    } catch (e) {
      console.log(e);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Transaction failed"
      }
    }

  }


  private async createRecord(clientId: string, terminalId: string, createKimonoDto: CreateKimonoCashOutDto, status: string) {
    return await this.kimonoModel.create({
      clientId: clientId,
      terminal: terminalId,
      amount: createKimonoDto.minorAmount,
      stan: createKimonoDto.stan,
      retrievalReferenceNumber: createKimonoDto.retrievalReferenceNumber,
      status: status
    });
  }

  private static convertXml2Json(res) {
    return JSON.parse(xml2json(res, { compact: true, spaces: 4 }));
  }

  async requery(requeryKimonoDto: RequeryKimonoDto) {

    let xml = this.requeryXml(requeryKimonoDto);

    try {
    let requeryRes = await lastValueFrom(this.httpsService.post(`https://qa.interswitchng.com/kmw/v2/transaction/requery`, xml, {
      headers: {
        "Content-Type": "text/xml"
        // 'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      map(response => response.data)
    ));


      if (requeryRes.field39 != "00") {
        return { statusCode: HttpStatus.BAD_REQUEST, message: requeryRes.description, data:{}};
      }


      return { statusCode: HttpStatus.OK, message: requeryRes.description,data:{}};

    } catch (e) {

      //TODO requery transaction
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Transaction failed"
      };
    }
  }




  private requeryXml(requeryKimonoDto: RequeryKimonoDto) {
    return `<transactionRequeryRequest>
            <applicationType>${'gTransfer'}</applicationType>
            <originalTransStan>${requeryKimonoDto.originalTransactionTran}</originalTransStan>
            <originalMinorAmount>${requeryKimonoDto.originalMinorAmount}</originalMinorAmount>
            <terminalInformation>
            <terminalId>${requeryKimonoDto.terminalId}</terminalId>
            <merchantId>${process.env.MERCHANT_ID}</merchantId>
            <transmissionDate>${requeryKimonoDto.transmissionDate}</transmissionDate>
            </terminalInformation>
            </transactionRequeryRequest>`
  }

  cashOutXml(createKimonoDto: CreateKimonoCashOutDto){
    return `<transferRequest>
             <terminalInformation>
            <batteryInformation>${createKimonoDto.terminalInformation.batteryInfomation}</batteryInformation>
            <currencyCode>${createKimonoDto.terminalInformation.currencyCode}</currencyCode>
            <languageInfo>${createKimonoDto.terminalInformation.languageInfo}</languageInfo>
            <merchantId>${process.env.MERCHANT_ID}</merchantId>
            <merhcantLocation>${createKimonoDto.terminalInformation.merchantLocation}</merhcantLocation>
            <posConditionCode>${createKimonoDto.terminalInformation.posConditionCode}</posConditionCode>
            <posDataCode>${createKimonoDto.terminalInformation.posDataCode}</posDataCode>
            <posEntryMode>${createKimonoDto.terminalInformation.posGeoCode}</posEntryMode>
            <posGeoCode>${createKimonoDto.terminalInformation.posGeoCode}</posGeoCode>
            <printerStatus>${createKimonoDto.terminalInformation.printerStatus}</printerStatus>
            <terminalId>${createKimonoDto.terminalInformation.terminalId}</terminalId>
            <terminalType>${createKimonoDto.terminalInformation.terminalType}</terminalType>
            <transmissionDate>${createKimonoDto.terminalInformation.transmissionDateTime}</transmissionDate>
            <uniqueId>${createKimonoDto.terminalInformation.uniqueId}</uniqueId>
        </terminalInformation>
        <cardData>
            <cardSequenceNumber>${createKimonoDto.cardData.cardSequenceNumber}</cardSequenceNumber>
            <emvData>
                <AmountAuthorized>${createKimonoDto.emvData.amountAuthorized}</AmountAuthorized>
                <AmountOther>${createKimonoDto.emvData.amountOther}</AmountOther>
                <ApplicationInterchangeProfile>${createKimonoDto.emvData.applicationInterchangeProfile}</ApplicationInterchangeProfile>
                <atc>${createKimonoDto.emvData.atc}</atc>
                <Cryptogram>${createKimonoDto.emvData.cryptogram}</Cryptogram>
                <CryptogramInformationData>${createKimonoDto.emvData.cryptogramInformationData}</CryptogramInformationData>
                <CvmResults>${createKimonoDto.emvData.cvmResults}</CvmResults>
                <iad>${createKimonoDto.emvData.iad}</iad>
                <TransactionCurrencyCode>${createKimonoDto.emvData.transactionCurrencyCode}</TransactionCurrencyCode>
                <TerminalVerificationResult>${createKimonoDto.emvData.terminalVerificationResult}</TerminalVerificationResult>
                <TerminalCountryCode>${createKimonoDto.emvData.terminalCountryCode}</TerminalCountryCode>
                <TerminalType>${createKimonoDto.terminalInformation.terminalType}</TerminalType>
                <TerminalCapabilities>${createKimonoDto.emvData.terminalCapabilities}</TerminalCapabilities>
                <TransactionDate>${createKimonoDto.emvData.transactionDate}</TransactionDate>
                <TransactionType>${createKimonoDto.emvData.transactionType}</TransactionType>
                <UnpredictableNumber>${createKimonoDto.emvData.unpredictableNumber}</UnpredictableNumber>
                <DedicatedFileName>${createKimonoDto.emvData.dedicatedFileName}</DedicatedFileName>
            </emvData>
            <track2>
                <pan>${createKimonoDto.track2.pan}</pan>
                <expiryMonth>${createKimonoDto.track2.expiryMonth}</expiryMonth>
                <expiryYear>${createKimonoDto.track2.expiryYear}</expiryYear>
                <track2>${createKimonoDto.track2.track2}</track2>
            </track2>
        </cardData>
        <originalTransmissionDateTime>${createKimonoDto.originalTransmissionDateTime}</originalTransmissionDateTime>
        <stan>${createKimonoDto.stan}</stan>
        <fromAccount>${'Savings'}</fromAccount>
        <toAccount></toAccount>
        <minorAmount>${createKimonoDto.minorAmount}</minorAmount>
        <receivingInstitutionId>${'627821'}</receivingInstitutionId>
        <surcharge>${'1075'}</surcharge>
        <pinData>
            <ksnd>${createKimonoDto.pinData.ksnd}</ksnd>
            <ksn>${createKimonoDto.pinData.ksn || ''}</ksn>
            <pinType>${'Dukpt'}</pinType>
            <pinBlock>${createKimonoDto.pinData.pinBlock || ''}</pinBlock>
        </pinData>
        <keyLabel>${'000006'}</keyLabel>
        <destinationAccountNumber>${'2000000001'}</destinationAccountNumber>
        <extendedTransactionType>${'6103'}</extendedTransactionType>
        <retrievalReferenceNumber>${createKimonoDto.retrievalReferenceNumber}</retrievalReferenceNumber>
        </transferRequest>`
  }

  async findAll() {
    const records = await this.kimonoModel.find({}).populate('terminal').sort({ createdAt: -1 }).exec();
    return { statusCode: HttpStatus.OK, data: records };
  }

  async findOne(id: number, clientId: string) {
    const query = {
      _id: id,
      clientId: clientId
    };
    const record = await this.kimonoModel.findOne(query).populate('terminal').exec();
    return { statusCode: HttpStatus.OK, data: record };
  }

  update(id: number, updateKimonoDto: UpdateKimonoDto) {
    let update  = {updateKimonoDto}
    return this.kimonoModel.findOneAndUpdate({ id }, update, { new: true }).populate('terminal').exec();
  }


  remove(id: number, clientID: string) {
    return this.kimonoModel.findOneAndRemove({ id, clientID }).exec();
  }


}
