-- Schema for Neon Postgres
-- Run on a fresh database; existing deployments are migrated incrementally.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  trial_started_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  plan TEXT CHECK (plan IN ('individual', 'business')),
  billing_customer_id TEXT,
  billing_subscription_id TEXT,
  subscribed_at TIMESTAMPTZ,
  default_seller_name TEXT,
  default_seller_vat TEXT,
  default_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  vat_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON clients(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS clients_user_name_idx ON clients(user_id, lower(name));

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
  share_token TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(user_id, status);

CREATE TABLE IF NOT EXISTS invoice_sequences (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
