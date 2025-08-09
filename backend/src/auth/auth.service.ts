import { resetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { resetPasswordDemandDto } from './dto/resetPasswordDemand.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from './../mailer/mailer.service';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy'
import { deleteAccountDto } from './dto/deleteAccount.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly PrismaService: PrismaService,
        private readonly MailerService: MailerService,
        private readonly JwtService: JwtService,
        private readonly ConfigService: ConfigService,
    ) {}
    async signup(SignupDto: SignupDto) {
        const { email, password, name } = SignupDto;
        const user = await this.PrismaService.user.findUnique({ where: {email } });
        if (user) throw new ConflictException('User already exists');
        const hash = await bcrypt.hash(password, 10);
        await this.PrismaService.user.create({
            data: { email, name, password: hash },
        })
        await this.MailerService.sendSignupConfirmation(email);
        return {data: 'User successfully created'}
    }
   
    async signin(signinDto: SigninDto) {
        const {email, password } = signinDto;
        const user = await this.PrismaService.user.findUnique({ where: {email } });
        if (!user) throw new NotFoundException('User not found');
        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new UnauthorizedException('Password does not match');
        const payload = {
            sub: user.id,
            email: user.email,
        };
        const token = this.JwtService.sign(payload, {
            expiresIn: '2h',
            secret: this.ConfigService.get('JWT_SECRET'),
        });

        return {
            token,
            user: {
                id: user.id, 
                name: user.name,
                email: user.email,
            },
        };
    }

    async resetPasswordDemand(resetPasswordDemandDto:resetPasswordDemandDto) {
        const { email } = resetPasswordDemandDto;
        const user = await this.PrismaService.user.findUnique({ where: {email } });
        if (!user) throw new NotFoundException('User not found');
        const code = speakeasy.totp({
            secret: this.ConfigService.get<string>('OTP_CODE') || 'default-secret',
            digits: 5,
            step: 60 * 15,
            encoding: "base32"
        })
        //on devrait fournir un url de frontend, mais vu nous travaillons seulement avec le backend, on vas customiser
        //ce message dans le service de mailer
        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.MailerService.sendResetPassword(email, url, code)
        return {data: "Reset password mail has been sent"}
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDto: resetPasswordConfirmationDto) {
        const {code, email, password } = resetPasswordConfirmationDto;
        const user = await this.PrismaService.user.findUnique({ where: {email}});
        if (!user) throw new NotFoundException('User not found');
        const match = speakeasy.totp.verify({
            secret: this.ConfigService.get<string>('OTP_CODE') || 'default-secret',
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: 'base32',
        });
        if(!match) throw new UnauthorizedException('Invalid/expired token')
            const hash = await bcrypt.hash(password, 10)
        await this.PrismaService.user.update({where: {email}, data: {password: hash}})
        return {data: 'Password update'}
    }
    async deleteAccount(id: string, deleteAccountDto: deleteAccountDto) {
        const { password } = deleteAccountDto;
        const user = await this.PrismaService.user.findUnique({
            where: { id},
        });
        if (!user) throw new NotFoundException('User not found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Password does not match');
        await this.PrismaService.user.delete({ where: { id: id.toString() }});
        return { data: 'User successfully deleted' };
    }
}
