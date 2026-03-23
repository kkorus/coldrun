import { Truck } from '../../domain/truck';
import { isTruckStatus } from '../../domain/truck-status';
import type { TruckDocument } from './truck.schema';

export function mapTruckDocumentToAggregate(doc: TruckDocument): Truck {
  const status = doc.status;
  if (!isTruckStatus(status)) {
    throw new Error(`Invalid truck status persisted: ${String(status)}`);
  }
  return new Truck(
    doc._id.toHexString(),
    doc.code,
    doc.name,
    status,
    doc.description,
    doc.createdAt,
    doc.updatedAt,
  );
}
