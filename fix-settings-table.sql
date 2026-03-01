-- Fix settings table to use TEXT instead of JSONB
-- Run this in Supabase SQL Editor if settings aren't saving

-- Step 1: Create a temporary table with TEXT values
CREATE TABLE settings_temp (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Copy existing data, converting JSONB to TEXT
INSERT INTO settings_temp (key, value, description, updated_at)
SELECT
  key,
  CASE
    WHEN jsonb_typeof(value) = 'string' THEN value::text
    ELSE value::text
  END,
  description,
  updated_at
FROM settings;

-- Step 3: Drop the old table
DROP TABLE settings;

-- Step 4: Rename temp table to settings
ALTER TABLE settings_temp RENAME TO settings;

-- Step 5: Re-enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Step 6: Re-create policies
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can do everything on settings"
  ON settings FOR ALL
  USING (true);

-- Step 7: Re-insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('kennel_name', 'NorthWind Scatters', 'Uppfödningsnamn'),
  ('contact_email', 'info@northwindscatters.se', 'Kontakt e-post'),
  ('contact_phone', '+46 70 123 45 67', 'Kontakt telefon'),
  ('contact_address', 'Trelleborg, Sverige', 'Plats'),
  ('kennel_description', 'Norsk Skogskatt uppfödning med kärlek och omsorg.', 'Kort beskrivning'),
  ('hero_title', 'NorthWind Scatters', 'Hero titel'),
  ('hero_subtitle', 'Norsk Skogskatt uppfödning med kärlek och omsorg i Sverige.', 'Hero undertext'),
  ('hero_image_url', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&q=80', 'Hero bild URL'),
  ('facebook_url', '', 'Facebook URL'),
  ('instagram_url', '', 'Instagram URL')
ON CONFLICT (key) DO NOTHING;

-- Done! Settings should now save properly as TEXT values.
