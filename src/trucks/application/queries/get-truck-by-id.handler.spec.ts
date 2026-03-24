import { NotFoundException } from '@nestjs/common';
import { buildTruck } from '../../test-helpers/truck.factory';
import { createMockTruckRepository } from '../../test-helpers/mock-truck-repository';
import { GetTruckByIdQuery } from './get-truck-by-id.query';
import { GetTruckByIdHandler } from './get-truck-by-id.handler';

describe('GetTruckByIdHandler', () => {
  let handler: GetTruckByIdHandler;
  let repo: ReturnType<typeof createMockTruckRepository>;

  beforeEach(() => {
    repo = createMockTruckRepository();
    handler = new GetTruckByIdHandler(repo);
  });

  it('returns the truck when it exists', async () => {
    // given
    const truck = buildTruck({ id: 'abc123' });
    const query = new GetTruckByIdQuery('abc123');
    repo.findById.mockResolvedValue(truck);

    // when
    const result = await handler.execute(query);

    // then
    expect(repo.findById).toHaveBeenCalledWith('abc123');
    expect(result).toBe(truck);
  });

  it('throws NotFoundException when truck does not exist', async () => {
    // given
    const query = new GetTruckByIdQuery('missing-id');
    repo.findById.mockResolvedValue(null);

    // when / then
    await expect(() => handler.execute(query)).rejects.toThrow(
      NotFoundException,
    );
  });
});
