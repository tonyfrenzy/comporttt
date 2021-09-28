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
          .json({ status: 'fail', message: 'Passwords do not match' });
      }

      // find if email or username already exists
      const isUserEmailExist = await User.findOne({ email });
      const isUsernameExist = await User.findOne({ username  });

      if(isUserEmailExist) {
        return res
          .status(400).json({ 
            status: 'fail', 
            message: `a user with email '${email}' already exists`
          });
      }

      if(isUsernameExist) {
        return res
          .status(400).json({ 
            status: 'fail', 
            message: `username '${username}' is taken` 
          });
      }

      for (const field of reqFields) {
        // console.log(field, reqBody[field]);
        if (!reqBody[field] ) {
          return res
            .status(400).json({ 
              status: 'fail', 
              message: `${field} field is required` 
            });
        }
      }

      if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
        return res
          .status(400).json({ 
            status: 'fail', 
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
                  token: "Bearer " + token,
                  id: savedUser._id,
                  firstname: savedUser.firstname +" "+ savedUser.lastname,
                  username: savedUser.username,
                  email: savedUser.email
                },
                message: 'user registration successful'
              });
            }
          );
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: "Failed",
        error
      })
    }
  }
}

export default UserController;