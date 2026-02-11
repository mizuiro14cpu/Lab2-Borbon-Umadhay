import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient';

dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const testClient = createClient(supabaseUrl, supabaseKey);

export const clearDatabase = async () => {
    const { error } = await testClient
        .from('users')
        .delete()
        .neq('id', 0)
    
        if (error) {
            throw new Error(`Failed to clear database: ${error.message}`)
        }
}