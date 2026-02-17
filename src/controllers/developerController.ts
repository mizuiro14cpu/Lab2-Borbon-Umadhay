import { Request, Response } from 'express';
import developerService from '../services/developerService';

export const getDevelopers = async (req: Request, res: Response) => {
    try {
        const developers = await developerService.getDevelopers();
        res.status(200).json(developers);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createDeveloper = async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const developer = await developerService.createDeveloper(name);
        res.status(201).json(developer);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateDeveloper = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const developer = await developerService.updateDeveloper(id, name);
        res.status(200).json(developer);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteDeveloper = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    try {
        await developerService.deleteDeveloper(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
};
