-- NorthWind Scatters Database Schema
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ============================================
-- KITTENS TABLE
-- ============================================
CREATE TABLE kittens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female')),
  color VARCHAR(100),
  born_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'sale' CHECK (status IN ('sale', 'reserved', 'sold')),
  price INTEGER,
  description TEXT,
  pedigree_number VARCHAR(100),
  health_tests TEXT[],
  show_results TEXT[],
  litter_id UUID,
  mother_id UUID REFERENCES cats(id),
  father_id UUID REFERENCES cats(id),
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kittens ENABLE ROW LEVEL SECURITY;

-- Public can view available kittens
CREATE POLICY "Public can view available kittens"
  ON kittens FOR SELECT
  USING (status IN ('sale', 'reserved'));

-- Admins can do everything
CREATE POLICY "Admins can do everything on kittens"
  ON kittens FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- CATS TABLE
-- ============================================
CREATE TABLE cats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female')),
  color VARCHAR(100),
  born_date DATE,
  role VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (role IN ('stud', 'queen', 'retired', 'angel')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'retired', 'angel')),
  description TEXT,
  personality TEXT,
  pedigree_number VARCHAR(100),
  ems_code VARCHAR(50),
  health_tests JSONB,
  show_results TEXT[],
  litter_count INTEGER DEFAULT 0,
  total_kittens INTEGER DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;

-- Public can view all cats
CREATE POLICY "Public can view all cats"
  ON cats FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins can do everything on cats"
  ON cats FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) DEFAULT 'update',
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public can view published news
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (status = 'published');

-- Admins can do everything
CREATE POLICY "Admins can do everything on news"
  ON news FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public can view settings
CREATE POLICY "Public can view settings"
  ON settings FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins can do everything on settings"
  ON settings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('site_name', '"NorthWind Scatters"', 'Website name'),
  ('site_email', '"info@northwindscatters.se"', 'Contact email'),
  ('site_phone', '"+46 70 123 45 67"', 'Contact phone'),
  ('site_location', '"Stockholm, Sverige"', 'Location'),
  ('site_description', '"Norsk Skogskatt uppfödning med kärlek och omsorg. Vi är en liten hemuppfödning belägen i Sverige som fokuserar på hälsa, temperament och rasstandard."', 'Site description'),
  ('hero_image', '"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&q=80"', 'Hero background image'),
  ('hero_title', '"NorthWind Scatters"', 'Hero title'),
  ('hero_subtitle', '"Norsk Skogskatt uppfödning med kärlek och omsorg i Sverige. Våra katter är vår familj."', 'Hero subtitle'),
  ('hero_cta_text', '"Se kattungar"', 'Hero CTA button text'),
  ('hero_cta_link', '"kittens.html"', 'Hero CTA button link'),
  ('show_prices', 'true', 'Show prices on kittens'),
  ('show_angel_cats', 'true', 'Show deceased cats'),
  ('show_sold_kittens', 'true', 'Show sold kittens'),
  ('enable_en_lang', 'true', 'Enable English language'),
  ('default_lang', '"sv"', 'Default language'),
  ('kittens_per_page', '6', 'Kittens per page');

-- ============================================
-- LITTERS TABLE (for organization)
-- ============================================
CREATE TABLE litters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100),
  born_date DATE NOT NULL,
  mother_id UUID REFERENCES cats(id),
  father_id UUID REFERENCES cats(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE litters ENABLE ROW LEVEL SECURITY;

-- Public can view litters
CREATE POLICY "Public can view litters"
  ON litters FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins can do everything on litters"
  ON litters FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view contact submissions
CREATE POLICY "Only admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Anyone can insert contact submissions
CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_kittens_updated_at BEFORE UPDATE ON kittens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cats_updated_at BEFORE UPDATE ON cats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample cats
INSERT INTO cats (name, gender, color, role, born_date, pedigree_number, ems_code, personality, health_tests, show_results) VALUES
('Birk', 'male', 'Brun tabby med vit', 'stud', '2022-03-15', 'SVERAK NFO n 09 23', 'NFO n 09 23', 'Birk är en kärleksfull och lekfull hane som älskar att gosa.', '{"HCM": "negative", "PKD": "negative", "HD": "A"}', ARRAY['SVERAK International Show 2023 - EX1, BIV']),
('Saga', 'female', 'Svart silver tabby', 'queen', '2021-03-15', 'SVERAK NFO ns 11', 'NFO ns 11', 'Saga är vår underbara ledarinna med ett hjärta av guld!', '{"HCM": "negative", "PKD": "negative", "HD": "A"}', ARRAY['SVERAK International Show 2022 - EX1, CAP', 'Stockholm Cat Show 2023 - EX1, BIV']);

-- Sample kittens
INSERT INTO kittens (name, gender, color, status, born_date, price, description, litter_id) VALUES
('Luna', 'female', 'Brun tabby', 'sale', '2024-10-15', 12000, 'Luna är en underbar liten honkatt med ett härligt temperament!'),
('Thor', 'male', 'Svart tabby', 'reserved', '2024-10-15', 12000, 'Thor är en stark och lekful kille som älskar äventyr.'),
('Freja', 'female', 'Vit och svart', 'sale', '2024-10-15', 12000, 'Freja är en underbar liten kattunge med massor av energi!');

-- Sample news
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Ny kull född!', 'Vi är stolta att meddela att Saga har fått en ny kull med 4 underbara kattunger! 2 honkatter och 2 hannar, alla friska och starka.', 'Saga har fått en ny kull med 4 kattunger!', 'litter', 'published', NOW()),
('Framgångar på Stockholm Cat Show', 'Birk tog hem EX1 och BIV (Best in Variety) på Stockholm Cat Show! Vi är otroligt stolta över vår underbara avelshane.', 'Birk vann på Stockholm Cat Show!', 'show', 'published', NOW() - INTERVAL '12 days');

-- ============================================
-- ADMIN USER (Create manually in Supabase)
-- ============================================

-- To create an admin user:
-- 1. Go to Authentication > Users in Supabase
-- 2. Click "Add User" > "Create new user"
-- 3. Email: admin@northwindscatters.se
-- 4. Password: (choose a strong password)
-- 5. After creating, run this SQL to make them admin:

-- UPDATE auth.users
-- SET raw_app_meta_data = jsonb_set(
--   COALESCE(raw_app_meta_data, '{}'::jsonb),
--   '{role}',
--   '"admin"'
-- )
-- WHERE email = 'admin@northwindscatters.se';

-- ============================================
-- STORAGE BUCKETS (for images)
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('kitten-images', 'kitten-images', true),
  ('cat-images', 'cat-images', true),
  ('news-images', 'news-images', true),
  ('hero-images', 'hero-images', true);

-- Storage policies
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('kitten-images', 'cat-images', 'news-images', 'hero-images'));

CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('kitten-images', 'cat-images', 'news-images', 'hero-images')
    AND auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('kitten-images', 'cat-images', 'news-images', 'hero-images')
    AND auth.jwt() ->> 'role' = 'admin'
  );
