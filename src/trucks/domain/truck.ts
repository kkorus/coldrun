import { InvalidStatusTransitionError } from './truck.errors';
import { TruckStatus } from './truck-status';

export type TruckId = string;

export type CreateTruckInput = {
  readonly code: string;
  readonly name: string;
  readonly status: TruckStatus;
  readonly description?: string;
};

export type ListTrucksSortField =
  | 'code'
  | 'name'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

export type ListTrucksCriteria = {
  readonly filter?: {
    readonly status?: TruckStatus;
    readonly codeContains?: string;
    readonly nameContains?: string;
  };
  readonly sort?: {
    readonly field: ListTrucksSortField;
    readonly order: 'asc' | 'desc';
  };
  readonly skip: number;
  readonly limit: number;
};

export type TruckListResult = {
  readonly items: readonly Truck[];
  readonly total: number;
};

const TRANSITION_SEQUENCE: readonly TruckStatus[] = [
  TruckStatus.LOADING,
  TruckStatus.TO_JOB,
  TruckStatus.AT_JOB,
  TruckStatus.RETURNING,
];

export class Truck {
  public constructor(
    public readonly id: TruckId,
    public code: string,
    public name: string,
    public status: TruckStatus,
    public description: string | undefined,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public changeStatus(next: TruckStatus): void {
    if (!this.isValidTransition(this.status, next)) {
      throw new InvalidStatusTransitionError(this.status, next);
    }
    this.status = next;
  }

  public rename(name: string): void {
    this.name = name;
  }

  public updateDescription(description: string | undefined): void {
    this.description = description?.trim() === '' ? undefined : description;
  }

  public changeCode(code: string): void {
    this.code = code;
  }

  private isValidTransition(from: TruckStatus, to: TruckStatus): boolean {
    if (from === to) {
      return false;
    }
    if (to === TruckStatus.OUT_OF_SERVICE) {
      return true;
    }
    if (from === TruckStatus.OUT_OF_SERVICE) {
      return true;
    }

    const fromIdx = TRANSITION_SEQUENCE.indexOf(from);
    const toIdx = TRANSITION_SEQUENCE.indexOf(to);

    if (fromIdx === -1 || toIdx === -1) {
      return false;
    }

    if (from === TruckStatus.RETURNING && to === TruckStatus.LOADING) {
      return true;
    } else {
      return toIdx === fromIdx + 1;
    }
  }
}
