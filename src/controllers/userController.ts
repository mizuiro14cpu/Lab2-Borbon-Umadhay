import { Request, Response } from 'express';
import userService from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { username, email } = req.body;

    if (!username || !email) {
        res.status(400).json({ error: 'Username and email are required' });
        return;
    }

    try {
        const user = await userService.createUser(username, email);
        res.status(201).json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default {
    getUsers,
    createUser,
};
