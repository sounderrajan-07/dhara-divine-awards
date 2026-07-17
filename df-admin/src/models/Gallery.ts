import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  id: string;
  src: string;
  category: string;
  caption: string;
  priority: number;
  featured: boolean;
}

const GallerySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  src: { type: String, required: true },
  category: { type: String, required: true },
  caption: { type: String, default: '' },
  priority: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
});

export default mongoose.models.Gallery || mongoose.model<IGalleryItem>('Gallery', GallerySchema);
