import mongoose from 'mongoose';

const { Schema, model, SchemaTypes } = mongoose;

const knowledgebaseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    body: {
        type: String,
        required: true,
    },
    category: {
      type: SchemaTypes.ObjectId,
      ref: 'category',
      required: true,
    }
  },
);

export const Knowledgebase = model('knowledgebase', knowledgebaseSchema);