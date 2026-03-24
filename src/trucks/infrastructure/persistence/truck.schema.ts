import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TRUCK_STATUSES } from '../../domain/truck-status';

@Schema({ collection: 'trucks', timestamps: true })
export class TruckModel {
  @Prop({ required: true, unique: true, index: true })
  public code!: string;

  @Prop({ required: true })
  public name!: string;

  @Prop({ required: true, enum: TRUCK_STATUSES, type: String })
  public status!: string;

  @Prop({ required: false })
  public description?: string;
}

export type TruckDocument = HydratedDocument<TruckModel> & {
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export const TruckSchema = SchemaFactory.createForClass(TruckModel);
