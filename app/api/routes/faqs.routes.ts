import { Express } from 'express';
import * as controller from '@/api/controllers/faqs.controller';
import { verifyAuthentication } from "../middlewares/authentication";

const faqsRoutes = (app: Express) => {
  app.route('/faqs').post(verifyAuthentication, controller.createFaq);

  app.route('/faqs').get(verifyAuthentication, controller.getAllFaqs);

  app.route('/faqs/:id').put(verifyAuthentication, controller.updateFaq);

  app.route('/faqs/:id').delete(verifyAuthentication, controller.deleteFaq);
}

export default faqsRoutes;
