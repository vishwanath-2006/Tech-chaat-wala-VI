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

-- Enable Realtime for the orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Set up Row Level Security (RLS)
-- For a kiosk app, you might want careful policies. 
-- Below is a basic permissive policy for development:
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for kiosk" ON public.orders
    FOR ALL
    USING (true)
    WITH CHECK (true);
