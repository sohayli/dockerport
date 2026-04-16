-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  display_name TEXT,
  base_currency TEXT DEFAULT 'USD',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  monthly_goal NUMERIC,
  birth_date TEXT,
  bes_entry_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT,
  quantity NUMERIC NOT NULL DEFAULT 0,
  purchase_price NUMERIC NOT NULL DEFAULT 0,
  purchase_currency TEXT DEFAULT 'USD',
  type TEXT,
  tefas_type TEXT,
  dividend_yield NUMERIC,
  dividend_growth_5y NUMERIC,
  dividend_growth_10y NUMERIC,
  current_price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fund prices table (from TEFAS crawler)
CREATE TABLE IF NOT EXISTS fund_prices (
  symbol TEXT PRIMARY KEY,
  price NUMERIC,
  name TEXT,
  fund_type TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  date TEXT,
  source TEXT DEFAULT 'tefas'
);
