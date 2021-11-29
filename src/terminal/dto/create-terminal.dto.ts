import { IsNotEmpty } from "class-validator";

export class CreateTerminalDto {

  @IsNotEmpty()
  clientId: String;

  @IsNotEmpty()
  serialNumber: String;

  @IsNotEmpty()
  terminalId: String;

}
