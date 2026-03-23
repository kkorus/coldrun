import type { TruckStatus } from './truck-status';

export type TruckId = string;

export type Truck = {
  readonly id: TruckId;
  readonly code: string;
  readonly name: string;
  readonly status: TruckStatus;
  readonly description?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type CreateTruckInput = {
  readonly code: string;
  readonly name: string;
  readonly status: TruckStatus;
  readonly description?: string;
};

export type UpdateTruckInput = {
  readonly code?: string;
  readonly name?: string;
  readonly status?: TruckStatus;
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
