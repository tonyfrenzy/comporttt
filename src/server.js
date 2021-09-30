import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Index
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Comporttt App.',
  });
});

app.use(router);
// app.use('/api/v1', router);

export default app;
