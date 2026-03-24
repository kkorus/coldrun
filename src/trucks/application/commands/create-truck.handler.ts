import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { Truck } from '../../domain/truck';
import { DuplicateTruckCodeError } from '../../domain/truck.errors';
import { TruckRepositoryPort } from '../ports/truck.repository.port';
import { CreateTruckCommand } from './create-truck.command';

@CommandHandler(CreateTruckCommand)
export class CreateTruckHandler implements ICommandHandler<
  CreateTruckCommand,
  Truck
> {
  public constructor(private readonly truckRepository: TruckRepositoryPort) {}

  public async execute(command: CreateTruckCommand): Promise<Truck> {
    const existing = await this.truckRepository.findByCode(command.code);
    if (existing) {
      throw new ConflictException(
        `Truck with code "${command.code}" already exists`,
      );
    }

    try {
      return await this.truckRepository.create({
        code: command.code,
        name: command.name,
        status: command.status,
        description: command.description,
      });
    } catch (e) {
      if (e instanceof DuplicateTruckCodeError) {
        throw new ConflictException(e.message);
      }
      throw e;
    }
  }
}
