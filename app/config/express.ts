import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import usersRoutes from '@/api/routes/users.routes';
import ongsRoutes from '@/api/routes/ongs.routes';
import faqsRoutes from '@/api/routes/faqs.routes';
import ongBankRoutes from '@/api/routes/ongBank.routes';
import donationsRoutes from '@/api/routes/donations.routes';

export default (): Express => {
  const app = express();

  app.set('port', process.env.PORT || 3000);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  
  // Routes
  usersRoutes(app);
  ongsRoutes(app);
  faqsRoutes(app);
  ongBankRoutes(app);
  donationsRoutes(app);

  return app;
}
