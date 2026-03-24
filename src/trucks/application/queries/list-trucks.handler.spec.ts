import { buildTruck } from '../../test-helpers/truck.factory';
import { createMockTruckRepository } from '../../test-helpers/mock-truck-repository';
import { TruckStatus } from '../../domain/truck-status';
import type { ListTrucksCriteria } from '../../domain/truck';
import { ListTrucksQuery } from './list-trucks.query';
import { ListTrucksHandler } from './list-trucks.handler';

describe('ListTrucksHandler', () => {
  let handler: ListTrucksHandler;
  let repo: ReturnType<typeof createMockTruckRepository>;

  beforeEach(() => {
    repo = createMockTruckRepository();
    handler = new ListTrucksHandler(repo);
  });

  it('delegates to repository with given criteria', async () => {
    // given
    const criteria: ListTrucksCriteria = {
      filter: { status: TruckStatus.LOADING },
      sort: { field: 'name', order: 'asc' },
      skip: 0,
      limit: 20,
    };
    const query = new ListTrucksQuery(criteria);
    const expectedResult = { items: [buildTruck()], total: 1 };
    repo.findMany.mockResolvedValue(expectedResult);

    // when
    const result = await handler.execute(query);

    // then
    expect(repo.findMany).toHaveBeenCalledWith(criteria);
    expect(result).toBe(expectedResult);
  });

  it('returns empty list when no trucks found', async () => {
    // given
    const criteria: ListTrucksCriteria = { skip: 0, limit: 20 };
    const query = new ListTrucksQuery(criteria);
    repo.findMany.mockResolvedValue({ items: [], total: 0 });

    // when
    const result = await handler.execute(query);

    // then
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
