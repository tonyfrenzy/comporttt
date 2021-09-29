import mongoose from 'mongoose';
import validator from 'validator';

const { Schema, model } = mongoose;
const { isEmail } = validator;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,
    lowercase: true,
    trim: true
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
    type: String,
    required: [true, 'Please enter a password']
  },
  isAdmin: {
    type: Boolean,
    default: 0
  },
  profileImg: String
},
  { timestamps: true }
);

export const User = model('user', userSchema);