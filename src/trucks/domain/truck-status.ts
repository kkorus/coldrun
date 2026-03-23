export enum TruckStatus {
  OUT_OF_SERVICE = 'OutOfService',
  LOADING = 'Loading',
  TO_JOB = 'ToJob',
  AT_JOB = 'AtJob',
  RETURNING = 'Returning',
}

export const TRUCK_STATUSES = Object.values(TruckStatus);

export function isTruckStatus(value: string): value is TruckStatus {
  return (TRUCK_STATUSES as string[]).includes(value);
}
