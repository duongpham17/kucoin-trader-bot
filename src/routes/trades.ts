import express, {IRouter} from 'express';

import { kLines, trades, create, update, remove } from '../controllers/trades';

const router: IRouter = express.Router();

router.post('/', create);
router.patch('/', update);
router.get('/:filter', trades);
router.get('/klines/:filter', kLines);
router.delete('/:id', remove)

export default router;