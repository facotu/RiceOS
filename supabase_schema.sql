-- ============================================================================
-- RICEOS ENTERPRISE ERP - SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- ============================================================================

-- 1. Create User Profiles Table (Linked with Supabase Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'view')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'disabled')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create Farmers (Chủ ruộng) Table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  cccd TEXT NOT NULL,
  cccd_issue_date TEXT,
  cccd_issue_place TEXT,
  cccd_expiry_date TEXT,
  field_name TEXT NOT NULL,
  plot_no TEXT NOT NULL,
  area_sao NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to farmers" ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update to farmers" ON public.farmers FOR ALL USING (auth.role() = 'authenticated');

-- 3. Create Vehicles (Xe nhận) Table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'loading')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to vehicles" ON public.vehicles FOR SELECT USING (true);

-- 4. Create Rice Varieties (Giống lúa) Table
CREATE TABLE IF NOT EXISTS public.rice_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- HT1, HG12, HG244, ĐT100, J02
  name TEXT NOT NULL,
  default_price NUMERIC(10,2) NOT NULL DEFAULT 8000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rice_varieties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to rice varieties" ON public.rice_varieties FOR SELECT USING (true);

-- Seed Default Rice Varieties
INSERT INTO public.rice_varieties (code, name, default_price)
VALUES 
  ('HT1', 'Giống lúa HT1', 8000),
  ('HG12', 'Giống lúa HG12', 7500),
  ('HG244', 'Giống lúa HG244', 7800),
  ('ĐT100', 'Giống lúa ĐT100', 8200),
  ('J02', 'Giống lúa J02', 8500)
ON CONFLICT (code) DO NOTHING;

-- 5. Create Weighing Sessions (Phiên cân) Table
CREATE TABLE IF NOT EXISTS public.weighing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  session_date TIMESTAMPTZ DEFAULT NOW(),
  farmer_id UUID REFERENCES public.farmers(id),
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT,
  field_name TEXT NOT NULL,
  plot_no TEXT NOT NULL,
  officer_id UUID REFERENCES public.profiles(id),
  officer_name TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  vehicle_plate TEXT NOT NULL,
  variety_code TEXT NOT NULL,
  variety_name TEXT NOT NULL,
  total_bags INT NOT NULL DEFAULT 0,
  total_fresh_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  tare_formula TEXT DEFAULT 'percent',
  tare_value NUMERIC(5,2) DEFAULT 5.0,
  total_tare_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_dry_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_per_kg NUMERIC(10,2) NOT NULL DEFAULT 8000,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  advance_payment NUMERIC(14,2) DEFAULT 0,
  remaining_payment NUMERIC(14,2) DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'settled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weighing_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to weighing sessions" ON public.weighing_sessions FOR SELECT USING (true);
CREATE POLICY "Allow insert/update to weighing sessions" ON public.weighing_sessions FOR ALL USING (auth.role() = 'authenticated');

-- 6. Create Weighing Code Rows (Dòng mã cân) Table
CREATE TABLE IF NOT EXISTS public.weighing_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.weighing_sessions(id) ON DELETE CASCADE,
  time_stamp TEXT NOT NULL,
  bag_count INT NOT NULL,
  fresh_kg NUMERIC(10,2) NOT NULL,
  tare_kg NUMERIC(10,2) NOT NULL,
  dry_kg NUMERIC(10,2) NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weighing_rows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to weighing rows" ON public.weighing_rows FOR SELECT USING (true);
