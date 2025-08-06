/*
# Create Lead Magnet AI Database Schema

This migration sets up the complete database schema for the Lead Magnet AI application.

## 1. New Tables
- `users` - User profiles and subscription information
- `lead_magnets` - Generated lead magnets with content and metadata

## 2. Security
- Enable RLS on all tables
- Add policies for authenticated users to access their own data
- Users can only see their own lead magnets

## 3. Features
- Automatic user profile creation via trigger
- Proper foreign key relationships
- Comprehensive lead magnet tracking
*/

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE lead_magnet_type AS ENUM ('ebook', 'checklist', 'template', 'guide', 'worksheet');
CREATE TYPE lead_magnet_status AS ENUM ('draft', 'generating', 'completed', 'failed');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id text
);

-- Create lead_magnets table
CREATE TABLE IF NOT EXISTS lead_magnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  topic text NOT NULL,
  type lead_magnet_type NOT NULL,
  status lead_magnet_status DEFAULT 'draft',
  content jsonb,
  pdf_url text,
  landing_page_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for lead_magnets table
CREATE POLICY "Users can read own lead magnets"
  ON lead_magnets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lead magnets"
  ON lead_magnets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lead magnets"
  ON lead_magnets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead magnets"
  ON lead_magnets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead_magnets updated_at
DROP TRIGGER IF EXISTS update_lead_magnets_updated_at ON lead_magnets;
CREATE TRIGGER update_lead_magnets_updated_at
  BEFORE UPDATE ON lead_magnets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lead_magnets_user_id ON lead_magnets(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_created_at ON lead_magnets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_status ON lead_magnets(status);
