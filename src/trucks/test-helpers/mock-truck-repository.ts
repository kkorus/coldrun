import type { TruckRepositoryPort } from '../application/ports/truck.repository.port';

export function createMockTruckRepository(): jest.Mocked<TruckRepositoryPort> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    findMany: jest.fn(),
    save: jest.fn(),
    deleteById: jest.fn(),
  };
}
