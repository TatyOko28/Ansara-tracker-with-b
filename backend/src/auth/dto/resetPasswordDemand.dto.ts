import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class resetPasswordDemandDto{
    @ApiProperty()
    @IsEmail()
    readonly email : string
}