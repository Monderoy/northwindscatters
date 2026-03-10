-- ============================================================
-- SCHEMA CONSISTENCY FIX
-- Standardize on `born_date` across all tables
-- ============================================================

-- Step 1: Ensure both tables have correct columns
-- ============================================================

-- KITTENS: Should use born_date (already correct in schema)
-- Just verify column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'kittens' AND column_name = 'born_date'
  ) THEN
    ALTER TABLE kittens ADD COLUMN born_date DATE;
    RAISE NOTICE 'Added born_date to kittens';
  END IF;
END $$;

-- CATS: Should use born_date (consistent with kittens)
-- Migrate data from birth_date if it exists
DO $$
BEGIN
  -- If birth_date exists but born_date doesn't, migrate
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cats' AND column_name = 'birth_date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cats' AND column_name = 'born_date'
  ) THEN
    ALTER TABLE cats RENAME COLUMN birth_date TO born_date;
    RAISE NOTICE 'Renamed cats.birth_date to born_date';
  END IF;

  -- If born_date doesn't exist at all, add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cats' AND column_name = 'born_date'
  ) THEN
    ALTER TABLE cats ADD COLUMN born_date DATE;
    RAISE NOTICE 'Added born_date to cats';
  END IF;
END $$;

-- ============================================================
-- Step 2: Add missing columns that admin.js needs
-- ============================================================

-- Kittens: image_url
ALTER TABLE kittens ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Cats: image_url and health test fields
ALTER TABLE cats ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE cats ADD COLUMN IF NOT EXISTS pedigree_name VARCHAR(200);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS fiv_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS felv_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS hcm_test VARCHAR(20);
ALTER TABLE cats ADD COLUMN IF NOT EXISTS pkd_test VARCHAR(20);

-- News: image_url
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================================
-- Step 3: Clean up duplicate columns (if any)
-- ============================================================

-- Remove birth_date from cats if it still exists after migration
ALTER TABLE cats DROP COLUMN IF EXISTS birth_date;

-- Remove birth_date from kittens if it was added by mistake
ALTER TABLE kittens DROP COLUMN IF EXISTS birth_date;

-- ============================================================
-- VERIFICATION: Check final schema
-- ============================================================

-- Run this separately to verify:
-- SELECT table_name, column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('kittens', 'cats', 'news')
-- ORDER BY table_name, ordinal_position;

-- ============================================================
-- KLART! Nu ska alla tabeller vara konsistenta:
-- ✅ kittens.born_date (inte birth_date)
-- ✅ cats.born_date (inte birth_date)
-- ✅ Alla image_url kolumner finns
-- ✅ Alla health test fält finns
-- ============================================================
