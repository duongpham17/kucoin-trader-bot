import express, {IRouter} from 'express';

import { orders, cleartest } from '../controllers/orders';

const router: IRouter = express.Router();

router.get('/:filter', orders);
router.delete('/test', cleartest);

export default router;