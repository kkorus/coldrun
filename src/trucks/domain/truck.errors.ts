import type { TruckStatus } from './truck-status';

export class InvalidStatusTransitionError extends Error {
  public constructor(from: TruckStatus, to: TruckStatus) {
    super(`Invalid status transition from "${from}" to "${to}"`);
    this.name = 'InvalidStatusTransitionError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
