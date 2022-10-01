import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TasksStatus } from '../tasks.model';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TasksStatus)
  status: TasksStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
