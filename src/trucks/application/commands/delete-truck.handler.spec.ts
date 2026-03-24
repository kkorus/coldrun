import { NotFoundException } from '@nestjs/common';
import { createMockTruckRepository } from '../../test-helpers/mock-truck-repository';
import { DeleteTruckCommand } from './delete-truck.command';
import { DeleteTruckHandler } from './delete-truck.handler';

describe('DeleteTruckHandler', () => {
  let handler: DeleteTruckHandler;
  let repo: ReturnType<typeof createMockTruckRepository>;

  beforeEach(() => {
    repo = createMockTruckRepository();
    handler = new DeleteTruckHandler(repo);
  });

  it('deletes successfully when truck exists', async () => {
    // given
    const command = new DeleteTruckCommand('existing-id');
    repo.deleteById.mockResolvedValue(true);

    // when
    await handler.execute(command);

    // then
    expect(repo.deleteById).toHaveBeenCalledWith('existing-id');
  });

  it('throws NotFoundException when truck does not exist', async () => {
    // given
    const command = new DeleteTruckCommand('missing-id');
    repo.deleteById.mockResolvedValue(false);

    // when / then
    await expect(() => handler.execute(command)).rejects.toThrow(
      NotFoundException,
    );
  });
});
