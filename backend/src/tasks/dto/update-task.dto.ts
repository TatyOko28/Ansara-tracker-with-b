import { PartialType } from '@nestjs/swagger'; // Changement important : utilisez depuis swagger
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}