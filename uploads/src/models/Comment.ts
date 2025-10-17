import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: string;
  email: string;
  content: string;
  isApproved: boolean;
  isAdminReply: boolean;
  parentCommentId?: mongoose.Types.ObjectId; // For nested replies
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { 
    type: Schema.Types.ObjectId, 
    ref: 'BlogPost', 
    required: true 
  },
  author: { 
    type: String, 
    required: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  isApproved: { 
    type: Boolean, 
    default: false  // Moderate comments before showing
  },
  isAdminReply: { 
    type: Boolean, 
    default: false 
  },
  parentCommentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment' 
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Add index for better performance
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentCommentId: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);