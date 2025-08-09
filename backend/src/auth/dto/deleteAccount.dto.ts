import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class deleteAccountDto{
    @ApiProperty()
    @IsNotEmpty()
    readonly password : string

}