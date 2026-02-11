import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
import { supabase } from '../../supabaseClient';

dotenv.config({ path: '.env.test' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const testClient = createClient(supabaseUrl, supabaseKey);

// export const clearDatabase = async () => {
//     const { error } = await testClient
//         .from('users')
//         .delete()
//         .neq('id', 0)
    
//         if (error) {
//             throw new Error(`Failed to clear database: ${error.message}`)
//         }
// }

export const clearDatabase = async () => {
    let error;

    // delete bridge tables first
    ({ error } = await testClient.from('game_genres').delete().neq('game_id', 0))
    if (error) {throw new Error(`Failed to clear game_genres: ${error.message}`)}

    ({ error } = await testClient.from('user_games').delete().neq('game_id', 0))
    if (error) {throw new Error(`Failed to clear user_games: ${error.message}`)}

    ({ error } = await testClient.from('games').delete().neq('id', 0))
    if (error) {throw new Error(`Failed to clear games: ${error.message}`)}

    ({ error } = await testClient.from('genres').delete().neq('id', 0))
    if (error) {throw new Error(`Failed to clear genres: ${error.message}`)}

    ({ error } = await testClient.from('users').delete().neq('id', 0))
    if (error) {throw new Error(`Failed to clear users: ${error.message}`)}

    ({ error } = await testClient.from('developers').delete().neq('id', 0))
    if (error) {throw new Error(`Failed to clear developers: ${error.message}`)}
}