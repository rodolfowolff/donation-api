import { Express } from 'express';
import * as controller from '@/api/controllers/faqs.controller';

const faqsRoutes = (app: Express) => {
  app.route('/faqs').post(controller.createFaq);
  app.route('/faqs').get(controller.getAllFaqs);
  app.route('/faqs/:id').put(controller.updateFaq);
  app.route('/faqs/:id').delete(controller.deleteFaq);
}

export default faqsRoutes;
