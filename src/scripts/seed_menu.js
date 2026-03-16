import { supabase } from '../lib/supabaseClient.js';

const INITIAL_MENU_DATA = [
    {
        id: 'fw-1', category: 'Fit-Ware 2.0', name: 'Sprout Circuit Salad', calories: 120, version: '2.1', price: 149, prepTime: 3, icon: '🥗', image: '/images/sprout_salad.png', isPopular: true, isSoldOut: false,
        description: "A healthy protein-rich salad packed with sprouts, fresh vegetables, and herbs. Highly optimized for quick energy loading.",
        ingredients: ["Mixed Sprouts", "Cherry Tomatoes", "Cucumber", "Lemon-Herb Dressing", "Microgreens"],
        nutrition: { protein: "12g", carbs: "18g", fat: "4g" }
    },
    {
        id: 'fw-2', category: 'Fit-Ware 2.0', name: 'Protein Packet Paneer', calories: 340, version: '3.0', price: 189, prepTime: 4, icon: '🧀', image: '/images/grilled_paneer.png', isPopular: true, isSoldOut: false,
        description: "Premium grilled paneer blocks marinated in our custom spice compiler. Maximize your hardware gains.",
        ingredients: ["Cottage Cheese (Paneer)", "Bell Peppers", "Onions", "Mint Yogurt Drop", "Secret Spice Mix"],
        nutrition: { protein: "24g", carbs: "8g", fat: "22g" }
    },
    {
        id: 'fw-3', category: 'Fit-Ware 2.0', name: 'Quantum Quinoa Bowl', calories: 250, version: '1.4', price: 229, prepTime: 5, icon: '🍲', image: '/images/quinoa_bowl.png', isPopular: false, isSoldOut: false,
        description: "A balanced dataset of quinoa, roasted veggies, and a tangy dressing. Perfectly multithreaded for a complete meal.",
        ingredients: ["Organic Quinoa", "Roasted Zucchini", "Cherry Tomatoes", "Feta Crumble", "Balsamic Glaze"],
        nutrition: { protein: "9g", carbs: "42g", fat: "6g" }
    },
    {
        id: 'fw-4', category: 'Fit-Ware 2.0', name: 'Kernel Kale Salad', calories: 180, version: '2.2', price: 169, prepTime: 3, icon: '🥬', image: '/images/kale_salad.png', isPopular: false, isSoldOut: false,
        description: "Deep learning based raw kale tossed with nuts, seeds, and a sharp vinaigrette. Low latency digestion.",
        ingredients: ["Fresh Kale", "Toasted Almonds", "Sunflower Seeds", "Parmesan Shavings", "Lemon Vinaigrette"],
        nutrition: { protein: "7g", carbs: "12g", fat: "14g" }
    },
    {
        id: 'fw-5', category: 'Fit-Ware 2.0', name: 'Async Avocado Wrap', calories: 410, version: '1.1', price: 249, prepTime: 4, icon: '🌯', image: '/images/avocado_wrap.png', isPopular: true, isSoldOut: false,
        description: "A non-blocking hearty wrap stuffed with fresh avocado, beans, and salsa. Fulfills standard runtime requirements.",
        ingredients: ["Whole Wheat Tortilla", "Hass Avocado", "Black Beans", "Corn Salsa", "Lettuce"],
        nutrition: { protein: "14g", carbs: "54g", fat: "18g" }
    },
    {
        id: 'fw-6', category: 'Fit-Ware 2.0', name: 'Macro Optimized Egg Bowl', calories: 320, version: '1.5', price: 159, prepTime: 4, icon: '🥚', image: '/images/fw_egg.png', isPopular: false, isSoldOut: false,
        description: "High performance egg whites compiled with subtle spices. The ultimate pre-session bootup.",
        ingredients: ["Boiled Eggs", "Spinach Base", "Sautéed Mushrooms", "Cracked Black Pepper"],
        nutrition: { protein: "28g", carbs: "4g", fat: "20g" }
    },
    {
        id: 'fw-7', category: 'Fit-Ware 2.0', name: 'Data-Driven Dal', calories: 280, version: '1.0', price: 159, prepTime: 5, icon: '🥣', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Protein-packed yellow lentils with a tempering of garlic and cumin. A stable foundation for any session.",
        ingredients: ["Yellow Moong Dal", "Garlic", "Cumin", "Turmeric"],
        nutrition: { protein: "18g", carbs: "42g", fat: "6g" }
    },
    {
        id: 'fw-8', category: 'Fit-Ware 2.0', name: 'Silicon Soya Chunks', calories: 310, version: '1.2', price: 179, prepTime: 4, icon: '🌱', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', isPopular: false, isSoldOut: false,
        description: "High-protein soya chunks stir-fried with bell peppers and green onions. Optimized for muscle compilation.",
        ingredients: ["Soya Chunks", "Bell Peppers", "Soy Sauce", "Ginger-Garlic Paste"],
        nutrition: { protein: "32g", carbs: "12g", fat: "4g" }
    },
    {
        id: 'fw-9', category: 'Fit-Ware 2.0', name: 'Root Directory Roast', calories: 400, version: '2.0', price: 269, prepTime: 6, icon: '🍗', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=600', isPopular: true, isSoldOut: false,
        description: "Oven-roasted lean chicken or sweet potato with rosemary and thyme. The root of all good nutrition.",
        ingredients: ["Roasted Chicken/Sweet Potato", "Rosemary", "Olive Oil", "Garlic"],
        nutrition: { protein: "35g", carbs: "15g", fat: "12g" }
    },
    {
        id: 'fw-10', category: 'Fit-Ware 2.0', name: 'Neural Network Nut Mix', calories: 150, version: '1.0', price: 129, prepTime: 1, icon: '🥜', image: 'https://images.unsplash.com/photo-1596506306546-2187fa594191?auto=format&fit=crop&q=80&w=600', isPopular: false, isSoldOut: false,
        description: "A smart blend of almonds, walnuts, and pumpkin seeds. Boosts brain bandwidth for complex debugging.",
        ingredients: ["Almonds", "Walnuts", "Pumpkin Seeds", "Sea Salt"],
        nutrition: { protein: "6g", carbs: "8g", fat: "14g" }
    },
    {
        id: 'cj-1', category: 'Chaatis.js', name: 'Circuit-Breaker Pani Puri', calories: 180, version: '4.0', price: 89, prepTime: 2, icon: '🥟', image: '/images/pani_puri.png', isPopular: true, isSoldOut: false,
        description: "A burst of spicy, tangy flavor guaranteed to overload your taste sensors safely.",
        ingredients: ["Crispy Puris", "Spicy Mint Water", "Tamarind Chutney", "Mashed Potato & Chickpeas"],
        nutrition: { protein: "4g", carbs: "32g", fat: "6g" }
    },
    {
        id: 'cj-2', category: 'Chaatis.js', name: 'Samosa CPU Chaat', calories: 420, version: '5.1', price: 129, prepTime: 4, icon: '🥠', image: '/images/samosa_chaat.png', isPopular: true, isSoldOut: false,
        description: "Overclocked crushed samosa topped with an array of chutneys, sweetened curd, and sev. High processing power required.",
        ingredients: ["Crushed Samosa", "Sweet Curd", "Green Chutney", "Dates & Tamarind Chutney", "Crispy Sev"],
        nutrition: { protein: "8g", carbs: "56g", fat: "22g" }
    },
    {
        id: 'cj-3', category: 'Chaatis.js', name: 'Packet-Switched Pakora', calories: 350, version: '2.0', price: 99, prepTime: 5, icon: '🧅', image: '/images/cj_pakora.png', isPopular: false, isSoldOut: false,
        description: "Assorted deep-fried vegetable fritters served hot and fast like UDP packets.",
        ingredients: ["Sliced Onions", "Gram Flour Base", "Green Chilies", "Coriander", "Chaat Masala"],
        nutrition: { protein: "10g", carbs: "40g", fat: "16g" }
    },
    {
        id: 'cj-4', category: 'Chaatis.js', name: 'Cache-Memory Kachori', calories: 480, version: '3.3', price: 89, prepTime: 3, icon: '🍘', image: '/images/cj_kachori.png', isPopular: false, isSoldOut: false,
        description: "A flaky, deeply stored flavor payload that takes time to compute but delivers extreme satisfaction.",
        ingredients: ["Crushed Kachori", "Spiced Lentil Filling", "Yogurt", "Cilantro Chutney", "Pomegranate"],
        nutrition: { protein: "8g", carbs: "58g", fat: "24g" }
    },
    {
        id: 'cj-5', category: 'Chaatis.js', name: 'Async Aloo Tikki', calories: 320, version: '3.2', price: 119, prepTime: 4, icon: '🥔', image: '/images/aloo_tikki.png', isPopular: true, isSoldOut: false,
        description: "Crispy potato patties executed concurrently with spicy and sweet chutneys.",
        ingredients: ["Mashed Potato Patties", "Chaat Masala", "Mint & Coriander Dip", "Tamarind Drizzle", "Sev"],
        nutrition: { protein: "5g", carbs: "48g", fat: "12g" }
    },
    {
        id: 'cj-6', category: 'Chaatis.js', name: 'DDoS Dahi Bhalla', calories: 290, version: '2.4', price: 139, prepTime: 3, icon: '🥣', image: '/images/dahi_bhalla.png', isPopular: true, isSoldOut: false,
        description: "A massive influx of soft lentil dumplings flooded in sweetened, chilled yogurt.",
        ingredients: ["Urad Dal Dumplings", "Chilled Sweet Yogurt", "Cumin Powder", "Red Chili Drizzle", "Imli Chutney"],
        nutrition: { protein: "12g", carbs: "45g", fat: "6g" }
    },
    {
        id: 'cj-7', category: 'Chaatis.js', name: 'API Papdi Chaat', calories: 220, version: '1.1', price: 109, prepTime: 3, icon: '🍪', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Crispy papdis topped with dynamic data points of potato, curd, and spices.",
        ingredients: ["Papdi", "Potato", "Curd", "Chutneys", "Sev"],
        nutrition: { protein: "5g", carbs: "38g", fat: "8g" }
    },
    {
        id: 'cj-8', category: 'Chaatis.js', name: 'B-Tree Bhel Puri', calories: 180, version: '2.0', price: 99, prepTime: 2, icon: '🥣', image: 'https://images.unsplash.com/photo-1517244465804-747da30022ad?auto=format&fit=crop&q=80&w=600', isPopular: false, isSoldOut: false,
        description: "Balanced tree of puffed rice, vegetables, and chutneys. Light and efficient.",
        ingredients: ["Puffed Rice", "Onions", "Tomatoes", "Tamarind Sauce", "Sev"],
        nutrition: { protein: "4g", carbs: "30g", fat: "4g" }
    },
    {
        id: 'cj-9', category: 'Chaatis.js', name: 'V-Model Vada Pav', calories: 310, version: '1.5', price: 79, prepTime: 3, icon: '🥯', image: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Verification and Validation of the perfect potato slider with spicy dry chutney.",
        ingredients: ["Potato Fritter", "Bun (Pav)", "Garlic Chutney", "Green Chili"],
        nutrition: { protein: "6g", carbs: "42g", fat: "14g" }
    },
    {
        id: 'cj-10', category: 'Chaatis.js', name: 'Refactored Ragda Pattice', calories: 280, version: '1.2', price: 129, prepTime: 4, icon: '🍛', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Potato patties recursively dipped in white pea curry. Highly modular flavor.",
        ingredients: ["Potato Pattice", "White Peas Curry", "Onions", "Coriander", "Tamarind"],
        nutrition: { protein: "10g", carbs: "44g", fat: "5g" }
    }
];

const INITIAL_CATEGORIES = [
    { id: 'cat-0', name: 'All', isVisible: true, order: 0 },
    { id: 'cat-1', name: 'Fit-Ware 2.0', isVisible: true, order: 1 },
    { id: 'cat-2', name: 'Chaatis.js', isVisible: true, order: 2 },
    { id: 'cat-3', name: 'Liquid Brews', isVisible: true, order: 3 },
    { id: 'cat-4', name: 'Street Bites', isVisible: true, order: 4 }
];

async function seed() {
    console.log('--- Starting Menu Seeding ---');

    // 1. Seed Categories
    console.log('Seeding categories...');
    const { error: catError } = await supabase
        .from('categories')
        .upsert(INITIAL_CATEGORIES, { onConflict: 'id' });

    if (catError) console.error('Category Seeding Error:', catError);
    else console.log('Categories seeded successfully!');

    // 2. Seed Menu Items
    console.log('Seeding menu items...');
    const menuItems = INITIAL_MENU_DATA.map(item => ({
        id: item.id,
        category: item.category,
        name: item.name,
        price: item.price,
        is_sold_out: item.isSoldOut,
        image: item.image,
        icon: item.icon,
        is_popular: item.isPopular,
        calories: item.calories,
        version: item.version,
        description: item.description,
        ingredients: item.ingredients,
        nutrition: item.nutrition,
        prep_time: item.prepTime
    }));

    const { error: menuError } = await supabase
        .from('menu_items')
        .upsert(menuItems, { onConflict: 'id' });

    if (menuError) console.error('Menu Seeding Error:', menuError);
    else console.log('Menu items seeded successfully!');

    console.log('--- Seeding Complete ---');
}

seed();
