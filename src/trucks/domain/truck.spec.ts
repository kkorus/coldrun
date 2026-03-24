import { Truck } from './truck';
import { TruckStatus } from './truck-status';
import { InvalidStatusTransitionError } from './truck.errors';

function buildTruck(status: TruckStatus = TruckStatus.OUT_OF_SERVICE): Truck {
  return new Truck(
    'some-id',
    'TRK001',
    'Test Truck',
    status,
    undefined,
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );
}

describe('Truck (aggregate)', () => {
  describe('changeStatus()', () => {
    describe('valid transitions', () => {
      it.each([
        [TruckStatus.LOADING, TruckStatus.OUT_OF_SERVICE],
        [TruckStatus.AT_JOB, TruckStatus.OUT_OF_SERVICE],
        [TruckStatus.OUT_OF_SERVICE, TruckStatus.LOADING],
        [TruckStatus.OUT_OF_SERVICE, TruckStatus.AT_JOB],
        [TruckStatus.LOADING, TruckStatus.TO_JOB],
        [TruckStatus.TO_JOB, TruckStatus.AT_JOB],
        [TruckStatus.AT_JOB, TruckStatus.RETURNING],
        [TruckStatus.RETURNING, TruckStatus.LOADING],
      ])('%s → %s is allowed', (from: TruckStatus, to: TruckStatus) => {
        // given
        const truck = buildTruck(from);

        // when
        truck.changeStatus(to);

        // then
        expect(truck.status).toBe(to);
      });
    });

    describe('invalid transitions', () => {
      it.each([
        [TruckStatus.LOADING, TruckStatus.AT_JOB],
        [TruckStatus.LOADING, TruckStatus.RETURNING],
        [TruckStatus.TO_JOB, TruckStatus.LOADING],
        [TruckStatus.TO_JOB, TruckStatus.RETURNING],
        [TruckStatus.AT_JOB, TruckStatus.LOADING],
        [TruckStatus.AT_JOB, TruckStatus.TO_JOB],
        [TruckStatus.RETURNING, TruckStatus.TO_JOB],
        [TruckStatus.RETURNING, TruckStatus.AT_JOB],
        [TruckStatus.LOADING, TruckStatus.LOADING],
      ])(
        '%s → %s throws InvalidStatusTransitionError',
        (from: TruckStatus, to: TruckStatus) => {
          // given
          const truck = buildTruck(from);

          // when / then
          expect(() => truck.changeStatus(to)).toThrow(
            InvalidStatusTransitionError,
          );
        },
      );
    });

    it('does not mutate status when transition is invalid', () => {
      // given
      const truck = buildTruck(TruckStatus.LOADING);

      // when
      try {
        truck.changeStatus(TruckStatus.AT_JOB);
      } catch {
        // expected
      }

      // then
      expect(truck.status).toBe(TruckStatus.LOADING);
    });
  });

  describe('rename()', () => {
    it('updates name', () => {
      // given
      const truck = buildTruck();

      // when
      truck.rename('New Name');

      // then
      expect(truck.name).toBe('New Name');
    });
  });

  describe('updateDescription()', () => {
    it('sets description to new value', () => {
      // given
      const truck = buildTruck();

      // when
      truck.updateDescription('New description');

      // then
      expect(truck.description).toBe('New description');
    });

    it('clears description when undefined is passed', () => {
      // given
      const truck = buildTruck();
      truck.updateDescription('Some desc');

      // when
      truck.updateDescription(undefined);

      // then
      expect(truck.description).toBeUndefined();
    });

    it('clears description when empty string is passed', () => {
      // given
      const truck = buildTruck();
      truck.updateDescription('Some desc');

      // when
      truck.updateDescription('');

      // then
      expect(truck.description).toBeUndefined();
    });
  });

  describe('changeCode()', () => {
    it('updates code', () => {
      // given
      const truck = buildTruck();

      // when
      truck.changeCode('NEWCODE');

      // then
      expect(truck.code).toBe('NEWCODE');
    });
  });
});
