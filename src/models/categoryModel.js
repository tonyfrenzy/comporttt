import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
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