import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { QueryFilter } from 'mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { TruckRepositoryPort } from '../../application/ports/truck.repository.port';
import type {
  CreateTruckInput,
  ListTrucksCriteria,
  ListTrucksSortField,
  Truck,
  TruckListResult,
  UpdateTruckInput,
} from '../../domain/truck';
import { mapTruckDocumentToDomain } from './truck.mapper';
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
    return mapTruckDocumentToDomain(created);
  }

  public async findById(id: string): Promise<Truck | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const doc = await this.truckModel.findById(id).exec();
    return doc ? mapTruckDocumentToDomain(doc) : null;
  }

  public async findByCode(code: string): Promise<Truck | null> {
    const doc = await this.truckModel.findOne({ code }).exec();
    return doc ? mapTruckDocumentToDomain(doc) : null;
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
      items: docs.map((d) => mapTruckDocumentToDomain(d)),
      total,
    };
  }

  public async update(
    id: string,
    input: UpdateTruckInput,
  ): Promise<Truck | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const update: Record<string, unknown> = {};
    if (input.code !== undefined) {
      update.code = input.code;
    }
    if (input.name !== undefined) {
      update.name = input.name;
    }
    if (input.status !== undefined) {
      update.status = input.status;
    }
    if (input.description !== undefined) {
      update.description = input.description;
    }
    if (Object.keys(update).length === 0) {
      const existing = await this.findById(id);
      return existing;
    }
    const doc = await this.truckModel
      .findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true },
      )
      .exec();
    return doc ? mapTruckDocumentToDomain(doc) : null;
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
