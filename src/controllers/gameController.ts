import { Request, Response } from 'express';
import gameService from '../services/gameService';

export const getGames = async (req: Request, res: Response) => {
    try {
        const games = await gameService.getGames();
        res.status(200).json(games);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createGame = async (req: Request, res: Response) => {
    const { title, release_year } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    try {
        const game = await gameService.createGame(title, release_year);
        res.status(201).json(game);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getGames,
    createGame,
};
