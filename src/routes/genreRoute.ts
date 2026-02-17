import { Router } from 'express';
import genreController from '../controllers/genreController';

const router = Router();

router.get('/', genreController.getGenres);
router.post('/', genreController.createGenre);
router.put('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

export default router;
