import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// GET /api/users - fetch from Supabase
router.get('/', async (req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('games')
        .select('*');
    
    if (error) {
        res.status(500).json({ error: error.message });
        return
    }

    res.status(200).json(data);
});

// POST /api/users - insert into Supabase
router.post('/', async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
        res.status(400).json({ error: "Title is required" });
        return
    }

    // .select() at the end returns the inserted row immediately
    const { data, error } = await supabase
        .from('games')
        .insert([{ title }])
        .select();
    
    if (error) {
        res.status(500).json({ error: error.message });
        return
    }

    res.status(201).json(data[0]);
});