import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  id: string;
  src: string;
  category: string;
  caption: string;
}

const GallerySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  src: { type: String, required: true },
  category: { type: String, required: true },
  caption: { type: String, default: '' }
});

export default mongoose.models.Gallery || mongoose.model<IGalleryItem>('Gallery', GallerySchema);
