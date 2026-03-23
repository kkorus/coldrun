import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TRUCK_STATUSES, type TruckStatus } from '../../domain/truck-status';

export class UpdateTruckDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'code must be alphanumeric' })
  public readonly code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly name?: string;

  @IsOptional()
  @IsIn([...TRUCK_STATUSES])
  public readonly status?: TruckStatus;

  @IsOptional()
  @IsString()
  public readonly description?: string;
}
