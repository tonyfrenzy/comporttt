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
    description: 'This is a mini documentation with publicly accessible endpoints by model.',
    endpoints: {
      user: {
        endpoints: {
          profile: '/users/:username'
        }
      },
      admin: {
        endpoints: {
          dashboard: '/admins/:id'
        }
      },
      category: {
        endpoints: {
          index: '/categories',
          show: '/categories/:id'
        }
      },
      knowledgebase: {
        endpoints: {
          index: '/knowledgebases',
          show: '/knowledgebases/:id'
        }
      }
    }
  });
});

app.use(router);
// app.use('/api/v1', router);

export default app;
