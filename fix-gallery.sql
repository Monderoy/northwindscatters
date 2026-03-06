-- === FIX GALLERY & CLEANUP ===
-- Kör detta i Supabase SQL Editor

-- 1. Ta bort alla gamla policies först
DROP POLICY IF EXISTS "Allow all for anon" ON gallery;
DROP POLICY IF EXISTS "Enable all for anon" ON gallery;
DROP POLICY IF EXISTS "gallery_policy" ON gallery;

-- 2. Töm hela galleriet (ta bort alla testbilder)
DELETE FROM gallery;

-- 3. Reset auto-increment på ID (valfritt)
ALTER SEQUENCE gallery_id_seq RESTART WITH 1;

-- 4. Skapa ny policy som tillåter ALLT för anon
CREATE POLICY "Enable all for anon" ON gallery
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Se till att RLS är PÅ men tillåter allt
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 6. Verifiera att galleriet är tomt
SELECT * FROM gallery;
