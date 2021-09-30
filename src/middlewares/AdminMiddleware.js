import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//initialize env
dotenv.config();

const AdminMiddleware = async(req, res, next) => {
  // Check current user has admin access.
  if(!req.user.isAdmin) {
    return res.status(403).json({ 
        status: "failed", 
        message: "unauthorized: admin access only"
    });
  }

  try {
    // // Check user has enough PRIVELEGES
    // if(!req.headers.authorization) {
    //   return res.status(401).json({ 
    //       status: "failed", 
    //       message: "unauthorized access"
    //   });
    // }

    /*
      // https://stackoverflow.com/questions/31928417/chaining-multiple-pieces-of-middleware-for-specific-route-in-expressjs
      const adminAcl = {
        super: function(req, res, next) {
            console.log('super admin route list!');
            next();
        },
        sub: function(req, res, next) {
            console.log('sub admin route list!');
            next();
        },
        editor: function(req, res, next) {
            console.log('editor route list!');
            next();
        },
        support: function(req, res, next) {
            console.log('support staff route list!');
            next();
        }
      }
    */
  
    // If all things pass, allow user proceed
    next();
    
  } catch (error) {
    return res.status(500).json({ 
        status: "failed", 
        message: error.message 
    });
  }
};

export default AdminMiddleware;