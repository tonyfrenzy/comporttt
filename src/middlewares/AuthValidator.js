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
    // Check if token is of appropriate format
    if(bearerToken[0] !== "Bearer") {
      return res.status(400).json({
        status: "failed",
        message: "invalid token format"
      })
    }

    if(!bearerToken[1]) {
      return res.status(400).json({
        status: "failed",
        message: "unauthorized"
      })
    }

    const token = bearerToken[1];

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // If token verification failed
    if(!decodedToken) {
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
        error: "invalid auth token"
      });
    }

    // Add user's details to the req object for all protected routes
    req.user = {
      id: decodedToken.user._id,
      username: decodedToken.user.username,
      acl: decodedToken.user.acl
    };

    // If all things pass, allow user proceed
    next();
    
  } catch (error) {
    return res.status(500).json({ 
        status: "failed", 
        message: error.message 
    });
  }
};

export default authValidator;