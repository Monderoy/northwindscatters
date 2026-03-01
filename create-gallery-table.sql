-- Create gallery table for admin panel
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now
CREATE POLICY "Allow all operations on gallery" ON gallery
  FOR ALL USING (true) WITH CHECK (true);

-- Verify table was created
SELECT * FROM gallery LIMIT 1;
