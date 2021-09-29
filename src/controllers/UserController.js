import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../models/userModel.js';
// import cloudinary from '../config/cloudinary.js';

dotenv.config();

const UserController = {
  register: async (req, res) => {
    const reqBody = req.body;
    const { username, firstname, lastname, email, password, confirmPassword } = req.body;
    const reqFields = ['username', 'firstname', 'lastname', 'email', 'password', 'confirmPassword'];

    try {
      if(password !== confirmPassword) {
        return res
          .status(400)
          .json({ status: 'failed', message: 'Passwords do not match' });
      }

      // find if email or username already exists
      const isUserExist = await User.findOne({ 
        $or: [{ username }, { email }] 
      });

      if(isUserExist) {
        return res
          .status(400).json({ 
            status: 'failed', 
            message: `username '${username}' is taken or a user with email '${email}' already exists`
          });
      }

      for (const field of reqFields) {
        if (!reqBody[field] ) {
          return res
            .status(400).json({ 
              status: 'failed', 
              message: `${field} field is required` 
            });
        }
      }

      if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
        return res
          .status(400).json({ 
            status: 'failed', 
            message: 'please fill all required fields' 
          });
      }

      // password hash
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      if(hash) {
        const newUser = new User({ firstname, lastname, username, email, password: hash });
        const savedUser = await newUser.save();

        if(savedUser) {
          /**
           * Send Verification email HERE...
           */
          jwt.sign(
            { id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: +process.env.JWT_EXPIRY },
            (err, token) => {
              if (err) {
                throw err;
              }

              res.status(200).json({ 
                status: 'success',
                data: {
                  id: savedUser._id,
                  fullname: savedUser.firstname +" "+ savedUser.lastname,
                  username: savedUser.username,
                  email: savedUser.email,
                  isAdmin: savedUser.isAdmin,
                  token: "Bearer " + token
                },
                message: 'user registration successful'
              });
            }
          );
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error
      })
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if(![email, password].every(Boolean)) {
      return res.status(400).json({ 
        status: "failed", 
        message: "enter your email/username and password!"
      });
    }

    try {
      const existingUser = await User.findOne({ 
        $or: [{ username: email }, { email: email }] 
      });

      if(!existingUser || !Object.keys(existingUser).length) {
        return res.status(404).json({ 
          status: "failed", 
          message: "record not found" 
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      
      // Prevents saved password from being visible to user
      delete res.isMatch;

      if(!isMatch) {
        return res.status(400).json({ 
          status: "failed", 
          message: "incorrect email/username or password"
        });
      }

      // Payload to be sent in token
      const { _id, firstname, lastname, username, isAdmin } = existingUser;

      const payload = {
        user: {
          _id, firstname, lastname, username, isAdmin
        }
      }

      // Generate token
      const token = jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn: +process.env.JWT_EXPIRY
      });

      // If token is not generated
      if(!token) return res.status(401).json({
        status: "failed", 
        message: "error logging in. could not generate token."
      });

      return res.status(200).json({
        status: 'success',
        message: "login successful",       
        data: {
          _id, firstname, lastname, username, isAdmin, 
          email: existingUser.email,
          token: `Bearer ${token}`
        }
      })

    } catch (error) {
      return res.status(500).json({ 
        status: "failed", 
        message: error.message 
      });
    }
  },

  profile: async (req, res) => {
    const { username } = req.params;
    
    try {
      const user = await User.findOne({username}).select("-password");

      if(!user) return res.status(404).json({
        status: 'failed',
        message: 'user not found'
      })

      if (username === req.user.username) {
        return res.status(200).json({
          status: 'success',
          message: 'successful',
          data: user
        });
      }

      return res.status(401).json({
        status: 'failed',
        message: 'only personal profile access allowed',
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: error.message
      })
    }
  },

  setDP: async (req, res) => {
    // console.log(req.file);
    // cloudinary.uploader.uploadq(req.file.original)
  }
}

export default UserController;