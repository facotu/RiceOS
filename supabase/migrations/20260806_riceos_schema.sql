-- Supabase Cloud PostgreSQL Schema Migration for RiceOS ERP
-- Migration File: supabase/migrations/20260806_riceos_schema.sql

-- 1. WEIGHING RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS weighing_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  farmer_id TEXT NOT NULL,
  gross_weight_kg NUMERIC(10,2) NOT NULL,
  tare_weight_kg NUMERIC(10,2) NOT NULL,
  net_weight_kg NUMERIC(10,2) NOT NULL,
  moisture_percent NUMERIC(5,2) NOT NULL,
  impurity_percent NUMERIC(5,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(14,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  synced BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FINANCIAL SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID REFERENCES weighing_receipts(id),
  farmer_id TEXT NOT NULL,
  total_amount NUMERIC(14,2) NOT NULL,
  state TEXT NOT NULL DEFAULT 'APPROVED',
  settled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SILOS & WAREHOUSE INVENTORY
CREATE TABLE IF NOT EXISTS silos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  capacity_kg NUMERIC(12,2) NOT NULL,
  current_stock_kg NUMERIC(12,2) NOT NULL DEFAULT 0,
  avg_moisture_percent NUMERIC(5,2) DEFAULT 14.0,
  status TEXT NOT NULL DEFAULT 'available',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DRYING OPERATIONS
CREATE TABLE IF NOT EXISTS drying_orders (
  id TEXT PRIMARY KEY,
  silo_id TEXT REFERENCES silos(id),
  initial_weight_kg NUMERIC(10,2) NOT NULL,
  initial_moisture NUMERIC(5,2) NOT NULL,
  target_moisture NUMERIC(5,2) NOT NULL DEFAULT 14.0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRACEABILITY BATCHES
CREATE TABLE IF NOT EXISTS rice_trace_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT UNIQUE NOT NULL,
  farmer_id TEXT NOT NULL,
  receipt_id UUID REFERENCES weighing_receipts(id),
  status TEXT NOT NULL DEFAULT 'COLLECTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LOGISTICS VEHICLES & TRIPS
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  plate_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  capacity_tons NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_code TEXT UNIQUE NOT NULL,
  vehicle_id TEXT REFERENCES vehicles(id),
  driver_id TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  payload_weight_kg NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'dispatched',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROOF OF DELIVERY (POD)
CREATE TABLE IF NOT EXISTS proof_of_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  recipient_name TEXT NOT NULL,
  signature_url TEXT,
  photo_url TEXT,
  delivered_weight_kg NUMERIC(10,2) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE weighing_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE silos ENABLE ROW LEVEL SECURITY;
ALTER TABLE drying_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Create default public read policies
CREATE POLICY "Allow public read access" ON weighing_receipts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON settlements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON silos FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON drying_orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON trips FOR SELECT USING (true);
