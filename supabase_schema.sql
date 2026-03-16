-- SQL for creating the orders table in Supabase

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    customer_name TEXT,
    items JSONB NOT NULL,
    total_price NUMERIC NOT NULL,
    payment_mode TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'pending',
    razorpay_payment_id TEXT,
    prep_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    is_sold_out BOOLEAN DEFAULT false,
    image TEXT,
    icon TEXT,
    is_popular BOOLEAN DEFAULT false,
    calories INTEGER,
    version TEXT,
    ingredients JSONB,
    nutrition JSONB,
    prep_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. FORCE-RESET REALTIME
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- 2. ENABLE FULL BROADCAST (Ensures all columns are sent in the live update)
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;

-- 3. BYPASS SECURITY FOR TESTING (Rule out RLS issues)
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- 4. CLEANUP OLD POLICIES
DROP POLICY IF EXISTS "Public Access" ON public.categories;
DROP POLICY IF EXISTS "Public Access" ON public.menu_items;

-- 5. RE-ENABLE SECURITY (OPTIONAL - do this after verification works)
-- ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public Access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Public Access" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);



