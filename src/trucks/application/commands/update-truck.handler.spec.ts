import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  DuplicateTruckCodeError,
  TruckNotFoundForSaveError,
} from '../../domain/truck.errors';
import { buildTruck } from '../../test-helpers/truck.factory';
import { createMockTruckRepository } from '../../test-helpers/mock-truck-repository';
import { TruckStatus } from '../../domain/truck-status';
import { UpdateTruckCommand } from './update-truck.command';
import { UpdateTruckHandler } from './update-truck.handler';

describe('UpdateTruckHandler', () => {
  let handler: UpdateTruckHandler;
  let repo: ReturnType<typeof createMockTruckRepository>;

  beforeEach(() => {
    repo = createMockTruckRepository();
    handler = new UpdateTruckHandler(repo);
  });

  it('throws NotFoundException when truck does not exist', async () => {
    // given
    const command = new UpdateTruckCommand(
      'missing-id',
      undefined,
      'New Name',
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(null);

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnprocessableEntityException on invalid status transition', async () => {
    // given
    const truck = buildTruck({ status: TruckStatus.LOADING });
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      undefined,
      TruckStatus.AT_JOB,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      UnprocessableEntityException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('throws ConflictException when new code is already taken', async () => {
    // given
    const truck = buildTruck({ code: 'OLD' });
    const existingWithNewCode = buildTruck({ code: 'NEW' });
    const command = new UpdateTruckCommand(
      truck.id,
      'NEW',
      undefined,
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.findByCode.mockResolvedValue(existingWithNewCode);

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      ConflictException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('renames the truck and saves', async () => {
    // given
    const truck = buildTruck({ name: 'Old Name' });
    const saved = buildTruck({ id: truck.id, name: 'New Name' });
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      'New Name',
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockResolvedValue(saved);

    // when / then
    await expect(handler.execute(command)).resolves.toBe(saved);
    expect(truck.name).toBe('New Name');
    expect(repo.save).toHaveBeenCalledWith(truck);
  });

  it('changes status via aggregate and saves', async () => {
    // given
    const truck = buildTruck({ status: TruckStatus.OUT_OF_SERVICE });
    const saved = buildTruck({ id: truck.id, status: TruckStatus.LOADING });
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      undefined,
      TruckStatus.LOADING,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockResolvedValue(saved);

    // when / then
    await expect(handler.execute(command)).resolves.toBe(saved);
    expect(truck.status).toBe(TruckStatus.LOADING);
    expect(repo.save).toHaveBeenCalledWith(truck);
  });

  it('changes code when new code is not taken', async () => {
    // given
    const truck = buildTruck({ code: 'OLD' });
    const saved = buildTruck({ id: truck.id, code: 'NEW' });
    const command = new UpdateTruckCommand(
      truck.id,
      'NEW',
      undefined,
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.findByCode.mockResolvedValue(null);
    repo.save.mockResolvedValue(saved);

    // when / then
    await expect(handler.execute(command)).resolves.toBe(saved);
    expect(truck.code).toBe('NEW');
    expect(repo.save).toHaveBeenCalledWith(truck);
  });

  it('does not call findByCode when code is unchanged', async () => {
    // given
    const truck = buildTruck({ code: 'SAME' });
    const saved = buildTruck({ id: truck.id });
    const command = new UpdateTruckCommand(
      truck.id,
      'SAME',
      undefined,
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockResolvedValue(saved);

    // when
    await handler.execute(command);

    // then
    expect(repo.findByCode).not.toHaveBeenCalled();
  });

  it('updates description', async () => {
    // given
    const truck = buildTruck({ description: undefined });
    const saved = buildTruck({ id: truck.id, description: 'New desc' });
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      undefined,
      undefined,
      'New desc',
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockResolvedValue(saved);

    // when
    await handler.execute(command);

    // then
    expect(truck.description).toBe('New desc');
  });

  it('clears description when empty string is sent', async () => {
    // given
    const truck = buildTruck({ description: 'Old' });
    const saved = buildTruck({ id: truck.id, description: undefined });
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      undefined,
      undefined,
      '',
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockResolvedValue(saved);

    // when
    await handler.execute(command);

    // then
    expect(truck.description).toBeUndefined();
  });

  it('throws ConflictException when save reports duplicate code', async () => {
    // given
    const truck = buildTruck({ code: 'OLD' });
    const command = new UpdateTruckCommand(
      truck.id,
      'NEW',
      undefined,
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.findByCode.mockResolvedValue(null);
    repo.save.mockRejectedValue(new DuplicateTruckCodeError('NEW'));

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      ConflictException,
    );
  });

  it('throws NotFoundException when save reports missing document', async () => {
    // given
    const truck = buildTruck();
    const command = new UpdateTruckCommand(
      truck.id,
      undefined,
      'X',
      undefined,
      undefined,
    );
    repo.findById.mockResolvedValue(truck);
    repo.save.mockRejectedValue(new TruckNotFoundForSaveError(truck.id));

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      NotFoundException,
    );
  });
});
