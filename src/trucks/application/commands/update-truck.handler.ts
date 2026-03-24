import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { Truck } from '../../domain/truck';
import {
  DuplicateTruckCodeError,
  InvalidStatusTransitionError,
  TruckNotFoundForSaveError,
} from '../../domain/truck.errors';
import { TruckRepositoryPort } from '../ports/truck.repository.port';
import { UpdateTruckCommand } from './update-truck.command';

@CommandHandler(UpdateTruckCommand)
export class UpdateTruckHandler implements ICommandHandler<
  UpdateTruckCommand,
  Truck
> {
  public constructor(private readonly truckRepository: TruckRepositoryPort) {}

  public async execute(command: UpdateTruckCommand): Promise<Truck> {
    const truck = await this.truckRepository.findById(command.id);
    if (!truck) {
      throw new NotFoundException(`Truck with id ${command.id} not found`);
    }

    if (command.status !== undefined) {
      try {
        truck.changeStatus(command.status);
      } catch (e) {
        if (e instanceof InvalidStatusTransitionError) {
          throw new UnprocessableEntityException(e.message);
        }
        throw e;
      }
    }

    if (command.code !== undefined && command.code !== truck.code) {
      const conflict = await this.truckRepository.findByCode(command.code);
      if (conflict) {
        throw new ConflictException(
          `Truck with code "${command.code}" already exists`,
        );
      }
      truck.changeCode(command.code);
    }

    if (command.name !== undefined) {
      truck.rename(command.name);
    }

    if (command.description !== undefined) {
      truck.updateDescription(command.description);
    }

    try {
      return await this.truckRepository.save(truck);
    } catch (e) {
      if (e instanceof DuplicateTruckCodeError) {
        throw new ConflictException(e.message);
      }
      if (e instanceof TruckNotFoundForSaveError) {
        throw new NotFoundException(`Truck with id ${command.id} not found`);
      }
      throw e;
    }
  }
}
