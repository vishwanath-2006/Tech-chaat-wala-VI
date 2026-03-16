import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim()

console.log('Using URL:', url)
const supabase = createClient(url, key)

async function debug() {
    console.log('--- Table Existence Check ---');
    
    const tables = ['categories', 'menu_items', 'orders'];
    
    for (const table of tables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`❌ Table '${table}': NOT FOUND (${error.message})`);
        } else {
            console.log(`✅ Table '${table}': FOUND`);
        }
    }

    console.log('--- End Test ---');
}

debug();
