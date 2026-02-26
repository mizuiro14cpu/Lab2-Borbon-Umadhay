import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient';

dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const testClient = createClient(supabaseUrl, supabaseKey);

export const clearDatabase = async () => {
    const tables = ['game_genres', 'user_games', 'games', 'genres', 'users', 'developers'];

    for (const table of tables) {
        const { error } = await testClient
            .from(table)
            .delete()
            .not('id', 'is', null);

        if (error) {
            if (table === 'game_genres' || table === 'user_games') {
                const { error: joinError } = await testClient.from(table).delete().not('game_id', 'is', null);
                if (joinError) {
                    console.error(`Failed to clear ${table}: ${joinError.message}`);
                    throw new Error(`Failed to clear ${table}: ${joinError.message}`);
                }
            } else {
                console.error(`Failed to clear ${table}: ${error.message}`);
                throw new Error(`Failed to clear ${table}: ${error.message}`);
            }
        }
    }
}