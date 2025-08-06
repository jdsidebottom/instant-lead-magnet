/*
  # Lead Magnet Maker Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users.id
      - `email` (text, unique, not null)
      - `name` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `subscription_tier` (enum: free, pro, enterprise, default 'free')
      - `stripe_customer_id` (text, nullable)
    
    - `lead_magnets`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users.id)
      - `title` (text, not null)
      - `topic` (text, not null)
      - `type` (enum: ebook, checklist, template, guide, worksheet)
      - `status` (enum: draft, generating, completed, failed, default 'draft')
      - `content` (jsonb, nullable) - stores generated content
      - `pdf_url` (text, nullable) - URL to generated PDF
      - `landing_page_url` (text, nullable) - URL to landing page
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - Automatic user profile creation on signup
    - Updated_at trigger for lead_magnets table

  3. Indexes
    - Index on user_id for lead_magnets table
    - Index on email for users table
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
  created_at timestamptz DEFAULT now() NOT NULL,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  stripe_customer_id text
);

-- Create lead_magnets table
CREATE TABLE IF NOT EXISTS lead_magnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  topic text NOT NULL,
  type lead_magnet_type NOT NULL,
  status lead_magnet_status DEFAULT 'draft' NOT NULL,
  content jsonb,
  pdf_url text,
  landing_page_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_user_id ON lead_magnets(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_status ON lead_magnets(status);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_created_at ON lead_magnets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for lead_magnets table
CREATE POLICY "Users can view own lead magnets"
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
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lead magnets"
  ON lead_magnets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at on lead_magnets
DROP TRIGGER IF EXISTS update_lead_magnets_updated_at ON lead_magnets;
CREATE TRIGGER update_lead_magnets_updated_at
  BEFORE UPDATE ON lead_magnets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();