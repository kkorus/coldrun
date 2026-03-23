import type { TruckDocument } from './truck.schema';
import type { Truck } from '../../domain/truck';
import { isTruckStatus } from '../../domain/truck-status';

export function mapTruckDocumentToDomain(doc: TruckDocument): Truck {
  const status = doc.status;
  if (!isTruckStatus(status)) {
    throw new Error(`Invalid truck status persisted: ${String(status)}`);
  }
  return {
    id: doc._id.toHexString(),
    code: doc.code,
    name: doc.name,
    status,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
