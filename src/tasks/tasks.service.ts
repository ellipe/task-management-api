import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { TasksStatus } from './enum/status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('tasks');
    if (status) query.andWhere('tasks.status = :status', { status });
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(tasks.description) like LOWER(:search)', {
            search: `%${search}%`,
          });
          qb.orWhere('LOWER(tasks.title) like LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    return query.getMany();
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id: ${id} not found`);

    return task;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({ title, description });
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string) {
    const task = await this.getTaskById(id);
    return this.taskRepository.delete(task);
  }

  async updateTaskStatus(id: string, status: TasksStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    const updatedTask = { ...task, status };

    return this.taskRepository.save(updatedTask);
  }
}
