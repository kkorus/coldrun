import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TRUCK_STATUSES, type TruckStatus } from '../../domain/truck-status';

export class CreateTruckDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'code must be alphanumeric' })
  public readonly code!: string;

  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsIn([...TRUCK_STATUSES])
  public readonly status!: TruckStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly description?: string;
}
