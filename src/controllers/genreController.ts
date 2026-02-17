import { Request, Response } from 'express';
import genreService from '../services/genreService';

export const getGenres = async (req: Request, res: Response) => {
    try {
        const genres = await genreService.getGenres();
        res.status(200).json(genres);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const genre = await genreService.createGenre(name);
        res.status(201).json(genre);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateGenre = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const genre = await genreService.updateGenre(id, name);
        res.status(200).json(genre);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteGenre = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    try {
        await genreService.deleteGenre(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
};
