import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateKimonoCashOutDto, RequeryKimonoDto } from "./dto/create-kimono.dto";
import { UpdateKimonoDto } from "./dto/update-kimono.dto";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom, map, tap } from "rxjs";
import { xml2json } from "xml-js";

@Injectable()
export class KimonoService {

  private token;

  constructor(private httpsService: HttpService) {
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

    try {
      let res = await lastValueFrom(this.httpsService.post(`https://qa.interswitchng.com/kmw/kimonoservice`, xml, { headers: { "Content-Type": "text/xml"
          // 'Authorization': `Bearer ${this.token}`
        }
      }).pipe(
        map(response => response.data)
      ));
      let response = KimonoService.convertXml2Json(res);

      if (response.transferResponse){
        return {statusCode:HttpStatus.BAD_REQUEST,message:response.transferResponse.description._text};
      }

      let responseCode = response.channelResponse.field39._text;

      if (responseCode != "00") {
        return {statusCode:HttpStatus.BAD_REQUEST,message:response.channelResponse.description._text,data:{}};
      }

      return {statusCode:HttpStatus.OK,message:response.channelResponse.description._text};
    }catch (e) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Transaction failed"
      }
    }

  }


  private static convertXml2Json(res) {
    return JSON.parse(xml2json(res, { compact: true, spaces: 4 }));
  }

  async requery(requeryKimonoDto: RequeryKimonoDto) {
    let xml = this.requeryXml(requeryKimonoDto);

    let requeryRes;
    try {
      requeryRes = await lastValueFrom(this.httpsService.post(`https://qa.interswitchng.com/kmw/v2/transaction/requery`, xml, {
        headers: {
          "Content-Type": "text/xml"
          // 'Authorization': `Bearer ${this.token}`
        }
      }).pipe(
        map(response => response.data)
      ));

      let response = KimonoService.convertXml2Json(requeryRes);

      if (response.transferResponse) {
        return { statusCode: HttpStatus.BAD_REQUEST, message: response.transferResponse.description._text };
      }

      let responseCode = response.channelResponse.field39._text;

      if (responseCode != "00") {
        return { statusCode: HttpStatus.BAD_REQUEST, message: response.channelResponse.description._text, data: {} };
      }

      return { statusCode: HttpStatus.OK, message: response.channelResponse.description._text };

    } catch (e) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Transaction failed"
      };
    }
  }


  private requeryXml(requeryKimonoDto: RequeryKimonoDto) {
    return `<transactionRequeryRequest>
            <applicationType>${requeryKimonoDto.applicationType}</applicationType>
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
        <fromAccount>${createKimonoDto.fromAccount}</fromAccount>
        <toAccount>${createKimonoDto.toAccount ?? ''}</toAccount>
        <minorAmount>${createKimonoDto.minorAmount}</minorAmount>
        <receivingInstitutionId>${createKimonoDto.receivingInstitutionId}</receivingInstitutionId>
        <surcharge>${createKimonoDto.surcharge}</surcharge>
        <pinData>
            <ksnd>${createKimonoDto.pinData.ksnd}</ksnd>
            <ksn>${createKimonoDto.pinData.ksn ?? ''}</ksn>
            <pinType>${createKimonoDto.pinData.pinType}</pinType>
            <pinBlock>${createKimonoDto.pinData.pinBlock ?? ''}</pinBlock>
        </pinData>
        <keyLabel>${createKimonoDto.keyLabel}</keyLabel>
        <destinationAccountNumber>${createKimonoDto.destinationAccountNumber}</destinationAccountNumber>
        <extendedTransactionType>${createKimonoDto.extendedTransactionType}</extendedTransactionType>
        <retrievalReferenceNumber>${createKimonoDto.retrievalReferenceNumber}</retrievalReferenceNumber>
        </transferRequest>`
  }

  findAll() {
    return `This action returns all kimono`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kimono`;
  }

  update(id: number, updateKimonoDto: UpdateKimonoDto) {
    return `This action updates a #${id} kimono`;
  }

  remove(id: number) {
    return `This action removes a #${id} kimono`;
  }


}
