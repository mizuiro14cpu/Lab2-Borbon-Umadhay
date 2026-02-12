import { Router } from 'express';
import gameController from '../controllers/gameController';

const router = Router();

router.get('/', gameController.getGames);
router.post('/', gameController.createGame);

export default router;