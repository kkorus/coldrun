export const TRUCK_STATUSES = [
  'OutOfService',
  'Loading',
  'ToJob',
  'AtJob',
  'Returning',
] as const;

export type TruckStatus = (typeof TRUCK_STATUSES)[number];

export function isTruckStatus(value: string): value is TruckStatus {
  return (TRUCK_STATUSES as readonly string[]).includes(value);
}
