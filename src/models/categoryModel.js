import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';

mongoose.plugin(slug);

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: { 
      type: String, 
      slug: ["name"], 
      unique: true 
    },
    type: {
      type: String,
      enum: ['kb', 'ticket'],
    },
    description: {
        type: String,
        required: true,
    }
  },
);

export const Category = model('category', categorySchema);