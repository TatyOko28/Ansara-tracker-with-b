import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Patch,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompletedTaskDto } from './dto/completed-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Task')
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly tasks: TasksService) {}
  
    @Get()
    findAll(@Request() req) {
      return this.tasks.findAll(req.user.id);
    }
  
    @Post()
    create(@Request() req, @Body() dto: CreateTaskDto) {
      return this.tasks.create(req.user.id, dto);
    }
  
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
      return this.tasks.findOne(id, req.user.id);
    }
  
    @Put(':id')
    update(
      @Request() req,
      @Param('id') id: string,
      @Body() dto: UpdateTaskDto,
    ) {
      return this.tasks.update(id, req.user.id, dto);
    }
  
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
      return this.tasks.remove(id, req.user.id);
    }
  
    @Patch(':id/start')
    start(@Request() req, @Param('id') id: string) {
      return this.tasks.start(id, req.user.id);
    }
  
    @Patch(':id/stop')
    stop(@Request() req, @Param('id') id: string) {
      return this.tasks.stop(id, req.user.id);
    }
  
    @Patch(':id/move')
    move(
      @Request() req,
      @Param('id') id: string,
      @Body('category') category: string,
    ) {
      return this.tasks.move(id, req.user.id, category);
    }
  
    @Post('completed')
    addCompleted(@Request() req, @Body() dto: CompletedTaskDto) {
      return this.tasks.addCompleted(req.user.id, dto);
    }
  }
  