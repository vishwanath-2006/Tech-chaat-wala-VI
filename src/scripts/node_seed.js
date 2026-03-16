import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf8')
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim()

const supabase = createClient(url, key)

const INITIAL_CATEGORIES = [
    { id: 'cat-0', name: 'All', is_visible: true, order: 0 },
    { id: 'cat-1', name: 'Fit-Ware 2.0', is_visible: true, order: 1 },
    { id: 'cat-2', name: 'Chaatis.js', is_visible: true, order: 2 },
    { id: 'cat-3', name: 'Liquid Brews', is_visible: true, order: 3 },
    { id: 'cat-4', name: 'Street Bites', is_visible: true, order: 4 }
];

const INITIAL_MENU_DATA = [
     {
        id: 'fw-1', category: 'Fit-Ware 2.0', name: 'Sprout Circuit Salad', calories: 120, version: '2.1', price: 149, is_sold_out: false, icon: '🥗', image: '/images/sprout_salad.png', is_popular: true,
        description: "A healthy protein-rich salad packed with sprouts, fresh vegetables, and herbs. Highly optimized for quick energy loading.",
        ingredients: ["Mixed Sprouts", "Cherry Tomatoes", "Cucumber", "Lemon-Herb Dressing", "Microgreens"],
        nutrition: { protein: "12g", carbs: "18g", fat: "4g" }, prep_time: 3
    },
    {
        id: 'fw-2', category: 'Fit-Ware 2.0', name: 'Protein Packet Paneer', calories: 340, version: '3.0', price: 189, is_sold_out: false, icon: '🧀', image: '/images/grilled_paneer.png', is_popular: true,
        description: "Premium grilled paneer blocks marinated in our custom spice compiler. Maximize your hardware gains.",
        ingredients: ["Cottage Cheese (Paneer)", "Bell Peppers", "Onions", "Mint Yogurt Drop", "Secret Spice Mix"],
        nutrition: { protein: "24g", carbs: "8g", fat: "22g" }, prep_time: 4
    }
    // ... adding a few more for testing
];

async function seed() {
    console.log('--- Seeding Database ---');
    console.log('Target URL:', url);
    
    const { error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES);
    if (catErr) console.error('Cat Error:', catErr.message);
    else console.log('Categories seeded.');

    const { error: menuErr } = await supabase.from('menu_items').upsert(INITIAL_MENU_DATA);
    if (menuErr) console.error('Menu Error:', menuErr.message);
    else console.log('Menu items seeded.');

    console.log('--- Done ---');
}

seed();
