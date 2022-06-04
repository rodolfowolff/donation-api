import express, { Express } from 'express';
import cors from 'cors';

export default (): Express => {
  const app = express();

  app.set('port', process.env.PORT || 3000);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  
  return app;
}
