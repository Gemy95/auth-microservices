import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  })
  email: string;

  @Prop({
    type: String,
    required: false,
    unique: true,
    dropDups: true,
  })
  activationCode: string;

  @Prop({ type: Boolean, required: false, default: true })
  isActivated: boolean;

  @Prop({ type: String, required: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
