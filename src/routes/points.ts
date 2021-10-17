import express from 'express';

import { add, spend, points } from '../controllers/points';

const pointsRouter = express.Router();

pointsRouter.route('/add').post(add);
pointsRouter.route('/spend').post(spend);
pointsRouter.route('/points').get(points);

export { pointsRouter };
