import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Category, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CompletedTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsEnum(Category)
  category: Category;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;
}
