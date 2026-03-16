import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env loading
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) envVars[key.trim()] = value.trim();
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_CATEGORIES = [
    { id: 'cat-0', name: 'All', is_visible: true, order: 0 },
    { id: 'cat-1', name: 'Fit-Ware 2.0', is_visible: true, order: 1 },
    { id: 'cat-2', name: 'Chaatis.js', is_visible: true, order: 2 },
    { id: 'cat-3', name: 'Liquid Brews', is_visible: true, order: 3 },
    { id: 'cat-4', name: 'Street Bites', is_visible: true, order: 4 }
];

const INITIAL_MENU_DATA = [
    { id: 'fw-1', category: 'Fit-Ware 2.0', name: 'Sprout Circuit Salad', calories: 120, version: '2.1', price: 149, is_popular: true, is_sold_out: false, description: "A healthy protein-rich salad packed with sprouts, fresh vegetables, and herbs.", ingredients: ["Mixed Sprouts", "Cherry Tomatoes", "Cucumber"], nutrition: { protein: "12g", carbs: "18g", fat: "4g" }, prep_time: 3, image: '/images/sprout_salad.png', icon: '🥗' },
    { id: 'fw-2', category: 'Fit-Ware 2.0', name: 'Protein Packet Paneer', calories: 340, version: '3.0', price: 189, is_popular: true, is_sold_out: false, description: "Premium grilled paneer blocks marinated in our custom spice compiler.", ingredients: ["Cottage Cheese (Paneer)", "Bell Peppers"], nutrition: { protein: "24g", carbs: "8g", fat: "22g" }, prep_time: 4, image: '/images/grilled_paneer.png', icon: '🧀' },
    { id: 'fw-3', category: 'Fit-Ware 2.0', name: 'Quantum Quinoa Bowl', calories: 250, version: '1.4', price: 229, is_popular: false, is_sold_out: false, description: "A balanced dataset of quinoa, roasted veggies, and a tangy dressing.", ingredients: ["Organic Quinoa", "Roasted Zucchini"], nutrition: { protein: "9g", carbs: "42g", fat: "6g" }, prep_time: 5, image: '/images/quinoa_bowl.png', icon: '🍲' },
    { id: 'fw-4', category: 'Fit-Ware 2.0', name: 'Kernel Kale Salad', calories: 180, version: '2.2', price: 169, is_popular: false, is_sold_out: false, description: "Deep learning based raw kale tossed with nuts and seeds.", ingredients: ["Fresh Kale", "Toasted Almonds"], nutrition: { protein: "7g", carbs: "12g", fat: "14g" }, prep_time: 3, image: '/images/kale_salad.png', icon: '🥬' },
    { id: 'fw-5', category: 'Fit-Ware 2.0', name: 'Async Avocado Wrap', calories: 410, version: '1.1', price: 249, is_popular: true, is_sold_out: false, description: "A non-blocking hearty wrap stuffed with fresh avocado, beans, and salsa.", ingredients: ["Whole Wheat Tortilla", "Hass Avocado"], nutrition: { protein: "14g", carbs: "54g", fat: "18g" }, prep_time: 4, image: '/images/avocado_wrap.png', icon: '🌯' },
    { id: 'fw-6', category: 'Fit-Ware 2.0', name: 'Macro Optimized Egg Bowl', calories: 320, version: '1.5', price: 159, is_popular: false, is_sold_out: false, description: "High performance egg whites compiled with subtle spices.", ingredients: ["Boiled Eggs", "Spinach Base"], nutrition: { protein: "28g", carbs: "4g", fat: "20g" }, prep_time: 4, image: '/images/fw_egg.png', icon: '🥚' },
    { id: 'fw-7', category: 'Fit-Ware 2.0', name: 'Data-Driven Dal', calories: 280, version: '1.0', price: 159, is_popular: false, is_sold_out: false, description: "Protein-packed yellow lentils with a tempering of garlic and cumin.", ingredients: ["Yellow Moong Dal", "Garlic"], nutrition: { protein: "18g", carbs: "42g", fat: "6g" }, prep_time: 5, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400', icon: '🥣' },
    { id: 'fw-8', category: 'Fit-Ware 2.0', name: 'Silicon Soya Chunks', calories: 310, version: '1.2', price: 179, is_popular: false, is_sold_out: false, description: "High-protein soya chunks stir-fried with bell peppers.", ingredients: ["Soya Chunks", "Bell Peppers"], nutrition: { protein: "32g", carbs: "12g", fat: "4g" }, prep_time: 4, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', icon: '🌱' },
    { id: 'fw-9', category: 'Fit-Ware 2.0', name: 'Root Directory Roast', calories: 400, version: '2.0', price: 269, is_popular: true, is_sold_out: false, description: "Oven-roasted lean chicken or sweet potato with rosemary and thyme.", ingredients: ["Roasted Chicken/Sweet Potato", "Rosemary"], nutrition: { protein: "35g", carbs: "15g", fat: "12g" }, prep_time: 6, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=600', icon: '🍗' },
    { id: 'fw-10', category: 'Fit-Ware 2.0', name: 'Neural Network Nut Mix', calories: 150, version: '1.0', price: 129, is_popular: false, is_sold_out: false, description: "A smart blend of almonds, walnuts, and pumpkin seeds.", ingredients: ["Almonds", "Walnuts"], nutrition: { protein: "6g", carbs: "8g", fat: "14g" }, prep_time: 1, image: 'https://images.unsplash.com/photo-1596506306546-2187fa594191?auto=format&fit=crop&q=80&w=600', icon: '🥜' },
    { id: 'cj-1', category: 'Chaatis.js', name: 'Circuit-Breaker Pani Puri', calories: 180, version: '4.0', price: 89, is_popular: true, is_sold_out: false, description: "A burst of spicy, tangy flavor guaranteed to overload your sensors.", ingredients: ["Crispy Puris", "Spicy Mint Water"], nutrition: { protein: "4g", carbs: "32g", fat: "6g" }, prep_time: 2, image: '/images/pani_puri.png', icon: '🥟' },
    { id: 'cj-2', category: 'Chaatis.js', name: 'Samosa CPU Chaat', calories: 420, version: '5.1', price: 129, is_popular: true, is_sold_out: false, description: "Overclocked crushed samosa topped with an array of chutneys.", ingredients: ["Crushed Samosa", "Sweet Curd"], nutrition: { protein: "8g", carbs: "56g", fat: "22g" }, prep_time: 4, image: '/images/samosa_chaat.png', icon: '🥠' },
    { id: 'cj-3', category: 'Chaatis.js', name: 'Packet-Switched Pakora', calories: 350, version: '2.0', price: 99, is_popular: false, is_sold_out: false, description: "Assorted deep-fried vegetable fritters served hot and fast.", ingredients: ["Sliced Onions", "Gram Flour Base"], nutrition: { protein: "10g", carbs: "40g", fat: "16g" }, prep_time: 5, image: '/images/cj_pakora.png', icon: '🧅' },
    { id: 'cj-4', category: 'Chaatis.js', name: 'Cache-Memory Kachori', calories: 480, version: '3.3', price: 89, is_popular: false, is_sold_out: false, description: "A flaky, deeply stored flavor payload.", ingredients: ["Crushed Kachori", "Spiced Lentil Filling"], nutrition: { protein: "8g", carbs: "58g", fat: "24g" }, prep_time: 3, image: '/images/cj_kachori.png', icon: '🍘' },
    { id: 'cj-5', category: 'Chaatis.js', name: 'Async Aloo Tikki', calories: 320, version: '3.2', price: 119, is_popular: true, is_sold_out: false, description: "Crispy potato patties executed concurrently with chutneys.", ingredients: ["Mashed Potato Patties", "Chaat Masala"], nutrition: { protein: "5g", carbs: "48g", fat: "12g" }, prep_time: 4, image: '/images/aloo_tikki.png', icon: '🥔' },
    { id: 'cj-6', category: 'Chaatis.js', name: 'DDoS Dahi Bhalla', calories: 290, version: '2.4', price: 139, is_popular: true, is_sold_out: false, description: "Soft lentil dumplings flooded in sweetened, chilled yogurt.", ingredients: ["Urad Dal Dumplings", "Chilled Sweet Yogurt"], nutrition: { protein: "12g", carbs: "45g", fat: "6g" }, prep_time: 3, image: '/images/dahi_bhalla.png', icon: '🥣' },
    { id: 'lb-2', category: 'Liquid Brews', name: 'Nitro Processed Coffee', calories: 120, version: '4.2', price: 149, is_popular: true, is_sold_out: false, description: "Cold-brewed, nitrogen-infused coffee.", ingredients: ["Premium Arabica Cold Brew", "Nitrogen Gas"], nutrition: { protein: "1g", carbs: "12g", fat: "0g" }, prep_time: 2, image: '/images/nitro_coffee.png', icon: '☕' },
    { id: 'lb-6', category: 'Liquid Brews', name: 'Latino Lassi.exe', calories: 210, version: '2.0', price: 99, is_popular: true, is_sold_out: false, description: "A thick, yogurt-based standalone executable.", ingredients: ["Fresh Yogurt", "Sugar"], nutrition: { protein: "8g", carbs: "28g", fat: "7g" }, prep_time: 2, image: '/images/mango_lassi.png', icon: '🥛' },
    { id: 'lb-7', category: 'Liquid Brews', name: 'Overclocked Orange Juice', calories: 110, version: '1.0', price: 129, is_popular: false, is_sold_out: false, description: "Freshly squeezed oranges with a boost of vitamins.", ingredients: ["Fresh Oranges", "Pulp"], nutrition: { protein: "1g", carbs: "28g", fat: "0g" }, prep_time: 2, image: '/images/orange_juice.png', icon: '🍊' },
    { id: 'sb-1', category: 'Street Bites', name: 'Veg Shawarma Wrap', calories: 350, price: 159, is_popular: false, is_sold_out: false, description: "Grilled veggie shawarma wrap with garlic sauce.", ingredients: ["Assorted Veggies", "Garlic Sauce"], nutrition: { protein: "8g", carbs: "45g", fat: "12g" }, prep_time: 4, image: '/images/veg_shawarma.png', icon: '🌯' },
    { id: 'sb-2', category: 'Street Bites', name: 'Chicken Shawarma Roll', calories: 420, price: 189, is_popular: true, is_sold_out: false, description: "Spiced chicken shawarma roll with fresh salad.", ingredients: ["Grilled Chicken", "Salad"], nutrition: { protein: "24g", carbs: "38g", fat: "18g" }, prep_time: 4, image: '/images/chicken_shawarma.png', icon: '🥙' },
    { id: 'sb-4', category: 'Street Bites', name: 'Loaded Nachos', calories: 450, price: 199, is_popular: true, is_sold_out: false, description: "Nachos topped with cheese, salsa and jalapeños.", ingredients: ["Corn Tortilla Chips", "Cheese Sauce"], nutrition: { protein: "7g", carbs: "52g", fat: "22g" }, prep_time: 3, image: '/images/nachos.png', icon: '🌮' },
    { id: 'sb-6', category: 'Street Bites', name: 'Veg Burger Deluxe', calories: 410, price: 169, is_popular: false, is_sold_out: false, description: "Crispy veggie patty burger with lettuce and sauce.", ingredients: ["Veg Patty", "Burger Bun"], nutrition: { protein: "11g", carbs: "48g", fat: "16g" }, prep_time: 4, image: '/images/veg_burger.png', icon: '🍔' },
    { id: 'sb-8', category: 'Street Bites', name: 'Crispy Fries Bucket', calories: 380, price: 129, is_popular: false, is_sold_out: false, description: "Golden crispy fries with seasoning.", ingredients: ["Potato Strips", "Salt"], nutrition: { protein: "4g", carbs: "42g", fat: "18g" }, prep_time: 3, image: '/images/french_fries.png', icon: '🍟' }
];

async function seed() {
    console.log('--- REPOPULATING MENU AND CATEGORIES ---');
    
    try {
        // 1. Clear existing
        console.log('Clearing old data...');
        await supabase.from('menu_items').delete().neq('id', 'temp_fix');
        await supabase.from('categories').delete().neq('id', 'temp_fix');

        // 2. Insert categories
        console.log('Restoring categories...');
        const { error: catErr } = await supabase.from('categories').insert(INITIAL_CATEGORIES);
        if (catErr) throw catErr;

        // 3. Insert menu
        console.log('Restoring menu items...');
        const { error: menuErr } = await supabase.from('menu_items').insert(INITIAL_MENU_DATA);
        if (menuErr) throw menuErr;

        console.log('✅ RESTORATION COMPLETE');
    } catch (err) {
        console.error('❌ RESTORATION FAILED:', err.message);
    }
}

seed();
