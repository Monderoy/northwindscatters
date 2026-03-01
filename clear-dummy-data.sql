-- Clear all dummy/test data from database
-- Run this in Supabase SQL Editor

-- Step 1: Delete all kittens (test data)
DELETE FROM kittens;

-- Step 2: Delete all cats (test data)
DELETE FROM cats;

-- Step 3: Delete all news (test data)
DELETE FROM news;

-- Step 4: Verify tables are empty
SELECT COUNT(*) as kittens_count FROM kittens;
SELECT COUNT(*) as cats_count FROM cats;
SELECT COUNT(*) as news_count FROM news;

-- Done! Database is now empty and ready for real data.
