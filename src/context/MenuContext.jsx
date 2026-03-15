import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial dataset
const INITIAL_MENU_DATA = [
    // Fit-Ware 2.0 (Healthy Tech Meals)
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
        id: 'fw-6', category: 'Fit-Ware 2.0', name: 'Macro Optimized Egg Bowl', calories: 320, version: '1.5', price: 159, prepTime: 4, icon: '🥚', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
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
        id: 'fw-8', category: 'Fit-Ware 2.0', name: 'Silicon Soya Chunks', calories: 310, version: '1.2', price: 179, prepTime: 4, icon: '🌱', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "High-protein soya chunks stir-fried with bell peppers and green onions. Optimized for muscle compilation.",
        ingredients: ["Soya Chunks", "Bell Peppers", "Soy Sauce", "Ginger-Garlic Paste"],
        nutrition: { protein: "32g", carbs: "12g", fat: "4g" }
    },
    {
        id: 'fw-9', category: 'Fit-Ware 2.0', name: 'Root Directory Roast', calories: 400, version: '2.0', price: 269, prepTime: 6, icon: '🍗', image: 'https://images.unsplash.com/photo-1594221708779-94822f4335d4?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Oven-roasted lean chicken or sweet potato with rosemary and thyme. The root of all good nutrition.",
        ingredients: ["Roasted Chicken/Sweet Potato", "Rosemary", "Olive Oil", "Garlic"],
        nutrition: { protein: "35g", carbs: "15g", fat: "12g" }
    },
    {
        id: 'fw-10', category: 'Fit-Ware 2.0', name: 'Neural Network Nut Mix', calories: 150, version: '1.0', price: 129, prepTime: 1, icon: '🥜', image: 'https://images.unsplash.com/photo-1511117833452-4724f3ce098a?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "A smart blend of almonds, walnuts, and pumpkin seeds. Boosts brain bandwidth for complex debugging.",
        ingredients: ["Almonds", "Walnuts", "Pumpkin Seeds", "Sea Salt"],
        nutrition: { protein: "6g", carbs: "8g", fat: "14g" }
    },

    // Chaatis.js (Street Food Classics)
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
        id: 'cj-3', category: 'Chaatis.js', name: 'Packet-Switched Pakora', calories: 350, version: '2.0', price: 99, prepTime: 5, icon: '🧅', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
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
        id: 'cj-8', category: 'Chaatis.js', name: 'B-Tree Bhel Puri', calories: 180, version: '2.0', price: 99, prepTime: 2, icon: '🥣', image: 'https://images.unsplash.com/photo-1517244465804-747da30022ad?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Balanced tree of puffed rice, vegetables, and chutneys. Light and efficient.",
        ingredients: ["Puffed Rice", "Onions", "Tomatoes", "Tamarind Sauce", "Sev"],
        nutrition: { protein: "4g", carbs: "30g", fat: "4g" }
    },
    {
        id: 'cj-9', category: 'Chaatis.js', name: 'V-Model Vada Pav', calories: 310, version: '1.5', price: 79, prepTime: 3, icon: '🥯', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Verification and Validation of the perfect potato slider with spicy dry chutney.",
        ingredients: ["Potato Fritter", "Bun (Pav)", "Garlic Chutney", "Green Chili"],
        nutrition: { protein: "6g", carbs: "42g", fat: "14g" }
    },
    {
        id: 'cj-10', category: 'Chaatis.js', name: 'Refactored Ragda Pattice', calories: 280, version: '1.2', price: 129, prepTime: 4, icon: '🍛', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Potato patties recursively dipped in white pea curry. Highly modular flavor.",
        ingredients: ["Potato Pattice", "White Peas Curry", "Onions", "Coriander", "Tamarind"],
        nutrition: { protein: "10g", carbs: "44g", fat: "5g" }
    },

    // Liquid Brews (Drinks)
    {
        id: 'lb-1', category: 'Liquid Brews', name: 'Cyber Shikanji', calories: 85, version: '1.0', price: 69, prepTime: 1, icon: '🍋', image: 'https://images.unsplash.com/photo-1513558161293-cdaf76589fdc?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "An electrified version of the classic Indian lemonade. Refreshing, bright, and resets your session.",
        ingredients: ["Fresh Lemon Juice", "Roasted Cumin Server", "Black Salt", "Mint Leaves", "Chilled Water"],
        nutrition: { protein: "0g", carbs: "22g", fat: "0g" }
    },
    {
        id: 'lb-2', category: 'Liquid Brews', name: 'Nitro Processed Coffee', calories: 120, version: '4.2', price: 149, prepTime: 2, icon: '☕', image: '/images/nitro_coffee.png', isPopular: true, isSoldOut: false,
        description: "Cold-brewed, nitrogen-infused coffee that downloads energy directly to your mainline.",
        ingredients: ["Premium Arabica Cold Brew", "Nitrogen Gas", "Vanilla Syrup (Optional)", "Ice"],
        nutrition: { protein: "1g", carbs: "12g", fat: "0g" }
    },
    {
        id: 'lb-3', category: 'Liquid Brews', name: 'Bandwidth Berry Soda', calories: 160, version: '2.5', price: 119, prepTime: 1, icon: '🫐', image: 'https://images.unsplash.com/photo-1513267048331-5611cad82e41?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "High-throughput mixed berry soda. Effervescent and violently purple.",
        ingredients: ["Mixed Berry Compote", "Sparkling Water", "Mint Sprig", "Lime Wedge"],
        nutrition: { protein: "0g", carbs: "38g", fat: "0g" }
    },
    {
        id: 'lb-4', category: 'Liquid Brews', name: 'Latency-Free Lemonade', calories: 95, version: '1.2', price: 79, prepTime: 1, icon: '🧃', image: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Zero ping, instant thirst quenching. Classic, no-nonsense lemonade.",
        ingredients: ["Lemon", "Simple Syrup", "Ice", "Filtered Water"],
        nutrition: { protein: "0g", carbs: "24g", fat: "0g" }
    },
    {
        id: 'lb-5', category: 'Liquid Brews', name: 'Cloud Matcha Latte', calories: 180, version: '3.1', price: 169, prepTime: 3, icon: '🍵', image: 'https://images.unsplash.com/photo-1515823662273-0b25528a29c6?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Earthy, robust matcha floated on an airy cloud of perfectly foamed milk.",
        ingredients: ["Ceremonial Grade Matcha", "Steamed Oat Milk", "Agave Nectar"],
        nutrition: { protein: "4g", carbs: "26g", fat: "6g" }
    },
    {
        id: 'lb-6', category: 'Liquid Brews', name: 'Latino Lassi.exe', calories: 210, version: '2.0', price: 99, prepTime: 2, icon: '🥛', image: '/images/mango_lassi.png', isPopular: true, isSoldOut: false,
        description: "A thick, yogurt-based standalone executable. Sweet, rich, and traditionally fulfilling.",
        ingredients: ["Fresh Yogurt", "Sugar", "Cardamom Powder", "Rose Water", "Pistachio Garnish"],
        nutrition: { protein: "8g", carbs: "28g", fat: "7g" }
    },
    {
        id: 'lb-7', category: 'Liquid Brews', name: 'Overclocked Orange Juice', calories: 110, version: '1.0', price: 129, prepTime: 2, icon: '🍊', image: '/images/orange_juice.png', isPopular: false, isSoldOut: false,
        description: "Freshly squeezed oranges with a boost of vitamins. Overclocks your immune system.",
        ingredients: ["Fresh Oranges", "Pulp", "Ice"],
        nutrition: { protein: "1g", carbs: "28g", fat: "0g" }
    },
    {
        id: 'lb-8', category: 'Liquid Brews', name: 'Mainframe Masala Chai', calories: 90, version: '1.5', price: 59, prepTime: 3, icon: '☕', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Strong ginger-cardamom tea. The essential fuel for late-night mainframe maintenance.",
        ingredients: ["Tea Leaves", "Milk", "Ginger", "Cardamom"],
        nutrition: { protein: "3g", carbs: "12g", fat: "4g" }
    },
    {
        id: 'lb-9', category: 'Liquid Brews', name: 'UDP Unfiltered Coconut Water', calories: 45, version: '1.0', price: 89, prepTime: 1, icon: '🥥', image: 'https://images.unsplash.com/photo-1526016655855-75842c330df3?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Direct transmission of electrolytes. Unfiltered and raw for maximum reliability.",
        ingredients: ["Tender Coconut Water"],
        nutrition: { protein: "0g", carbs: "11g", fat: "0g" }
    },
    {
        id: 'lb-10', category: 'Liquid Brews', name: 'Soft Reboot Strawberry Shake', calories: 320, version: '2.1', price: 169, prepTime: 3, icon: '🥤', image: 'https://images.unsplash.com/photo-1543644574-2cbf61a7188b?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "A creamy strawberry shake to softly reboot your senses after a stressful build.",
        ingredients: ["Strawberries", "Milk", "Vanilla Ice Cream", "Sugar"],
        nutrition: { protein: "6g", carbs: "48g", fat: "12g" }
    },

    // Street Bites (Quick Snacks)
    {
        id: 'sb-1', category: 'Street Bites', name: 'Veg Shawarma Wrap', calories: 350, price: 159, prepTime: 4, icon: '🌯', image: '/images/veg_shawarma.png', isPopular: false, isSoldOut: false,
        description: "Grilled veggie shawarma wrap with garlic sauce.",
        ingredients: ["Assorted Veggies", "Garlic Sauce", "Pita Bread"],
        nutrition: { protein: "8g", carbs: "45g", fat: "12g" }
    },
    {
        id: 'sb-2', category: 'Street Bites', name: 'Chicken Shawarma Roll', calories: 420, price: 189, prepTime: 4, icon: '🥙', image: '/images/chicken_shawarma.png', isPopular: true, isSoldOut: false,
        description: "Spiced chicken shawarma roll with fresh salad.",
        ingredients: ["Grilled Chicken", "Salad", "Mayonnaise", "Rumali Roti"],
        nutrition: { protein: "24g", carbs: "38g", fat: "18g" }
    },
    {
        id: 'sb-3', category: 'Street Bites', name: 'Falafel Pocket', calories: 320, price: 149, prepTime: 5, icon: '🧆', image: 'https://images.unsplash.com/photo-1547046296-5fe111c10f2d?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Crispy falafel with hummus in pita bread.",
        ingredients: ["Falafel", "Hummus", "Pickles", "Pita Bread"],
        nutrition: { protein: "10g", carbs: "42g", fat: "14g" }
    },
    {
        id: 'sb-4', category: 'Street Bites', name: 'Loaded Nachos', calories: 450, price: 199, prepTime: 3, icon: '🌮', image: '/images/nachos.png', isPopular: true, isSoldOut: false,
        description: "Nachos topped with cheese, salsa and jalapeños.",
        ingredients: ["Corn Tortilla Chips", "Cheese Sauce", "Salsa", "Jalapeños"],
        nutrition: { protein: "7g", carbs: "52g", fat: "22g" }
    },
    {
        id: 'sb-5', category: 'Street Bites', name: 'Cheese Garlic Bread', calories: 300, price: 139, prepTime: 5, icon: '🍞', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400', isPopular: false, isSoldOut: false,
        description: "Toasted garlic bread topped with melted cheese.",
        ingredients: ["French Bread", "Garlic Butter", "Mozzarella Cheese"],
        nutrition: { protein: "9g", carbs: "34g", fat: "15g" }
    },
    {
        id: 'sb-6', category: 'Street Bites', name: 'Veg Burger Deluxe', calories: 410, price: 169, prepTime: 4, icon: '🍔', image: '/images/veg_burger.png', isPopular: false, isSoldOut: false,
        description: "Crispy veggie patty burger with lettuce and sauce.",
        ingredients: ["Veg Patty", "Burger Bun", "Lettuce", "Tomato", "Special Sauce"],
        nutrition: { protein: "11g", carbs: "48g", fat: "16g" }
    },
    {
        id: 'sb-7', category: 'Street Bites', name: 'Chicken Burger Pro', calories: 480, price: 209, prepTime: 4, icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Juicy chicken burger with spicy mayo.",
        ingredients: ["Chicken Patty", "Cheese Slice", "Spicy Mayo", "Caramelized Onions"],
        nutrition: { protein: "22g", carbs: "44g", fat: "24g" }
    },
    {
        id: 'sb-8', category: 'Street Bites', name: 'Crispy Fries Bucket', calories: 380, price: 129, prepTime: 3, icon: '🍟', image: '/images/french_fries.png', isPopular: false, isSoldOut: false,
        description: "Golden crispy fries with seasoning.",
        ingredients: ["Potato Strips", "Salt", "Special Seasoning"],
        nutrition: { protein: "4g", carbs: "42g", fat: "18g" }
    },
    {
        id: 'sb-9', category: 'Street Bites', name: 'Peri-Peri Fries', calories: 390, price: 139, prepTime: 3, icon: '🍟', image: 'https://images.unsplash.com/photo-1518013391915-e40643a1bce3?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Fries tossed with spicy peri-peri seasoning.",
        ingredients: ["Potato Strips", "Peri-Peri Spice Mix"],
        nutrition: { protein: "4g", carbs: "44g", fat: "18g" }
    },
    {
        id: 'sb-10', category: 'Street Bites', name: 'Loaded Cheese Fries', calories: 430, price: 159, prepTime: 3, icon: '🍟', image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=400', isPopular: true, isSoldOut: false,
        description: "Fries topped with melted cheese sauce.",
        ingredients: ["Potato Strips", "Cheese Sauce", "Spring Onions"],
        nutrition: { protein: "6g", carbs: "46g", fat: "22g" }
    }
];

export const INITIAL_CATEGORIES = [
    { id: 'cat-0', name: 'All', isVisible: true, order: 0 },
    { id: 'cat-1', name: 'Fit-Ware 2.0', isVisible: true, order: 1 },
    { id: 'cat-2', name: 'Chaatis.js', isVisible: true, order: 2 },
    { id: 'cat-3', name: 'Liquid Brews', isVisible: true, order: 3 },
    { id: 'cat-4', name: 'Street Bites', isVisible: true, order: 4 }
];

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    // Basic state hosting the full menu list. Defaults to the initial mock data above.
    const [menuData, setMenuData] = useState(() => {
        try {
            const saved = localStorage.getItem('tcw_menu');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Sync logic: Ensure all INITIAL_MENU_DATA items exist in the state
                    // This allows adding new items to the hardcoded list and having them show up for existing users
                    const existingIds = new Set(parsed.map(item => item.id));
                    const newItems = INITIAL_MENU_DATA.filter(item => !existingIds.has(item.id));
                    if (newItems.length > 0) {
                        return [...parsed, ...newItems];
                    }
                    return parsed;
                }
            }
        } catch (e) { console.error(e); }
        return INITIAL_MENU_DATA;
    });

    const [categories, setCategories] = useState(() => {
        try {
            const saved = localStorage.getItem('tcw_categories');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Sync logic for categories
                    const existingNames = new Set(parsed.map(c => c.name));
                    const newCats = INITIAL_CATEGORIES.filter(c => !existingNames.has(c.name));
                    if (newCats.length > 0) {
                        return [...parsed, ...newCats].sort((a, b) => (a.order || 0) - (b.order || 0));
                    }
                    return parsed;
                }
            }
        } catch (e) { console.error(e); }
        return INITIAL_CATEGORIES;
    });

    useEffect(() => {
        localStorage.setItem('tcw_menu', JSON.stringify(menuData));
    }, [menuData]);

    useEffect(() => {
        localStorage.setItem('tcw_categories', JSON.stringify(categories));
    }, [categories]);

    // Categories CRUD
    const addCategory = (categoryObj) => {
        setCategories(prev => [...prev, categoryObj]);
    };

    const updateCategory = (updatedCat) => {
        setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
    };

    const deleteCategory = (catId, fallbackCategoryName) => {
        const catToDelete = categories.find(c => c.id === catId);
        if (!catToDelete) return;

        // Reassign items matching this category
        setMenuData(prev => prev.map(item =>
            item.category === catToDelete.name ? { ...item, category: fallbackCategoryName } : item
        ));

        // Remove category
        setCategories(prev => prev.filter(c => c.id !== catId));
    };

    const reorderCategories = (newOrderArray) => {
        setCategories(newOrderArray);
    };

    const toggleCategoryVisibility = (catId) => {
        setCategories(prev => prev.map(c =>
            c.id === catId ? { ...c, isVisible: !c.isVisible } : c
        ));
    };

    // Reorder whole menu
    const reorderMenu = (newOrderArray) => {
        setMenuData(newOrderArray);
    };

    // Add entirely new item
    const addItem = (item) => {
        setMenuData(prev => [...prev, item]);
    };

    // Update full item
    const updateItem = (updatedItem) => {
        setMenuData(prev => prev.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        ));
    };

    // Toggle Sold Out status
    const toggleSoldOut = (itemId) => {
        setMenuData(prev => prev.map(item =>
            item.id === itemId ? { ...item, isSoldOut: !item.isSoldOut } : item
        ));
    };

    // Keep this around for backwards compatibility with earlier components
    const updatePrice = (itemId, newPrice) => {
        setMenuData(prev => prev.map(item =>
            item.id === itemId ? { ...item, price: Number(newPrice) } : item
        ));
    };

    return (
        <MenuContext.Provider value={{
            menuData, updatePrice, toggleSoldOut, updateItem, addItem, reorderMenu,
            categories, addCategory, updateCategory, deleteCategory, reorderCategories, toggleCategoryVisibility
        }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);
