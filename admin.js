// Admin Panel JavaScript - NorthWind Scatters
// Handles all CRUD operations for kittens, cats, news, and settings

(function() {
  'use strict';

  // ==================== SUPABASE SETUP ====================
  const SUPABASE_URL = 'https://lsjzeubrhagoutqxlsoz.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_bUUZjgFpx_6GH8WS3nY9aQ_NAXbrZBt';
  
  let supabaseClient;
  
  try {
    if (window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.db = supabaseClient;
      console.log('✅ Supabase initialized');
    } else {
      console.error('❌ Supabase library not loaded');
    }
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
  }

  // ==================== AUTH HELPERS ====================
  
  async function getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  }

  async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  }

  // ==================== KITTENS MANAGEMENT ====================
  
  // Load all kittens
  async function loadKittens(statusFilter = 'all') {
    try {
      showLoading('kittens-table');
      
      let query = supabaseClient
        .from('kittens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data: kittens, error } = await query;
      
      if (error) throw error;
      
      renderKittensTable(kittens || []);
      updateKittenFilters(kittens || []);
      
    } catch (error) {
      console.error('Error loading kittens:', error);
      showError('Kunde inte ladda kattungar: ' + error.message);
    }
  }

  // Render kittens table
  function renderKittensTable(kittens) {
    const container = document.getElementById('kittens-table');
    if (!container) return;

    if (kittens.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: var(--space-12);">
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">Inga kattungar hittades</p>
          <button class="btn btn-primary" onclick="Admin.openKittenModal()">+ Lägg till kattunge</button>
        </div>
      `;
      return;
    }

    const rows = kittens.map(kitten => `
      <div class="table-row" data-id="${kitten.id}">
        <img src="${kitten.image_url || 'https://via.placeholder.com/50'}" alt="${kitten.name}" class="table-img">
        <div>
          <strong>${kitten.name}</strong><br>
          <span style="font-size: var(--text-sm); color: var(--color-text-muted);">Kull: ${formatDate(kitten.born_date)}</span>
        </div>
        <div style="font-size: var(--text-sm);">
          ${kitten.gender === 'male' ? 'Hane' : 'Hona'} • ${calculateAge(kitten.born_date)}<br>
          ${kitten.color || 'Okänd färg'}
        </div>
        <div><strong>${kitten.price ? kitten.price.toLocaleString('sv-SE') + ' kr' : 'Ej satt'}</strong></div>
        <div><span class="badge badge-${kitten.status}">${getStatusLabel(kitten.status)}</span></div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editKitten('${kitten.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteKitten('${kitten.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="table-header">
        <span>Bild</span>
        <span>Namn</span>
        <span>Info</span>
        <span>Pris</span>
        <span>Status</span>
        <span>Åtgärder</span>
      </div>
      ${rows}
    `;
  }

  // Update filter buttons
  function updateKittenFilters(kittens) {
    const counts = {
      all: kittens.length,
      sale: kittens.filter(k => k.status === 'sale').length,
      reserved: kittens.filter(k => k.status === 'reserved').length,
      sold: kittens.filter(k => k.status === 'sold').length,
    };

    const filtersContainer = document.getElementById('kittens-filters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = `
      <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" onclick="Admin.filterKittens('all')">Alla (${counts.all})</button>
      <button class="filter-btn ${currentFilter === 'sale' ? 'active' : ''}" onclick="Admin.filterKittens('sale')">Till salu (${counts.sale})</button>
      <button class="filter-btn ${currentFilter === 'reserved' ? 'active' : ''}" onclick="Admin.filterKittens('reserved')">Tingad (${counts.reserved})</button>
      <button class="filter-btn ${currentFilter === 'sold' ? 'active' : ''}" onclick="Admin.filterKittens('sold')">Såld (${counts.sold})</button>
    `;
  }

  let currentFilter = 'all';

  // Filter kittens
  window.filterKittens = function(status) {
    currentFilter = status;
    loadKittens(status);
  };

  // Open kitten modal
  window.openKittenModal = function(kitten = null) {
    const modal = document.createElement('div');
    modal.id = 'kitten-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="Admin.closeKittenModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${kitten ? 'Redigera kattunge' : 'Lägg till kattunge'}</h2>
          <button class="modal-close" onclick="Admin.closeKittenModal()">&times;</button>
        </div>
        <form id="kitten-form" onsubmit="Admin.saveKitten(event, ${kitten ? `'${kitten.id}'` : 'null'})">
          <div class="form-grid">
            <div class="form-group">
              <label for="kitten-name">Namn *</label>
              <input type="text" id="kitten-name" name="name" value="${kitten?.name || ''}" required>
            </div>
            
            <div class="form-group">
              <label for="kitten-born-date">Föddedatum *</label>
              <input type="date" id="kitten-born-date" name="born_date" value="${kitten?.born_date || ''}" required>
            </div>
            
            <div class="form-group">
              <label for="kitten-gender">Kön *</label>
              <select id="kitten-gender" name="gender" required>
                <option value="male" ${kitten?.gender === 'male' ? 'selected' : ''}>Hane</option>
                <option value="female" ${kitten?.gender === 'female' ? 'selected' : ''}>Hona</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="kitten-color">Färg</label>
              <input type="text" id="kitten-color" name="color" value="${kitten?.color || ''}" placeholder="t.ex. Brun tabby">
            </div>
            
            <div class="form-group">
              <label for="kitten-status">Status *</label>
              <select id="kitten-status" name="status" required>
                <option value="sale" ${kitten?.status === 'sale' ? 'selected' : ''}>Till salu</option>
                <option value="reserved" ${kitten?.status === 'reserved' ? 'selected' : ''}>Tingad</option>
                <option value="sold" ${kitten?.status === 'sold' ? 'selected' : ''}>Såld</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="kitten-price">Pris (kr)</label>
              <input type="number" id="kitten-price" name="price" value="${kitten?.price || ''}" placeholder="12000">
            </div>
            
            <div class="form-group full-width">
              <label for="kitten-image">Bild URL</label>
              <input type="url" id="kitten-image" name="image_url" value="${kitten?.image_url || ''}" placeholder="https://...">
            </div>
            
            <div class="form-group full-width">
              <label for="kitten-description">Beskrivning</label>
              <textarea id="kitten-description" name="description" rows="4" placeholder="Berätta om kattungen...">${kitten?.description || ''}</textarea>
            </div>
            
            <div class="form-group full-width">
              <label for="kitten-pedigree">Stamtavla URL</label>
              <input type="url" id="kitten-pedigree" name="pedigree_url" value="${kitten?.pedigree_url || ''}" placeholder="https://...">
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="Admin.closeKittenModal()">Avbryt</button>
            <button type="submit" class="btn btn-primary">${kitten ? 'Spara ändringar' : 'Lägg till'}</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  };

  // Close kitten modal
  window.closeKittenModal = function() {
    const modal = document.getElementById('kitten-modal');
    if (modal) modal.remove();
  };

  // Save kitten (create or update)
  window.saveKitten = async function(event, kittenId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const kittenData = {
      name: formData.get('name'),
      born_date: formData.get('born_date'),
      gender: formData.get('gender'),
      color: formData.get('color') || null,
      status: formData.get('status'),
      price: formData.get('price') ? parseInt(formData.get('price')) : null,
      image_url: formData.get('image_url') || null,
      description: formData.get('description') || null,
      pedigree_url: formData.get('pedigree_url') || null,
    };

    try {
      showLoading('kitten-form');
      
      let result;
      if (kittenId) {
        // Update existing
        result = await supabaseClient
          .from('kittens')
          .update(kittenData)
          .eq('id', kittenId);
      } else {
        // Create new
        result = await supabaseClient
          .from('kittens')
          .insert([kittenData]);
      }

      const { error } = result;
      
      if (error) throw error;
      
      showSuccess(kittenId ? 'Kattunge uppdaterad!' : 'Kattunge tillagd!');
      closeKittenModal();
      loadKittens(currentFilter);
      
    } catch (error) {
      console.error('Error saving kitten:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  // Edit kitten
  window.editKitten = async function(kittenId) {
    try {
      const { data: kitten, error } = await supabaseClient
        .from('kittens')
        .select('*')
        .eq('id', kittenId)
        .single();
      
      if (error) throw error;
      
      openKittenModal(kitten);
      
    } catch (error) {
      console.error('Error loading kitten:', error);
      showError('Kunde inte ladda kattunge: ' + error.message);
    }
  };

  // Delete kitten
  window.deleteKitten = async function(kittenId) {
    if (!confirm('Är du säker på att du vill ta bort denna kattunge? Denna åtgärd kan inte ångras.')) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('kittens')
        .delete()
        .eq('id', kittenId);
      
      if (error) throw error;
      
      showSuccess('Kattunge borttagen!');
      loadKittens(currentFilter);
      
    } catch (error) {
      console.error('Error deleting kitten:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== CATS MANAGEMENT ====================
  
  // Load all cats
  async function loadCats(roleFilter = 'all') {
    try {
      showLoading('cats-table');
      
      let query = supabaseClient
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      const { data: cats, error } = await query;
      
      if (error) throw error;
      
      renderCatsTable(cats || []);
      updateCatsFilters(cats || []);
      
    } catch (error) {
      console.error('Error loading cats:', error);
      showError('Kunde inte ladda katter: ' + error.message);
    }
  }

  // Render cats table
  function renderCatsTable(cats) {
    const container = document.getElementById('cats-table');
    if (!container) return;

    if (cats.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: var(--space-12);">
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">Inga katter hittades</p>
          <button class="btn btn-primary" onclick="Admin.openCatModal()">+ Lägg till katt</button>
        </div>
      `;
      return;
    }

    const rows = cats.map(cat => `
      <div class="table-row" data-id="${cat.id}">
        <img src="${cat.image_url || 'https://via.placeholder.com/50'}" alt="${cat.name}" class="table-img">
        <div>
          <strong>${cat.name}</strong><br>
          <span style="font-size: var(--text-sm); color: var(--color-text-muted);">${cat.ems_code || ''}</span>
        </div>
        <div style="font-size: var(--text-sm);">
          ${cat.gender === 'male' ? 'Hane' : 'Hona'}<br>
          ${cat.birth_date ? formatDate(cat.birth_date) : 'Okänt'}
        </div>
        <div><span class="badge badge-${cat.role}">${getRoleLabel(cat.role)}</span></div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editCat('${cat.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteCat('${cat.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="table-header">
        <span>Bild</span>
        <span>Namn</span>
        <span>Info</span>
        <span>Roll</span>
        <span>Åtgärder</span>
      </div>
      ${rows}
    `;
  }

  // Update cats filter buttons
  function updateCatsFilters(cats) {
    const counts = {
      all: cats.length,
      stud: cats.filter(c => c.role === 'stud').length,
      queen: cats.filter(c => c.role === 'queen').length,
      retired: cats.filter(c => c.role === 'retired').length,
      angel: cats.filter(c => c.role === 'angel').length,
    };

    const filtersContainer = document.getElementById('cats-filters');
    if (!filtersContainer) return;

    filtersContainer.innerHTML = `
      <button class="filter-btn ${currentCatsFilter === 'all' ? 'active' : ''}" onclick="Admin.filterCats('all')">Alla (${counts.all})</button>
      <button class="filter-btn ${currentCatsFilter === 'stud' ? 'active' : ''}" onclick="Admin.filterCats('stud')">Avelshane (${counts.stud})</button>
      <button class="filter-btn ${currentCatsFilter === 'queen' ? 'active' : ''}" onclick="Admin.filterCats('queen')">Aktiv hona (${counts.queen})</button>
      <button class="filter-btn ${currentCatsFilter === 'retired' ? 'active' : ''}" onclick="Admin.filterCats('retired')">Pensionerad (${counts.retired})</button>
      <button class="filter-btn ${currentCatsFilter === 'angel' ? 'active' : ''}" onclick="Admin.filterCats('angel')">Ängel (${counts.angel})</button>
    `;
  }

  let currentCatsFilter = 'all';

  // Filter cats
  window.filterCats = function(role) {
    currentCatsFilter = role;
    loadCats(role);
  };

  // Open cat modal
  window.openCatModal = function(cat = null) {
    const modal = document.createElement('div');
    modal.id = 'cat-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="Admin.closeCatModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${cat ? 'Redigera katt' : 'Lägg till katt'}</h2>
          <button class="modal-close" onclick="Admin.closeCatModal()">&times;</button>
        </div>
        <form id="cat-form" onsubmit="Admin.saveCat(event, ${cat ? `'${cat.id}'` : 'null'})">
          <div class="form-grid">
            <div class="form-group">
              <label for="cat-name">Namn *</label>
              <input type="text" id="cat-name" name="name" value="${cat?.name || ''}" required>
            </div>
            
            <div class="form-group">
              <label for="cat-gender">Kön *</label>
              <select id="cat-gender" name="gender" required>
                <option value="male" ${cat?.gender === 'male' ? 'selected' : ''}>Hane</option>
                <option value="female" ${cat?.gender === 'female' ? 'selected' : ''}>Hona</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="cat-role">Roll *</label>
              <select id="cat-role" name="role" required>
                <option value="stud" ${cat?.role === 'stud' ? 'selected' : ''}>Avelshane</option>
                <option value="queen" ${cat?.role === 'queen' ? 'selected' : ''}>Aktiv hona</option>
                <option value="retired" ${cat?.role === 'retired' ? 'selected' : ''}>Pensionerad</option>
                <option value="angel" ${cat?.role === 'angel' ? 'selected' : ''}>Ängel</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="cat-birth-date">Föddedatum</label>
              <input type="date" id="cat-birth-date" name="birth_date" value="${cat?.birth_date || ''}">
            </div>
            
            <div class="form-group">
              <label for="cat-ems-code">EMS-kod</label>
              <input type="text" id="cat-ems-code" name="ems_code" value="${cat?.ems_code || ''}" placeholder="t.ex. NFO n 09 23">
            </div>
            
            <div class="form-group">
              <label for="cat-pedigree-name">Stamtavle namn</label>
              <input type="text" id="cat-pedigree-name" name="pedigree_name" value="${cat?.pedigree_name || ''}" placeholder="Officiellt namn">
            </div>
            
            <div class="form-group full-width">
              <label for="cat-image">Bild URL</label>
              <input type="url" id="cat-image" name="image_url" value="${cat?.image_url || ''}" placeholder="https://...">
            </div>
            
            <div class="form-group full-width">
              <label for="cat-description">Beskrivning</label>
              <textarea id="cat-description" name="description" rows="4" placeholder="Berätta om katten...">${cat?.description || ''}</textarea>
            </div>
            
            <div class="form-group full-width">
              <label for="cat-pedigree">Stamtavla URL</label>
              <input type="url" id="cat-pedigree" name="pedigree_url" value="${cat?.pedigree_url || ''}" placeholder="https://...">
            </div>
            
            <div class="form-group">
              <label for="cat-fiv">FIV test</label>
              <select id="cat-fiv" name="fiv_test">
                <option value="" ${!cat?.fiv_test ? 'selected' : ''}>Ej testad</option>
                <option value="negative" ${cat?.fiv_test === 'negative' ? 'selected' : ''}>Negativ</option>
                <option value="positive" ${cat?.fiv_test === 'positive' ? 'selected' : ''}>Positiv</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="cat-felv">FeLV test</label>
              <select id="cat-felv" name="felv_test">
                <option value="" ${!cat?.felv_test ? 'selected' : ''}>Ej testad</option>
                <option value="negative" ${cat?.felv_test === 'negative' ? 'selected' : ''}>Negativ</option>
                <option value="positive" ${cat?.felv_test === 'positive' ? 'selected' : ''}>Positiv</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="cat-hcm">HCM test</label>
              <select id="cat-hcm" name="hcm_test">
                <option value="" ${!cat?.hcm_test ? 'selected' : ''}>Ej testad</option>
                <option value="negative" ${cat?.hcm_test === 'negative' ? 'selected' : ''}>Negativ</option>
                <option value="positive" ${cat?.hcm_test === 'positive' ? 'selected' : ''}>Positiv</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="cat-pkd">PKD test</label>
              <select id="cat-pkd" name="pkd_test">
                <option value="" ${!cat?.pkd_test ? 'selected' : ''}>Ej testad</option>
                <option value="negative" ${cat?.pkd_test === 'negative' ? 'selected' : ''}>Negativ</option>
                <option value="positive" ${cat?.pkd_test === 'positive' ? 'selected' : ''}>Positiv</option>
              </select>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="Admin.closeCatModal()">Avbryt</button>
            <button type="submit" class="btn btn-primary">${cat ? 'Spara ändringar' : 'Lägg till'}</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  };

  // Close cat modal
  window.closeCatModal = function() {
    const modal = document.getElementById('cat-modal');
    if (modal) modal.remove();
  };

  // Save cat (create or update)
  window.saveCat = async function(event, catId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const catData = {
      name: formData.get('name'),
      gender: formData.get('gender'),
      role: formData.get('role'),
      birth_date: formData.get('birth_date') || null,
      ems_code: formData.get('ems_code') || null,
      pedigree_name: formData.get('pedigree_name') || null,
      image_url: formData.get('image_url') || null,
      description: formData.get('description') || null,
      pedigree_url: formData.get('pedigree_url') || null,
      fiv_test: formData.get('fiv_test') || null,
      felv_test: formData.get('felv_test') || null,
      hcm_test: formData.get('hcm_test') || null,
      pkd_test: formData.get('pkd_test') || null,
    };

    try {
      showLoading('cat-form');
      
      let result;
      if (catId) {
        // Update existing
        result = await supabaseClient
          .from('cats')
          .update(catData)
          .eq('id', catId);
      } else {
        // Create new
        result = await supabaseClient
          .from('cats')
          .insert([catData]);
      }

      const { error } = result;
      
      if (error) throw error;
      
      showSuccess(catId ? 'Katt uppdaterad!' : 'Katt tillagd!');
      closeCatModal();
      loadCats(currentCatsFilter);
      
    } catch (error) {
      console.error('Error saving cat:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  // Edit cat
  window.editCat = async function(catId) {
    try {
      const { data: cat, error } = await supabaseClient
        .from('cats')
        .select('*')
        .eq('id', catId)
        .single();
      
      if (error) throw error;
      
      openCatModal(cat);
      
    } catch (error) {
      console.error('Error loading cat:', error);
      showError('Kunde inte ladda katt: ' + error.message);
    }
  };

  // Delete cat
  window.deleteCat = async function(catId) {
    if (!confirm('Är du säker på att du vill ta bort denna katt? Denna åtgärd kan inte ångras.')) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('cats')
        .delete()
        .eq('id', catId);
      
      if (error) throw error;
      
      showSuccess('Katt borttagen!');
      loadCats(currentCatsFilter);
      
    } catch (error) {
      console.error('Error deleting cat:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== NEWS MANAGEMENT ====================
  
  // Load all news
  async function loadNews() {
    try {
      showLoading('news-table');
      
      const { data: news, error } = await supabaseClient
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      renderNewsTable(news || []);
      
    } catch (error) {
      console.error('Error loading news:', error);
      showError('Kunde inte ladda nyheter: ' + error.message);
    }
  }

  // Render news table
  function renderNewsTable(news) {
    const container = document.getElementById('news-table');
    if (!container) return;

    if (news.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: var(--space-12);">
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">Inga nyheter hittades</p>
          <button class="btn btn-primary" onclick="Admin.openNewsModal()">+ Skriv nyhet</button>
        </div>
      `;
      return;
    }

    const rows = news.map(item => `
      <div class="table-row" data-id="${item.id}">
        <div style="grid-column: span 4;">
          <strong>${item.title}</strong><br>
          <span style="font-size: var(--text-sm); color: var(--color-text-muted);">
            ${formatDate(item.published_at)}
          </span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editNews('${item.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteNews('${item.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="table-header">
        <span style="grid-column: span 4;">Nyheter</span>
        <span>Åtgärder</span>
      </div>
      ${rows}
    `;
  }

  // Open news modal
  window.openNewsModal = function(newsItem = null) {
    const modal = document.createElement('div');
    modal.id = 'news-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="Admin.closeNewsModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${newsItem ? 'Redigera nyhet' : 'Skriv nyhet'}</h2>
          <button class="modal-close" onclick="Admin.closeNewsModal()">&times;</button>
        </div>
        <form id="news-form" onsubmit="Admin.saveNews(event, ${newsItem ? `'${newsItem.id}'` : 'null'})">
          <div class="form-group">
            <label for="news-title">Rubrik *</label>
            <input type="text" id="news-title" name="title" value="${newsItem?.title || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="news-content">Innehåll *</label>
            <textarea id="news-content" name="content" rows="6" required>${newsItem?.content || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label for="news-image">Bild URL (valfritt)</label>
            <input type="url" id="news-image" name="image_url" value="${newsItem?.image_url || ''}" placeholder="https://...">
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="Admin.closeNewsModal()">Avbryt</button>
            <button type="submit" class="btn btn-primary">${newsItem ? 'Spara ändringar' : 'Publicera'}</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
  };

  // Close news modal
  window.closeNewsModal = function() {
    const modal = document.getElementById('news-modal');
    if (modal) modal.remove();
  };

  // Save news
  window.saveNews = async function(event, newsId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newsData = {
      title: formData.get('title'),
      content: formData.get('content'),
      image_url: formData.get('image_url') || null,
      published_at: new Date().toISOString(),
    };

    try {
      showLoading('news-form');
      
      let result;
      if (newsId) {
        result = await supabaseClient
          .from('news')
          .update(newsData)
          .eq('id', newsId);
      } else {
        result = await supabaseClient
          .from('news')
          .insert([newsData]);
      }

      const { error } = result;
      
      if (error) throw error;
      
      showSuccess(newsId ? 'Nyheter uppdaterad!' : 'Nyhet publicerad!');
      closeNewsModal();
      loadNews();
      
    } catch (error) {
      console.error('Error saving news:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  // Edit news
  window.editNews = async function(newsId) {
    try {
      const { data: newsItem, error } = await supabaseClient
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();
      
      if (error) throw error;
      
      openNewsModal(newsItem);
      
    } catch (error) {
      console.error('Error loading news:', error);
      showError('Kunde inte ladda nyhet: ' + error.message);
    }
  };

  // Delete news
  window.deleteNews = async function(newsId) {
    if (!confirm('Är du säker på att du vill ta bort denna nyhet?')) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('news')
        .delete()
        .eq('id', newsId);
      
      if (error) throw error;
      
      showSuccess('Nyhet borttagen!');
      loadNews();
      
    } catch (error) {
      console.error('Error deleting news:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== SETTINGS MANAGEMENT ====================
  
  // Load settings
  async function loadSettings() {
    try {
      const { data: settings, error } = await supabaseClient
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert array to object
      const settingsObj = {};
      (settings || []).forEach(s => {
        // Handle JSONB value - extract string if it's a simple value
        let value = s.value;
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        settingsObj[s.key] = value;
      });
      
      populateSettingsForm(settingsObj);
      
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Kunde inte ladda inställningar: ' + error.message);
    }
  }

  // Populate settings form
  function populateSettingsForm(settings) {
    const form = document.getElementById('settings-form');
    if (!form) return;

    // Hero section
    const heroTitle = form.querySelector('[name="hero_title"]');
    const heroSubtitle = form.querySelector('[name="hero_subtitle"]');
    const heroImage = form.querySelector('[name="hero_image_url"]');
    
    if (heroTitle) heroTitle.value = settings.hero_title || '';
    if (heroSubtitle) heroSubtitle.value = settings.hero_subtitle || '';
    if (heroImage) heroImage.value = settings.hero_image_url || '';

    // Contact section
    const contactEmail = form.querySelector('[name="contact_email"]');
    const contactPhone = form.querySelector('[name="contact_phone"]');
    const contactAddress = form.querySelector('[name="contact_address"]');
    
    if (contactEmail) contactEmail.value = settings.contact_email || '';
    if (contactPhone) contactPhone.value = settings.contact_phone || '';
    if (contactAddress) contactAddress.value = settings.contact_address || '';
    
    // Kennel info
    const kennelName = form.querySelector('[name="kennel_name"]');
    const kennelDesc = form.querySelector('[name="kennel_description"]');
    
    if (kennelName) kennelName.value = settings.kennel_name || '';
    if (kennelDesc) kennelDesc.value = settings.kennel_description || '';

    // Social media
    const facebook = form.querySelector('[name="facebook_url"]');
    const instagram = form.querySelector('[name="instagram_url"]');
    
    if (facebook) facebook.value = settings.facebook_url || '';
    if (instagram) instagram.value = settings.instagram_url || '';
  }

  // Save settings
  window.saveSettings = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const settingsToUpdate = [];
    
    for (let [key, value] of formData.entries()) {
      // Convert to JSONB format that Supabase expects
      settingsToUpdate.push({ 
        key, 
        value: value  // Keep as string, Supabase will handle conversion
      });
    }

    try {
      showLoading('settings-form');
      
      // Update each setting
      for (const setting of settingsToUpdate) {
        const { data, error } = await supabaseClient
          .from('settings')
          .upsert(setting, { onConflict: 'key' })
          .select();
        
        if (error) {
          console.error('Error saving setting:', key, error);
          throw error;
        }
      }
      
      showSuccess('Inställningar sparade!');
      
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  // ==================== DASHBOARD ====================
  
  // Load dashboard stats
  async function loadDashboard() {
    try {
      // Get counts
      const [
        { count: kittensCount },
        { count: catsCount },
        { count: newsCount },
      ] = await Promise.all([
        supabaseClient.from('kittens').select('*', { count: 'exact', head: true }),
        supabaseClient.from('cats').select('*', { count: 'exact', head: true }),
        supabaseClient.from('news').select('*', { count: 'exact', head: true }),
      ]);

      // Update stats
      const kittensStat = document.getElementById('stat-kittens');
      const catsStat = document.getElementById('stat-cats');
      const newsStat = document.getElementById('stat-news');
      
      if (kittensStat) kittensStat.textContent = kittensCount || 0;
      if (catsStat) catsStat.textContent = catsCount || 0;
      if (newsStat) newsStat.textContent = newsCount || 0;
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  // ==================== UI HELPERS ====================
  
  // Show loading state
  function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.style.opacity = '0.5';
    element.style.pointerEvents = 'none';
  }

  // Show success message
  function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = '✓ ' + message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-success, #10b981);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Show error message
  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = '✗ ' + message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-accent, #ef4444);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return 'Okänt';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Calculate age
  function calculateAge(birthDate) {
    if (!birthDate) return 'Okänd ålder';
    
    const birth = new Date(birthDate);
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const months = Math.floor(diffDays / 30);
    
    if (months > 0) {
      return `${months} mån`;
    } else {
      return `${weeks} v`;
    }
  }

  // Get status label
  function getStatusLabel(status) {
    const labels = {
      sale: 'Till salu',
      reserved: 'Tingad',
      sold: 'Såld',
    };
    return labels[status] || status;
  }

  // Get role label
  function getRoleLabel(role) {
    const labels = {
      stud: 'Avelshane',
      queen: 'Aktiv hona',
      retired: 'Pensionerad',
      angel: 'Ängel',
    };
    return labels[role] || role;
  }

  // ==================== INITIALIZE ====================
  
  // Auto-initialize based on page
  document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    
    // Check auth
    const isAuthenticated = await requireAuth();
    if (!isAuthenticated) return;

    // Initialize based on page
    switch (page) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'kittens':
        loadKittens();
        break;
      case 'cats':
        loadCats();
        break;
      case 'news':
        loadNews();
        break;
      case 'settings':
        loadSettings();
        break;
    }
  });

  // Export to window for onclick handlers
  window.Admin = {
    filterKittens,
    openKittenModal,
    closeKittenModal,
    saveKitten,
    editKitten,
    deleteKitten,
    
    filterCats,
    openCatModal,
    closeCatModal,
    saveCat,
    editCat,
    deleteCat,
    
    openNewsModal,
    closeNewsModal,
    saveNews,
    editNews,
    deleteNews,
    
    saveSettings,
  };

})();
