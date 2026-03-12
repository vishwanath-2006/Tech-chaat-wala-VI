import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial dataset
const INITIAL_MENU_DATA = [
    // Fit-Ware 2.0 (Healthy Tech Meals)
    {
        id: 'fw-1', category: 'Fit-Ware 2.0', name: 'Sprout Circuit Salad', calories: 120, version: '2.1', price: 149, prepTime: 3, icon: '🥗', image: '/images/fw1_salad.png', isPopular: true, isSoldOut: false,
        description: "A healthy protein-rich salad packed with sprouts, fresh vegetables, and herbs. Highly optimized for quick energy loading.",
        ingredients: ["Mixed Sprouts", "Cherry Tomatoes", "Cucumber", "Lemon-Herb Dressing", "Microgreens"],
        nutrition: { protein: "12g", carbs: "18g", fat: "4g" }
    },
    {
        id: 'fw-2', category: 'Fit-Ware 2.0', name: 'Protein Packet Paneer', calories: 340, version: '3.0', price: 189, prepTime: 4, icon: '🧀', image: '/images/fw_paneer.png', isPopular: true, isSoldOut: false,
        description: "Premium grilled paneer blocks marinated in our custom spice compiler. Maximize your hardware gains.",
        ingredients: ["Cottage Cheese (Paneer)", "Bell Peppers", "Onions", "Mint Yogurt Drop", "Secret Spice Mix"],
        nutrition: { protein: "24g", carbs: "8g", fat: "22g" }
    },
    {
        id: 'fw-3', category: 'Fit-Ware 2.0', name: 'Quantum Quinoa Bowl', calories: 250, version: '1.4', price: 229, prepTime: 5, icon: '🍲', image: '/images/fw2_bowl.png', isPopular: false, isSoldOut: false,
        description: "A balanced dataset of quinoa, roasted veggies, and a tangy dressing. Perfectly multithreaded for a complete meal.",
        ingredients: ["Organic Quinoa", "Roasted Zucchini", "Cherry Tomatoes", "Feta Crumble", "Balsamic Glaze"],
        nutrition: { protein: "9g", carbs: "42g", fat: "6g" }
    },
    {
        id: 'fw-4', category: 'Fit-Ware 2.0', name: 'Kernel Kale Salad', calories: 180, version: '2.2', price: 169, prepTime: 3, icon: '🥬', image: '/images/fw_kale.png', isPopular: false, isSoldOut: false,
        description: "Deep learning based raw kale tossed with nuts, seeds, and a sharp vinaigrette. Low latency digestion.",
        ingredients: ["Fresh Kale", "Toasted Almonds", "Sunflower Seeds", "Parmesan Shavings", "Lemon Vinaigrette"],
        nutrition: { protein: "7g", carbs: "12g", fat: "14g" }
    },
    {
        id: 'fw-5', category: 'Fit-Ware 2.0', name: 'Async Avocado Wrap', calories: 410, version: '1.1', price: 249, prepTime: 4, icon: '🌯', image: '/images/fw_wrap.png', isPopular: true, isSoldOut: false,
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

    // Chaatis.js (Street Food Classics)
    {
        id: 'cj-1', category: 'Chaatis.js', name: 'Circuit-Breaker Pani Puri', calories: 180, version: '4.0', price: 89, prepTime: 2, icon: '🥟', image: '/images/cj1_panipuri.png', isPopular: true, isSoldOut: false,
        description: "A burst of spicy, tangy flavor guaranteed to overload your taste sensors safely.",
        ingredients: ["Crispy Puris", "Spicy Mint Water", "Tamarind Chutney", "Mashed Potato & Chickpeas"],
        nutrition: { protein: "4g", carbs: "32g", fat: "6g" }
    },
    {
        id: 'cj-2', category: 'Chaatis.js', name: 'Samosa CPU Chaat', calories: 420, version: '5.1', price: 129, prepTime: 4, icon: '🥠', image: '/images/cj_samosa.png', isPopular: true, isSoldOut: false,
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
        id: 'cj-5', category: 'Chaatis.js', name: 'Async Aloo Tikki', calories: 320, version: '3.2', price: 119, prepTime: 4, icon: '🥔', image: '/images/cj2_tikki.png', isPopular: true, isSoldOut: false,
        description: "Crispy potato patties executed concurrently with spicy and sweet chutneys.",
        ingredients: ["Mashed Potato Patties", "Chaat Masala", "Mint & Coriander Dip", "Tamarind Drizzle", "Sev"],
        nutrition: { protein: "5g", carbs: "48g", fat: "12g" }
    },
    {
        id: 'cj-6', category: 'Chaatis.js', name: 'DDoS Dahi Bhalla', calories: 290, version: '2.4', price: 139, prepTime: 3, icon: '🥣', image: '/images/cj_bhalla.png', isPopular: true, isSoldOut: false,
        description: "A massive influx of soft lentil dumplings flooded in sweetened, chilled yogurt.",
        ingredients: ["Urad Dal Dumplings", "Chilled Sweet Yogurt", "Cumin Powder", "Red Chili Drizzle", "Imli Chutney"],
        nutrition: { protein: "12g", carbs: "45g", fat: "6g" }
    },

    // Liquid Brews (Drinks)
    {
        id: 'lb-1', category: 'Liquid Brews', name: 'Cyber Shikanji', calories: 85, version: '1.0', price: 69, prepTime: 1, icon: '🍋', image: '/images/lb1_shikanji.png', isPopular: false, isSoldOut: false,
        description: "An electrified version of the classic Indian lemonade. Refreshing, bright, and resets your session.",
        ingredients: ["Fresh Lemon Juice", "Roasted Cumin Server", "Black Salt", "Mint Leaves", "Chilled Water"],
        nutrition: { protein: "0g", carbs: "22g", fat: "0g" }
    },
    {
        id: 'lb-2', category: 'Liquid Brews', name: 'Nitro Processed Coffee', calories: 120, version: '4.2', price: 149, prepTime: 2, icon: '☕', image: '/images/lb_coffee.png', isPopular: true, isSoldOut: false,
        description: "Cold-brewed, nitrogen-infused coffee that downloads energy directly to your mainline.",
        ingredients: ["Premium Arabica Cold Brew", "Nitrogen Gas", "Vanilla Syrup (Optional)", "Ice"],
        nutrition: { protein: "1g", carbs: "12g", fat: "0g" }
    },
    {
        id: 'lb-3', category: 'Liquid Brews', name: 'Bandwidth Berry Soda', calories: 160, version: '2.5', price: 119, prepTime: 1, icon: '🫐', image: null, isPopular: false, isSoldOut: false,
        description: "High-throughput mixed berry soda. Effervescent and violently purple.",
        ingredients: ["Mixed Berry Compote", "Sparkling Water", "Mint Sprig", "Lime Wedge"],
        nutrition: { protein: "0g", carbs: "38g", fat: "0g" }
    },
    {
        id: 'lb-4', category: 'Liquid Brews', name: 'Latency-Free Lemonade', calories: 95, version: '1.2', price: 79, prepTime: 1, icon: '🧃', image: null, isPopular: false, isSoldOut: false,
        description: "Zero ping, instant thirst quenching. Classic, no-nonsense lemonade.",
        ingredients: ["Lemon", "Simple Syrup", "Ice", "Filtered Water"],
        nutrition: { protein: "0g", carbs: "24g", fat: "0g" }
    },
    {
        id: 'lb-5', category: 'Liquid Brews', name: 'Cloud Matcha Latte', calories: 180, version: '3.1', price: 169, prepTime: 3, icon: '🍵', image: null, isPopular: true, isSoldOut: false,
        description: "Earthy, robust matcha floated on an airy cloud of perfectly foamed milk.",
        ingredients: ["Ceremonial Grade Matcha", "Steamed Oat Milk", "Agave Nectar"],
        nutrition: { protein: "4g", carbs: "26g", fat: "6g" }
    },
    {
        id: 'lb-6', category: 'Liquid Brews', name: 'Latino Lassi.exe', calories: 210, version: '2.0', price: 99, prepTime: 2, icon: '🥛', image: '/images/lb2_lassi.png', isPopular: true, isSoldOut: false,
        description: "A thick, yogurt-based standalone executable. Sweet, rich, and traditionally fulfilling.",
        ingredients: ["Fresh Yogurt", "Sugar", "Cardamom Powder", "Rose Water", "Pistachio Garnish"],
        nutrition: { protein: "8g", carbs: "28g", fat: "7g" }
    }
];

export const INITIAL_CATEGORIES = [
    { id: 'cat-0', name: 'All', isVisible: true, order: 0 },
    { id: 'cat-1', name: 'Fit-Ware 2.0', isVisible: true, order: 1 },
    { id: 'cat-2', name: 'Chaatis.js', isVisible: true, order: 2 },
    { id: 'cat-3', name: 'Liquid Brews', isVisible: true, order: 3 }
];

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    // Basic state hosting the full menu list. Defaults to the initial mock data above.
    const [menuData, setMenuData] = useState(() => {
        try {
            const saved = localStorage.getItem('tcw_menu');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) { console.error(e); }
        return INITIAL_MENU_DATA;
    });

    const [categories, setCategories] = useState(() => {
        try {
            const saved = localStorage.getItem('tcw_categories');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
