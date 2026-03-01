-- Fix news table - Drop and recreate with correct columns
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing table if it exists
DROP TABLE IF EXISTS news CASCADE;

-- Step 2: Create fresh news table with all columns
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category VARCHAR(50) DEFAULT 'update',
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (status = 'published' OR status IS NULL);

CREATE POLICY "Admins can do everything on news"
  ON news FOR ALL
  USING (true);

-- Step 5: Insert a test news item
INSERT INTO news (title, content, status, published_at) VALUES
  ('Välkommen till NorthWind Scatters!', 'Detta är din första nyhet. Du kan redigera eller ta bort den.', 'published', NOW());

-- Done! News table is now ready.
