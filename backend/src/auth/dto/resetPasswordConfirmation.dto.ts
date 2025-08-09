import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class resetPasswordConfirmationDto{
    @ApiProperty()
    @IsEmail()
    readonly email : string
    @ApiProperty()
    @IsNotEmpty()
    readonly password : string
    @ApiProperty()
    @IsNotEmpty()
    readonly code: string
}