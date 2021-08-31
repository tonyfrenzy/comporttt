import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.DB_CONNECTION_STRING;
const dbConnection = {
  getConnect: async () => {
     
    try {
      
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true

      })
      ;
  
      // On success
      console.log('Database connected successfully');

    } catch(err) {
      console.error(err.message);
      process.exit(1);
    }
  }
};

export default dbConnection;
