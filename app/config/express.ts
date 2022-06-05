import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import usersRoutes from '@/api/routes/users.routes';

export default (): Express => {
  const app = express();

  app.set('port', process.env.PORT || 3000);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  
  // Routes
  usersRoutes(app);

  return app;
}
