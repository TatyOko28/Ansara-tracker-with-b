import { AuthService } from './auth.service';
import { Body, Controller, Delete, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { resetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { deleteAccountDto } from './dto/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}
    @Post('signup')
    signup(@Body() SignupDto: SignupDto) {
        return this.AuthService.signup(SignupDto)
    }
    @Post('signin')
    signin(@Body() SigninDto: SigninDto) {
        return this.AuthService.signin(SigninDto)
    }
    @Post('reset-password')
    resetPasswordDemand(@Body() resetPasswordDemandDto: resetPasswordDemandDto ) {
        return this.AuthService.resetPasswordDemand(resetPasswordDemandDto)
    }
    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto: resetPasswordConfirmationDto) {
        return this.AuthService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Delete('delete')
    deleteAccount(@Req() request: Request, @Body() deleteAccountDto: deleteAccountDto) {
        const id = (request.user as any)['id'];
        if (!id) throw new UnauthorizedException('User not authenticated')
        return this.AuthService.deleteAccount(id, deleteAccountDto);
    }
}
