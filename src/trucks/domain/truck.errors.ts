import type { TruckStatus } from './truck-status';

export class InvalidStatusTransitionError extends Error {
  public constructor(from: TruckStatus, to: TruckStatus) {
    super(`Invalid status transition from "${from}" to "${to}"`);
    this.name = 'InvalidStatusTransitionError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicateTruckCodeError extends Error {
  public constructor(public readonly code: string) {
    super(`Truck with code "${code}" already exists`);
    this.name = 'DuplicateTruckCodeError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TruckNotFoundForSaveError extends Error {
  public constructor(public readonly truckId: string) {
    super(`Truck with id ${truckId} not found during save`);
    this.name = 'TruckNotFoundForSaveError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
