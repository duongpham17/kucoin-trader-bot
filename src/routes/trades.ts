import express, {IRouter} from 'express';

import { kLines, trades, create, update, remove, stats, clearTrade } from '../controllers/trades';

const router: IRouter = express.Router();

router.post('/', create);
router.patch('/', update);
router.get('/:filter', trades);
router.get('/klines/:filter', kLines);
router.get('/stats/:id', stats);
router.delete('/:id', remove);
router.delete('/orders/:id', clearTrade);

export default router;