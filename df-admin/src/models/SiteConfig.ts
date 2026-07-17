import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  id: string; // usually a singleton like "global-config"
  heroVideoUrl: string;
  heroVideoPoster: string;
}

const SiteConfigSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  heroVideoUrl: { type: String, default: '' },
  heroVideoPoster: { type: String, default: '' }
});

export default mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
