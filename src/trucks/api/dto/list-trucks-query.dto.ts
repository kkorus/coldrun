import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import type { ListTrucksSortField } from '../../domain/truck';
import { TRUCK_STATUSES, type TruckStatus } from '../../domain/truck-status';

const SORT_FIELDS: readonly ListTrucksSortField[] = [
  'code',
  'name',
  'status',
  'createdAt',
  'updatedAt',
];

export class ListTrucksQueryDto {
  @IsOptional()
  @IsIn([...TRUCK_STATUSES])
  public readonly status?: TruckStatus;

  @IsOptional()
  @IsString()
  public readonly codeContains?: string;

  @IsOptional()
  @IsString()
  public readonly nameContains?: string;

  @IsOptional()
  @IsIn([...SORT_FIELDS])
  public readonly sortField?: ListTrucksSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public readonly skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public readonly limit?: number;
}
