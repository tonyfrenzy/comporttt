import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, model, SchemaTypes } = mongoose;
const { isEmail } = validator;

const adminSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    trim: true
  },
  password: {
    type: String
  },
  acl: {
    type: String,
    enum: ['super', 'sub', 'editor', 'support'],
    default: 'support'
  }
},
  { timestamps: true }
);

export const Admin = model('admin', adminSchema);