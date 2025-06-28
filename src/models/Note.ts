import mongoose, { Document, Model, Schema } from 'mongoose';
import { Descendant } from 'slate';

// Base Note interface
interface NoteBase {
  userId: string;
  title: string;
  content: Descendant[];
  weather: 'rain' | 'snow' | 'sunny' | 'cloudy' | 'night';
  createdAt: Date;
  updatedAt: Date;
}

// Note document interface
export interface INote extends Document, NoteBase {}

// Note model interface
export interface INoteModel extends Model<INote> {
  findByUserId(userId: string): Promise<INote[]>;
}

// Note schema
const NoteSchema = new Schema<INote>({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    default: 'Untitled Note' 
  },
  content: { 
    type: Schema.Types.Mixed,
    default: [{ 
      type: 'paragraph', 
      children: [{ text: '' }] 
    }],
    required: true
  },
  weather: { 
    type: String, 
    enum: ['rain', 'snow', 'sunny', 'cloudy', 'night'], 
    default: 'sunny' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Static methods
NoteSchema.statics.findByUserId = function(userId: string): Promise<INote[]> {
  return this.find({ userId }).sort({ updatedAt: -1 });
};

// Create model with proper type casting
const Note = (mongoose.models.Note as INoteModel) || 
  mongoose.model<INote, INoteModel>('Note', NoteSchema);

export default Note; 