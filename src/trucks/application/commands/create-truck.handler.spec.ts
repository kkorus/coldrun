import { ConflictException } from '@nestjs/common';
import { DuplicateTruckCodeError } from '../../domain/truck.errors';
import { buildTruck } from '../../test-helpers/truck.factory';
import { createMockTruckRepository } from '../../test-helpers/mock-truck-repository';
import { TruckStatus } from '../../domain/truck-status';
import { CreateTruckCommand } from './create-truck.command';
import { CreateTruckHandler } from './create-truck.handler';

describe('CreateTruckHandler', () => {
  let handler: CreateTruckHandler;
  let repo: ReturnType<typeof createMockTruckRepository>;

  beforeEach(() => {
    repo = createMockTruckRepository();
    handler = new CreateTruckHandler(repo);
  });

  it('creates a truck when code does not exist', async () => {
    // given
    const command = new CreateTruckCommand(
      'TRK001',
      'Big Truck',
      TruckStatus.OUT_OF_SERVICE,
      undefined,
    );
    const expectedTruck = buildTruck({ code: 'TRK001', name: 'Big Truck' });
    repo.findByCode.mockResolvedValue(null);
    repo.create.mockResolvedValue(expectedTruck);

    // when
    const result = await handler.execute(command);

    // then
    expect(repo.findByCode).toHaveBeenCalledWith('TRK001');
    expect(repo.create).toHaveBeenCalledWith({
      code: 'TRK001',
      name: 'Big Truck',
      status: TruckStatus.OUT_OF_SERVICE,
      description: undefined,
    });
    expect(result).toBe(expectedTruck);
  });

  it('throws ConflictException when code already exists', async () => {
    // given
    const command = new CreateTruckCommand(
      'DUPCODE',
      'Truck',
      TruckStatus.OUT_OF_SERVICE,
      undefined,
    );
    repo.findByCode.mockResolvedValue(buildTruck({ code: 'DUPCODE' }));

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      ConflictException,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('throws ConflictException when repository reports duplicate code (race)', async () => {
    // given
    const command = new CreateTruckCommand(
      'RACE1',
      'Truck',
      TruckStatus.OUT_OF_SERVICE,
      undefined,
    );
    repo.findByCode.mockResolvedValue(null);
    repo.create.mockRejectedValue(new DuplicateTruckCodeError('RACE1'));

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      ConflictException,
    );
  });
});
