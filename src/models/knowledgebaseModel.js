import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';

mongoose.plugin(slug);

const { Schema, model, SchemaTypes } = mongoose;

const knowledgebaseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: { 
      type: String, 
      slug: ["title"], 
      unique: true 
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