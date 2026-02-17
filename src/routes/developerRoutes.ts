import { Router } from 'express';
import developerController from '../controllers/developerController';

const router = Router();

router.get('/', developerController.getDevelopers);
router.post('/', developerController.createDeveloper);
router.put('/:id', developerController.updateDeveloper);
router.delete('/:id', developerController.deleteDeveloper);

export default router;
