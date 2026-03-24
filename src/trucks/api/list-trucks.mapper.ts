import type { ListTrucksCriteria } from '../domain/truck';
import type { ListTrucksQueryDto } from './dto/list-trucks-query.dto';

export function listTrucksQueryDtoToCriteria(
  dto: ListTrucksQueryDto,
): ListTrucksCriteria {
  const status = dto.status;
  const codeContains =
    dto.codeContains !== undefined && dto.codeContains.length > 0
      ? dto.codeContains
      : undefined;
  const nameContains =
    dto.nameContains !== undefined && dto.nameContains.length > 0
      ? dto.nameContains
      : undefined;

  const filter: ListTrucksCriteria['filter'] =
    status !== undefined ||
    codeContains !== undefined ||
    nameContains !== undefined
      ? {
          ...(status !== undefined ? { status } : {}),
          ...(codeContains !== undefined ? { codeContains } : {}),
          ...(nameContains !== undefined ? { nameContains } : {}),
        }
      : undefined;

  const sort =
    dto.sortField !== undefined
      ? { field: dto.sortField, order: dto.sortOrder ?? 'asc' }
      : undefined;

  return {
    filter,
    sort,
    skip: dto.skip ?? 0,
    limit: dto.limit ?? 20,
  };
}
