import { IsEnum } from 'class-validator';
import { TasksStatus } from '../tasks.model';

export class UpdateTaskStatusDto {
  @IsEnum(TasksStatus)
  status: TasksStatus;
}
