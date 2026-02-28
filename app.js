// NorthWind Scatters - Main Application JavaScript
// Supabase integration for cat breeder website

// Use the global supabase client from supabase-config.js
const supabase = window.supabaseClient || window.supabase;

// ============================================
// AUTHENTICATION
// ============================================

async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'admin-dashboard.html';
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    localStorage.removeItem('user');
    window.location.href = 'admin-login.html';
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

function checkAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// ============================================
// KITTENS CRUD
// ============================================

async function getKittens(filters = {}) {
  try {
    let query = supabase.from('kittens').select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching kittens:', error);
    return { success: false, error: error.message };
  }
}

async function getKitten(id) {
  try {
    const { data, error } = await supabase
      .from('kittens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching kitten:', error);
    return { success: false, error: error.message };
  }
}

async function createKitten(kittenData) {
  try {
    const { data, error } = await supabase
      .from('kittens')
      .insert([kittenData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating kitten:', error);
    return { success: false, error: error.message };
  }
}

async function updateKitten(id, kittenData) {
  try {
    const { data, error } = await supabase
      .from('kittens')
      .update(kittenData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating kitten:', error);
    return { success: false, error: error.message };
  }
}

async function deleteKitten(id) {
  try {
    const { error } = await supabase
      .from('kittens')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting kitten:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CATS CRUD
// ============================================

async function getCats(filters = {}) {
  try {
    let query = supabase.from('cats').select('*');

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching cats:', error);
    return { success: false, error: error.message };
  }
}

async function getCat(id) {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching cat:', error);
    return { success: false, error: error.message };
  }
}

async function createCat(catData) {
  try {
    const { data, error } = await supabase
      .from('cats')
      .insert([catData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating cat:', error);
    return { success: false, error: error.message };
  }
}

async function updateCat(id, catData) {
  try {
    const { data, error } = await supabase
      .from('cats')
      .update(catData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating cat:', error);
    return { success: false, error: error.message };
  }
}

async function deleteCat(id) {
  try {
    const { error } = await supabase
      .from('cats')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting cat:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// NEWS CRUD
// ============================================

async function getNews(filters = {}) {
  try {
    let query = supabase.from('news').select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { success: false, error: error.message };
  }
}

async function getNewsArticle(id) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching news article:', error);
    return { success: false, error: error.message };
  }
}

async function createNewsArticle(articleData) {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating news article:', error);
    return { success: false, error: error.message };
  }
}

async function updateNewsArticle(id, articleData) {
  try {
    const { data, error } = await supabase
      .from('news')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating news article:', error);
    return { success: false, error: error.message };
  }
}

async function deleteNewsArticle(id) {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting news article:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// SETTINGS
// ============================================

async function getSetting(key) {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) throw error;
    return { success: true, value: data.value };
  } catch (error) {
    console.error('Error fetching setting:', error);
    return { success: false, error: error.message };
  }
}

async function updateSetting(key, value) {
  try {
    const { error } = await supabase
      .from('settings')
      .update({ value: JSON.stringify(value) })
      .eq('key', key);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating setting:', error);
    return { success: false, error: error.message };
  }
}

async function getAllSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    // Convert array to object
    const settings = {};
    data.forEach(item => {
      settings[item.key] = JSON.parse(item.value);
    });

    return { success: true, data: settings };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// IMAGE UPLOAD
// ============================================

async function uploadImage(bucket, file, filename) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }
}

async function deleteImage(bucket, filename) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CONTACT FORM
// ============================================

async function submitContactForm(formData) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: error.message };
  }
}

async function getContactSubmissions() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('sv-SE', options);
}

function formatPrice(price) {
  return new Intl.NumberFormat('sv-SE').format(price) + ' kr';
}

function getStatusBadge(status) {
  const badges = {
    'sale': '<span class="badge badge-sale">Till salu</span>',
    'reserved': '<span class="badge badge-reserved">Tingad</span>',
    'sold': '<span class="badge badge-sold">Såld</span>'
  };
  return badges[status] || '';
}

function getRoleBadge(role) {
  const badges = {
    'stud': '<span class="badge badge-male">Avelshane</span>',
    'queen': '<span class="badge badge-female">Aktiv hona</span>',
    'retired': '<span class="badge badge-retired">Pensionerad</span>',
    'angel': '<span class="badge badge-angel">Ängel</span>'
  };
  return badges[role] || '';
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  // Check if we're on an admin page (except login)
  if (window.location.pathname.includes('admin-') && !window.location.pathname.includes('admin-login')) {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = 'admin-login.html';
    }
  }

  // Initialize page-specific functionality
  if (typeof initPage === 'function') {
    initPage();
  }
});
