import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserProfileDocument = HydratedDocument<UserProfile>;

@Schema({ collection: 'user_profiles' })
export class UserProfile {
  @Prop()
  full_name: string;

  @Prop()
  nick_name: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now, select: false })
  updated_at: Date;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
