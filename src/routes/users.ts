import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// GET /api/users - fetch from Supabase
router.get('/', async (req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('users')
        .select('*');
    
    if (error) {
        res.status(500).json({ error: error.message });
        return
    }

    res.status(200).json(data);
});

// POST /api/users - insert into Supabase
router.post('/', async (req: Request, res: Response) => {
    const { username, email } = req.body;

    if (!username || !email) {
        res.status(400).json({ error: "Username and email are required" });
        return
    }

    // .select() at the end returns the inserted row immediately
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, email }])
        .select();
    
    if (error) {
        res.status(500).json({ error: error.message });
        return
    }

    res.status(201).json(data[0]);
});

export default router;