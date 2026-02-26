import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient';

dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const testClient = createClient(supabaseUrl, supabaseKey);

export const clearDatabase = async () => {
    await testClient.from('game_genres').delete().neq('game_id', 0);
    await testClient.from('user_games').delete().neq('user_id', 0);
    await testClient.from('games').delete().neq('id', 0);
    await testClient.from('genres').delete().neq('id', 0);
    await testClient.from('users').delete().neq('id', 0);
    await testClient.from('developers').delete().neq('id', 0);
}