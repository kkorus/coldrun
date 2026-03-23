import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { QueryFilter } from 'mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { Truck } from '../../domain/truck';
import type {
  CreateTruckInput,
  ListTrucksCriteria,
  ListTrucksSortField,
  TruckListResult,
} from '../../domain/truck';
import { TruckRepositoryPort } from '../../application/ports/truck.repository.port';
import { mapTruckDocumentToAggregate } from './truck.mapper';
import type { TruckDocument } from './truck.schema';
import { TruckModel } from './truck.schema';

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

function buildSort(
  sort?: ListTrucksCriteria['sort'],
): Record<string, SortOrder> {
  if (!sort) {
    return { createdAt: -1 };
  }

  const direction: SortOrder = sort.order === 'asc' ? 1 : -1;
  const fieldMap: Record<ListTrucksSortField, string> = {
    code: 'code',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  return { [fieldMap[sort.field]]: direction };
}

@Injectable()
export class TruckMongoRepository extends TruckRepositoryPort {
  public constructor(
    @InjectModel(TruckModel.name)
    private readonly truckModel: Model<TruckDocument>,
  ) {
    super();
  }

  public async create(input: CreateTruckInput): Promise<Truck> {
    const created = await this.truckModel.create({
      code: input.code,
      name: input.name,
      status: input.status,
      description: input.description,
    });
    return mapTruckDocumentToAggregate(created);
  }

  public async findById(id: string): Promise<Truck | null> {
    if (!isValidObjectId(id)) {
      return null;
    }
    const doc = await this.truckModel.findById(id).exec();
    return doc ? mapTruckDocumentToAggregate(doc) : null;
  }

  public async findByCode(code: string): Promise<Truck | null> {
    const doc = await this.truckModel.findOne({ code }).exec();
    return doc ? mapTruckDocumentToAggregate(doc) : null;
  }

  public async findMany(
    criteria: ListTrucksCriteria,
  ): Promise<TruckListResult> {
    const filter = this.buildFilter(criteria.filter);
    const sort = buildSort(criteria.sort);
    const [docs, total] = await Promise.all([
      this.truckModel
        .find(filter)
        .sort(sort)
        .skip(criteria.skip)
        .limit(criteria.limit)
        .exec(),
      this.truckModel.countDocuments(filter).exec(),
    ]);
    return {
      items: docs.map((d) => mapTruckDocumentToAggregate(d)),
      total,
    };
  }

  public async save(truck: Truck): Promise<Truck> {
    const doc = await this.truckModel
      .findByIdAndUpdate(
        truck.id,
        {
          $set: {
            code: truck.code,
            name: truck.name,
            status: truck.status,
            description: truck.description,
          },
        },
        { returnDocument: 'after', runValidators: true },
      )
      .exec();

    if (!doc) {
      throw new Error(`Truck with id ${truck.id} not found during save`);
    }
    return mapTruckDocumentToAggregate(doc);
  }

  public async deleteById(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      return false;
    }
    const result = await this.truckModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private buildFilter(
    filter?: ListTrucksCriteria['filter'],
  ): QueryFilter<TruckDocument> {
    if (!filter) {
      return {};
    }
    const query: QueryFilter<TruckDocument> = {};
    if (filter.status !== undefined) {
      query.status = filter.status;
    }
    if (filter.codeContains !== undefined && filter.codeContains.length > 0) {
      query.code = {
        $regex: new RegExp(escapeRegex(filter.codeContains), 'i'),
      };
    }
    if (filter.nameContains !== undefined && filter.nameContains.length > 0) {
      query.name = {
        $regex: new RegExp(escapeRegex(filter.nameContains), 'i'),
      };
    }
    return query;
  }
}
