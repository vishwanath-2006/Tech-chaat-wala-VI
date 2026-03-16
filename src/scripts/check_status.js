import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim()

const supabase = createClient(url, key)

async function checkStatus() {
    console.log('--- Database Content Check ---');
    console.log('Using URL:', url);
    
    const { data: menu, error: menuErr } = await supabase.from('menu_items').select('*');
    const { data: cats, error: catErr } = await supabase.from('categories').select('*');

    if (menuErr) console.error('Menu Error:', menuErr.message);
    if (catErr) console.error('Category Error:', catErr.message);

    console.log('Menu items count:', menu ? menu.length : 0);
    console.log('Categories count:', cats ? cats.length : 0);
    
    if (menu && menu.length > 0) {
        menu.slice(0, 5).forEach(item => {
            console.log(`- [${item.is_sold_out ? 'SOLD OUT' : 'IN STOCK'}] ${item.name}`);
        });
    }

    console.log('--- End ---');
}

checkStatus();
