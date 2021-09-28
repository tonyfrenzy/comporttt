import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//initialize env
dotenv.config();

const authValidator = async(req, res, next) => {
  // Check if there is a token
  if(!req.headers.authorization) {
    return res.status(401).json({ 
        status: "failed", 
        message: "unauthorized"
    });
  }
  
  const bearerToken = req.headers.authorization.split(" ");

  try {
    /*
    // Check if token is of appropriate format
    if(bearerToken[0] !== "Bearer") {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid token format"
      })
    }
    */

    if(!bearerToken[1]) {
      return res.status(400).json({
        status: "failed",
        message: "unauthorized"
      })
    }

    // const token = bearerToken[1];
    const token = bearerToken;

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // If token verification failed
    if(!decodedToken) {
      return res.status(401).json({
        status: "Failed",
        message: "Unauthorized",
        error: "Invalid auth token"
      });
    }

    // Add user's details to the req object for all protected routes
    req.user = {
      id: decodedToken.user._id,
      acl: decodedToken.user.acl
    };

    // If all things pass, allow user proceed
    next();
    
  } catch (error) {
    return res.status(500).json({ 
        status: "Failed", 
        message: error.message 
    });
  }
};

export default authValidator;