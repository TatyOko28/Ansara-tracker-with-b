import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompletedTaskDto } from './dto/completed-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        status: dto.status,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        status: dto.status,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.task.delete({ where: { id } });
  }

  async start(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { startTime: new Date(), status: 'IN_PROGRESS' },
    });
  }

  async stop(id: string, userId: string) {
    const now = new Date();
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { endTime: now, status: 'DONE' },
    });
  }

  async move(id: string, userId: string, category: string) {
    await this.findOne(id, userId);
    return this.prisma.task.update({
      where: { id },
      data: { category },
    });
  }

  async addCompleted(userId: string, dto: CompletedTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        status: 'DONE',
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }
}
