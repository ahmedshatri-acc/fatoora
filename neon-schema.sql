-- Run this after Neon DB is provisioned

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  plan TEXT CHECK (plan IN ('individual', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date TIMESTAMPTZ NOT NULL,
  seller_name TEXT NOT NULL,
  seller_vat TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_with_vat NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_rate NUMERIC(5,4) NOT NULL DEFAULT 0.15,
  qr_data TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(user_id, status);

-- Per-user invoice sequence table for collision-free invoice numbers
CREATE TABLE IF NOT EXISTS invoice_sequences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);
