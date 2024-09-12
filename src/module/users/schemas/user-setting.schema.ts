import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSettingDocument = HydratedDocument<UserSetting>;

@Schema({ collection: 'user_settings' })
export class UserSetting {
  @Prop({ required: true })
  user_id: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now, select: false })
  updated_at: Date;
}

export const UserSettingSchema = SchemaFactory.createForClass(UserSetting);
