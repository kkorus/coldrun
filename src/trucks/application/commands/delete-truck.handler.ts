import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TruckRepositoryPort } from '../ports/truck.repository.port';
import { DeleteTruckCommand } from './delete-truck.command';

@CommandHandler(DeleteTruckCommand)
export class DeleteTruckHandler implements ICommandHandler<DeleteTruckCommand> {
  public constructor(private readonly truckRepository: TruckRepositoryPort) {}

  public async execute(command: DeleteTruckCommand): Promise<void> {
    const deleted = await this.truckRepository.deleteById(command.id);
    if (!deleted) {
      throw new NotFoundException(`Truck with id ${command.id} not found`);
    }
  }
}
