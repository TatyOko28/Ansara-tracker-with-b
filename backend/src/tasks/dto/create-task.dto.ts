import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Category, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
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
  @IsEnum(Status)
  status: Status;

  @ApiProperty({ required: false, description: 'Planned start datetime (ISO string)' })
  @IsOptional()
  @IsDateString()
  startTime?: string;
}
