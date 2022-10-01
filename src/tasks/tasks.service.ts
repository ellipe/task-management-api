import { Injectable } from '@nestjs/common';
import { Task, TasksStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let filteredTasks = this.tasks;
    if (status)
      filteredTasks = filteredTasks.filter((task) => task.status === status);

    if (search)
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TasksStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TasksStatus): Task {
    const task = this.getTaskById(id);
    const updatedTask = { ...task, status };

    this.tasks = this.tasks.map((task) => {
      if (task.id === id) return updatedTask;
      return task;
    });
    return updatedTask;
  }
}
