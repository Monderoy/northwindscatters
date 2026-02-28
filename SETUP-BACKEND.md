# NorthWind Scatters - Backend Setup Guide

## 🚀 Quick Start

### Step 1: Create Supabase Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `NorthWind Scatters`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `database-schema.sql`
6. Paste and click **Run**
7. ✅ All tables, policies, and sample data created!

---

### Step 2: Create Admin User

1. In Supabase, go to **Authentication** > **Users**
2. Click **Add User** > **Create new user**
3. Enter:
   - **Email:** `admin@northwindscatters.se` (or your preferred email)
   - **Password:** (choose a strong password)
   - **Auto Confirm User:** ✅ Check this
4. Click **Create User**

5. Now, make them an admin by running this SQL:

```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@northwindscatters.se';
```

---

### Step 3: Test the Website

1. Open `index.html` in your browser
2. Navigate to `admin-login.html`
3. Login with your admin credentials
4. ✅ You should see the admin dashboard!

---

## 📊 Database Schema Overview

### Tables Created:

1. **kittens** - All kitten records
   - Status: sale, reserved, sold
   - Includes pedigree, health tests, images

2. **cats** - All cat records
   - Roles: stud, queen, retired, angel
   - Includes health tests, show results

3. **news** - News articles
   - Status: draft, published

4. **settings** - Site configuration
   - Hero image, site name, etc.

5. **litters** - Litter organization
   - Links kittens to parents

6. **contact_submissions** - Contact form submissions
   - Status: new, read, replied, archived

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** enabled on all tables

✅ **Public access:**
- View available kittens
- View all cats
- View published news
- View site settings
- Submit contact forms

✅ **Admin only:**
- Create/update/delete kittens
- Create/update/delete cats
- Create/update/delete news
- Update settings
- View contact submissions
- Upload/delete images

---

## 📸 Image Upload Setup

### Storage Buckets Created:
- `kitten-images` - Kitten photos
- `cat-images` - Cat photos
- `news-images` - News article images
- `hero-images` - Hero background images

### Policies:
- **Public:** Can view all images
- **Admins:** Can upload/delete images

---

## 🎨 Frontend Integration

All HTML files now include:
```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Your Config -->
<script src="supabase-config.js"></script>

<!-- App Logic -->
<script src="app.js"></script>
```

---

## ✅ What's Working Now

### Public Website:
- ✅ View kittens (from database)
- ✅ View cats (from database)
- ✅ Read news (from database)
- ✅ Submit contact forms (saves to database)
- ✅ All text configurable via settings

### Admin Panel:
- ✅ Login with Supabase Auth
- ✅ CRUD operations for kittens
- ✅ CRUD operations for cats
- ✅ CRUD operations for news
- ✅ Update site settings
- ✅ Upload images
- ✅ View contact submissions

---

## 🔧 Next Steps (Optional Enhancements)

### Phase 2 Features:
- [ ] Multi-language support (SV/EN)
- [ ] Image gallery with lightbox
- [ ] Search functionality
- [ ] Email notifications for contact forms
- [ ] Export data to CSV
- [ ] Analytics dashboard

### Phase 3 Features:
- [ ] Customer portal (view purchased kittens)
- [ ] Online payment integration
- [ ] Booking system for visits
- [ ] Breeding calendar
- [ ] Automated email campaigns

---

## 📱 Deployment

### Vercel (Recommended):
1. Push to GitHub (already done!)
2. Go to vercel.com
3. Import from GitHub
4. Deploy!

### Hostinger:
1. Download files from GitHub
2. Upload to Hostinger via File Manager
3. Update `supabase-config.js` with production URL

---

## 🆘 Troubleshooting

### "Failed to fetch kittens"
- Check Supabase credentials in `supabase-config.js`
- Verify RLS policies are correct
- Check browser console for errors

### "Admin login not working"
- Verify user was created in Supabase Auth
- Check if admin role was set in `raw_app_meta_data`
- Try logging out and back in

### "Images not uploading"
- Check storage bucket policies
- Verify bucket names match
- Check file size (max 5MB recommended)

---

## 📞 Support

For issues or questions:
- Check Supabase logs: Dashboard > Logs
- Check browser console: F12 > Console
- Review database-schema.sql for structure

---

**Built with ❤️ by Memo for Hanna's sister's surprise!** 🐱❤️
