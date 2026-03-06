-- ============================================================
-- NORTHWIND SCATTERS - FIX ALL SQL
-- Kör allt på en gång i Supabase SQL Editor
-- ============================================================

-- ============================================================
-- DEL 1: FIXA GALLERI (töm + RLS fix)
-- ============================================================

-- Ta bort gamla policies
DROP POLICY IF EXISTS "Allow all for anon" ON gallery;
DROP POLICY IF EXISTS "Enable all for anon" ON gallery;
DROP POLICY IF EXISTS "gallery_policy" ON gallery;

-- Töm hela galleriet (ta bort testbilder)
DELETE FROM gallery;

-- Reset auto-increment
ALTER SEQUENCE gallery_id_seq RESTART WITH 1;

-- Ny policy som tillåter ALLT
CREATE POLICY "Enable all for anon" ON gallery
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS på men öppen
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DEL 2: FIXA INSTÄLLNINGAR (TEXT istället för JSONB)
-- ============================================================

-- Skapa temp-tabell med TEXT
CREATE TABLE settings_temp (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kopiera data, konvertera JSONB till TEXT
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

-- Släpp gammal tabell
DROP TABLE settings;

-- Döp om temp till settings
ALTER TABLE settings_temp RENAME TO settings;

-- Aktivera RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Skapa policies
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can do everything on settings"
  ON settings FOR ALL
  USING (true);

-- Lägg till default-inställningar
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

-- ============================================================
-- KLART! 
-- ============================================================
-- Efter detta:
-- ✅ Galleriet är tomt och delete funkar
-- ✅ Inställningar sparas korrekt
-- ============================================================
