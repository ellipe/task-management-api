import { IsEnum } from 'class-validator';
import { TasksStatus } from '../enum/status';

export class UpdateTaskStatusDto {
  @IsEnum(TasksStatus)
  status: TasksStatus;
}
