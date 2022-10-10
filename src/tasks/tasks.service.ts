import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Brackets, Repository } from 'typeorm';
import { TasksStatus } from './enum/status';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('tasks');
    query.andWhere({ user });
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

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) throw new NotFoundException(`Task with id: ${id} not found`);

    return task;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.taskRepository.create({ title, description, user });
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string, user: User) {
    const task = await this.getTaskById(id, user);
    return this.taskRepository.delete(task);
  }

  async updateTaskStatus(
    id: string,
    status: TasksStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    const updatedTask = { ...task, status };

    return this.taskRepository.save(updatedTask);
  }
}
