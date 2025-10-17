import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: Date;
  author: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: Number, required: true },
  publishedAt: { type: Date, default: Date.now },
  author: { type: String, default: 'Doterra' },
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);