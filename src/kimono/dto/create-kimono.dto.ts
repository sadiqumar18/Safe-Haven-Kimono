import { IsNotEmpty, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TerminalExists } from "../../terminal/decorators/terminal.decorator";


export class TerminalInformationDto {

  @IsNotEmpty()
  readonly batteryInfomation: string;

  @IsNotEmpty()
  readonly currencyCode: string;

  @IsNotEmpty()
  languageInfo: string;

  @IsNotEmpty()
  readonly merchantLocation: string;

  @IsNotEmpty()
  readonly posConditionCode: string;

  @IsNotEmpty()
  readonly posEntryMode: string;

  @IsNotEmpty()
  readonly posDataCode: string;

  @IsNotEmpty()
  readonly posGeoCode: string;

  @IsNotEmpty()
  readonly printerStatus: string;

  @IsNotEmpty()
 // @Validate(TerminalExists)
  readonly terminalId: string;

  @IsNotEmpty()
  readonly terminalType: string;

  @IsNotEmpty()
  readonly transmissionDateTime: string;

  @IsNotEmpty()
  readonly uniqueId: string;

}

export class EmvDataDto {

  @IsNotEmpty()
  readonly amountAuthorized: string;

  @IsNotEmpty()
  readonly amountOther: string;

  @IsNotEmpty()
  readonly applicationInterchangeProfile: string;

  @IsNotEmpty()
  readonly atc: string;

  @IsNotEmpty()
  readonly cryptogram: string;

  @IsNotEmpty()
  readonly cryptogramInformationData: string;

  @IsNotEmpty()
  readonly cvmResults: string;

  @IsNotEmpty()
  readonly iad: string;

  @IsNotEmpty()
  readonly transactionCurrencyCode: string;


  @IsNotEmpty()
  readonly terminalVerificationResult: string;

  @IsNotEmpty()
  readonly terminalCountryCode: string;

  @IsNotEmpty()
  readonly terminalType: string;

  @IsNotEmpty()
  readonly terminalCapabilities: string;

  @IsNotEmpty()
  readonly transactionDate: string;

  @IsNotEmpty()
  readonly transactionType: string;

  @IsNotEmpty()
  readonly unpredictableNumber: string;

  @IsNotEmpty()
  readonly dedicatedFileName: string;

}

export class Track2Dto{

  @IsNotEmpty()
  readonly track2: string;

  @IsNotEmpty()
  readonly pan: string;

  @IsNotEmpty()
  readonly expiryMonth: string;

  @IsNotEmpty()
  readonly expiryYear: string;

}

export class CardDataDto {

  @IsNotEmpty()
  readonly cardSequenceNumber: string;

}

export class PinDataDto {

  //@IsNotEmpty()
  readonly pinBlock: string;

  //@IsNotEmpty()
  readonly ksn: string;

  @IsNotEmpty()
  readonly ksnd: string;

  //to be removed
  // @IsNotEmpty()
  // readonly pinType: string;

}





export class CreateKimonoCashOutDto {

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TerminalInformationDto)
  terminalInformation: TerminalInformationDto;

  @IsNotEmpty()
  @ValidateNested({each:true})
  @Type(() => EmvDataDto)
  emvData: EmvDataDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Track2Dto)
  track2: Track2Dto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CardDataDto)
  cardData: CardDataDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PinDataDto)
  pinData: PinDataDto;


  @IsNotEmpty()
  readonly originalTransmissionDateTime: string;

  @IsNotEmpty()
  readonly stan: string;

  //to be removed
  // @IsNotEmpty()
   //readonly fromAccount: string;

  //to be removed
  //readonly toAccount: string = '';

  @IsNotEmpty()
  //@Min(1)
  readonly minorAmount: string;

  // //to be removed
  // @IsNotEmpty()
  // readonly receivingInstitutionId: string;

  // //to be removed
  // @IsNotEmpty()
  // readonly surcharge: string;

  // //to be removed
  // @IsNotEmpty()
  // readonly keyLabel: string = '';

  //to be removed
  // @IsNotEmpty()
  // readonly destinationAccountNumber: string;

  // //to be removed
  // @IsNotEmpty()
  // readonly extendedTransactionType: string;

  @IsNotEmpty()
  readonly retrievalReferenceNumber: string;

  @IsNotEmpty()
  readonly transactionCurrencyCode: any;

}

export class RequeryKimonoDto{

  // @IsNotEmpty()
  // applicationType: string;

  @IsNotEmpty()
  originalTransactionTran: string;

  @IsNotEmpty()
  originalMinorAmount: string;

  @IsNotEmpty()
  terminalId: string;

  @IsNotEmpty()
  transmissionDate: string;

}
