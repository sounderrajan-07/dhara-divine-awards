import mongoose, { Schema, Document } from 'mongoose';

export interface IEventItem extends Document {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  image: string;
  description: string;
  youtubeId?: string;
  duration?: string;
}

const EventSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  youtubeId: { type: String },
  duration: { type: String }
});

export default mongoose.models.Event || mongoose.model<IEventItem>('Event', EventSchema);
