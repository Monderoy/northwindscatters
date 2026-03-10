-- ============================================================
-- FIX SCHEMA - Synka med admin.js
-- Kör detta i Supabase SQL Editor
-- ============================================================

-- ============================================================
-- KITTENS - Lägg till image_url, fixa constraints
-- ============================================================

-- Lägg till image_url kolumn
ALTER TABLE kittens ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Ta bort NOT NULL från born_date om det finns (ska vara frivilligt)
ALTER TABLE kittens ALTER COLUMN born_date DROP NOT NULL;

-- ============================================================
-- CATS - Lägg till image_url och health test fält
-- ============================================================

-- Lägg till image_url kolumn
ALTER TABLE cats ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Lägg till birth_date kolumn (admin.js använder detta, inte born_date)
ALTER TABLE cats ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Lägg till pedigree_name (admin.js använder detta, inte pedigree_number)
ALTER TABLE cats ADD COLUMN IF NOT EXISTS pedigree_name VARCHAR(200);

-- Lägg till individuella health test fält (admin.js använder dessa)
ALTER TABLE cats ADD COLUMN IF NOT EXISTS fiv_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS felv_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS hcm_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS pkd_test VARCHAR(20);

-- ============================================================
-- NEWS - Lägg till image_url
-- ============================================================

-- Lägg till image_url kolumn
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================================
-- KLART!
-- ============================================================
-- Efter detta ska admin panelen funka för:
-- ✅ Kittens - kan sparas med bild
-- ✅ Cats - kan sparas med health tests och bild
-- ✅ News - kan sparas med bild
-- ============================================================
