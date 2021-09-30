import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { Admin } from '../models/adminModel.js';
import { User } from '../models/userModel.js';

dotenv.config();

const AdminController = {
  makeAdmin: async (req, res) => {
    const { user: userId, aclType } = req.body;
    
    // if (!isSuperAdmn) {
    //   return res.status(403).json({ 
    //     status: "failed", 
    //     message: "unathorized access"
    //   });
    // }

    try {
      const adminUser = await User.findById(userId);

      if(adminUser) {
        const newAdmin = new Admin({ 
          user: adminUser._id, 
          email: adminUser.email, 
          password: '',
          acl: aclType
        });
        const savedAdmin = await newAdmin.save();

        if(savedAdmin) {
          // Update user model to isAdmin.
          adminUser.isAdmin = true;
          await adminUser.save();

          /**
           * Send Password creation email HERE...
           */
          return res.status(200).json({ 
            status: 'success',
            message: 'new admin added',
            data: {
              id: savedAdmin._id,
              user: savedAdmin.user,
              fullname: adminUser.lastname +" "+ adminUser.firstname, //savedAdmin.user.lastname +" "+ savedAdmin.user.firstname,
              email: savedAdmin.email,
              acl: savedAdmin.acl
            }
          });
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
      const foundAdmin = await Admin.findOne({ email });

      if(!foundAdmin || !Object.keys(foundAdmin).length) {
        return res.status(404).json({ 
          status: "failed", 
          message: "record not found" 
        });
      }

      const isMatch = await bcrypt.compare(password, foundAdmin.password);
      
      // Prevents saved password from being visible to admin
      delete res.isMatch;

      if(!isMatch) {
        return res.status(400).json({ 
          status: "failed", 
          message: "incorrect email/username or password"
        });
      }

      // Payload to be sent in token
      const { _id, user, email, acl } = foundAdmin;

      const payload = {
        admin: {
          _id, user, email, acl
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
          _id, user, email, acl, 
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

  dashboard: async (req, res) => {
    const { username } = req.params;
    
    try {
      const admin = await Admin.findOne({email}).select("-password");

      if(!admin) return res.status(404).json({
        status: 'failed',
        message: 'admin not found'
      })

      if (username === req.admin.username) {
        return res.status(200).json({
          status: 'success',
          message: 'successful',
          data: admin
        });
      }

      return res.status(401).json({
        status: 'failed',
        message: 'only personal dashboard access allowed',
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: error.message
      })
    }
  },

  demoteAdmin: async (req, res) => {
    // 
  }
}

export default AdminController;