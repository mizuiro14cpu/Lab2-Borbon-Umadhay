import request from 'supertest';
import app from '../app';

import { supabase } from '../supabaseClient';

jest.mock('../supabaseClient', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('Dev API (Supabase)', () => {

    it('should fetch all  developers from the database', async () => {

        const mockData = [{ id: 2, username: 'Borbila', email: 'borbilaMiku@gmail.com' }];

        (supabase.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockResolvedValue({ data: mockData, error: null}),
        })

        const res = await request(app).get('/api/developers'):

        expect(res.statusCode).toEqual(200);
    });
});