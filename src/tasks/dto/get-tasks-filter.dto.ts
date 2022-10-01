import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TasksStatus } from '../tasks.model';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TasksStatus)
  status: TasksStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
