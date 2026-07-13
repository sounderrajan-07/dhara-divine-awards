import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  id: string;
  sender_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'general' | 'media' | 'csr' | 'sponsor' | 'volunteer' | 'donor';
  status: 'new' | 'in-progress' | 'resolved';
  created_at: string;
  organization?: string;
}

const EnquirySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  sender_name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, default: '' },
  type: { type: String, enum: ['general', 'media', 'csr', 'sponsor', 'volunteer', 'donor'], default: 'general' },
  status: { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
  created_at: { type: String, default: () => new Date().toISOString() },
  organization: { type: String, default: '' }
});

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
