// NorthWind Scatters - Complete Admin Panel
// All CRUD operations with Image Upload

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const SUPABASE_URL = 'https://lsjzeubrhagoutqxlsoz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzanpldWJyaGFnb3V0cXhsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODQzODksImV4cCI6MjA4Nzg2MDM4OX0.BPkdOavlxXwsP7ubHpWqjGMOU_QpkiP5hl5XKK4IePg';

  let supabaseClient;

  try {
    if (window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.db = supabaseClient;
      console.log('✅ Supabase initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
  }

  // ==================== HELPER FUNCTIONS ====================
  function getImageValue(containerId) {
    const valueInput = document.getElementById(`${containerId}-value`);
    return valueInput ? valueInput.value : '';
  }

  function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.style.opacity = '0.5';
    element.style.pointerEvents = 'none';
  }

  function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = '✓ ' + message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10B981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.textContent = '✗ ' + message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #EF4444;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Okänt';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
  }

  function calculateAge(birthDate) {
    if (!birthDate) return 'Okänd ålder';
    const birth = new Date(birthDate);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - birth) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const months = Math.floor(diffDays / 30);
    return months > 0 ? `${months} mån` : `${weeks} v`;
  }

  function getStatusLabel(status) {
    const labels = { sale: 'Till salu', reserved: 'Tingad', sold: 'Såld' };
    return labels[status] || status;
  }

  function getRoleLabel(role) {
    const labels = { stud: 'Avelshane', queen: 'Aktiv hona', retired: 'Pensionerad', angel: 'Ängel' };
    return labels[role] || role;
  }

  // ==================== KITTENS ====================
  let currentFilter = 'all';

  async function loadKittens(statusFilter = 'all') {
    try {
      showLoading('kittens-table');
      let query = supabaseClient.from('kittens').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      const { data: kittens, error } = await query;
      if (error) throw error;
      renderKittensTable(kittens || []);
      updateKittenFilters(kittens || []);
    } catch (error) {
      console.error('Error loading kittens:', error);
      showError('Kunde inte ladda kattungar: ' + error.message);
    }
  }

  function renderKittensTable(kittens) {
    const container = document.getElementById('kittens-table');
    if (!container) return;

    if (kittens.length === 0) {
      container.innerHTML = '<div class="text-center" style="padding: var(--space-12);"><p style="color: var(--color-text-muted);">Inga kattungar hittades</p></div>';
      return;
    }

    const rows = kittens.map(kitten => `
      <div class="table-row" data-id="${kitten.id}">
        <img src="${kitten.image_url || 'https://via.placeholder.com/50'}" alt="${kitten.name}" class="table-img">
        <div><strong>${kitten.name}</strong><br><span style="font-size: var(--text-sm); color: var(--color-text-muted);">Kull: ${formatDate(kitten.born_date)}</span></div>
        <div style="font-size: var(--text-sm);">${kitten.gender === 'male' ? 'Hane' : 'Hona'} • ${calculateAge(kitten.born_date)}<br>${kitten.color || 'Okänd färg'}</div>
        <div><strong>${kitten.price ? kitten.price.toLocaleString('sv-SE') + ' kr' : 'Ej satt'}</strong></div>
        <div><span class="badge badge-${kitten.status}">${getStatusLabel(kitten.status)}</span></div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editKitten('${kitten.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteKitten('${kitten.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `<div class="table-header"><span>Bild</span><span>Namn</span><span>Info</span><span>Pris</span><span>Status</span><span>Åtgärder</span></div>${rows}`;
  }

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

  window.filterKittens = function(status) {
    currentFilter = status;
    loadKittens(status);
  };

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
              <label>Bild</label>
              <div id="kitten-image-uploader"></div>
            </div>
            <div class="form-group full-width">
              <label for="kitten-description">Beskrivning</label>
              <textarea id="kitten-description" name="description" rows="4" placeholder="Berätta om kattungen...">${kitten?.description || ''}</textarea>
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
    
    setTimeout(() => {
      if (window.createImageUploader) {
        createImageUploader('kitten-image-uploader', 'image_url', kitten?.image_url || '');
      }
    }, 100);
  };

  window.closeKittenModal = function() {
    const modal = document.getElementById('kitten-modal');
    if (modal) modal.remove();
  };

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
      image_url: getImageValue('kitten-image-uploader'),
      description: formData.get('description') || null,
    };

    try {
      showLoading('kitten-form');
      let result;
      if (kittenId) {
        result = await supabaseClient.from('kittens').update(kittenData).eq('id', kittenId);
      } else {
        result = await supabaseClient.from('kittens').insert([kittenData]);
      }
      if (result.error) throw result.error;
      showSuccess(kittenId ? 'Kattunge uppdaterad!' : 'Kattunge tillagd!');
      closeKittenModal();
      loadKittens(currentFilter);
    } catch (error) {
      console.error('Error saving kitten:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  window.editKitten = async function(kittenId) {
    try {
      const { data: kitten, error } = await supabaseClient.from('kittens').select('*').eq('id', kittenId).single();
      if (error) throw error;
      openKittenModal(kitten);
    } catch (error) {
      console.error('Error loading kitten:', error);
      showError('Kunde inte ladda kattunge: ' + error.message);
    }
  };

  window.deleteKitten = async function(kittenId) {
    if (!confirm('Är du säker på att du vill ta bort denna kattunge?')) return;
    try {
      const { error } = await supabaseClient.from('kittens').delete().eq('id', kittenId);
      if (error) throw error;
      showSuccess('Kattunge borttagen!');
      loadKittens(currentFilter);
    } catch (error) {
      console.error('Error deleting kitten:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== CATS ====================
  let currentCatsFilter = 'all';

  async function loadCats(roleFilter = 'all') {
    try {
      showLoading('cats-table');
      let query = supabaseClient.from('cats').select('*').order('created_at', { ascending: false });
      if (roleFilter !== 'all') query = query.eq('role', roleFilter);
      const { data: cats, error } = await query;
      if (error) throw error;
      renderCatsTable(cats || []);
      updateCatsFilters(cats || []);
    } catch (error) {
      console.error('Error loading cats:', error);
      showError('Kunde inte ladda katter: ' + error.message);
    }
  }

  function renderCatsTable(cats) {
    const container = document.getElementById('cats-table');
    if (!container) return;

    if (cats.length === 0) {
      container.innerHTML = '<div class="text-center" style="padding: var(--space-12);"><p style="color: var(--color-text-muted);">Inga katter hittades</p></div>';
      return;
    }

    const rows = cats.map(cat => `
      <div class="table-row" data-id="${cat.id}">
        <img src="${cat.image_url || 'https://via.placeholder.com/50'}" alt="${cat.name}" class="table-img">
        <div><strong>${cat.name}</strong><br><span style="font-size: var(--text-sm); color: var(--color-text-muted);">${cat.ems_code || ''}</span></div>
        <div style="font-size: var(--text-sm);">${cat.gender === 'male' ? 'Hane' : 'Hona'}<br>${cat.birth_date ? formatDate(cat.birth_date) : 'Okänt'}</div>
        <div><span class="badge badge-${cat.role}">${getRoleLabel(cat.role)}</span></div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editCat('${cat.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteCat('${cat.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `<div class="table-header"><span>Bild</span><span>Namn</span><span>Info</span><span>Roll</span><span>Åtgärder</span></div>${rows}`;
  }

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

  window.filterCats = function(role) {
    currentCatsFilter = role;
    loadCats(role);
  };

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
              <label>Bild</label>
              <div id="cat-image-uploader">
                <div class="text-center" style="padding: var(--space-4); color: var(--color-text-muted);">
                  Laddar bilduppladdare...
                </div>
              </div>
            </div>
            <div class="form-group full-width">
              <label for="cat-description">Beskrivning</label>
              <textarea id="cat-description" name="description" rows="4" placeholder="Berätta om katten...">${cat?.description || ''}</textarea>
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
    
    setTimeout(() => {
      console.log('🔍 Checking if createImageUploader exists...');
      console.log('window.createImageUploader:', typeof window.createImageUploader);
      
      if (window.createImageUploader) {
        console.log('✅ createImageUploader found, initializing...');
        try {
          createImageUploader('cat-image-uploader', 'image_url', cat?.image_url || '');
          console.log('✅ Image uploader initialized');
        } catch (error) {
          console.error('❌ Error initializing image uploader:', error);
        }
      } else {
        console.error('❌ createImageUploader not found! image-upload.js may not be loaded');
        const container = document.getElementById('cat-image-uploader');
        if (container) {
          container.innerHTML = '<p style="color: red; padding: var(--space-4);">⚠️ Bilduppladdare kunde inte laddas. Kontrollera att image-upload.js är inkluderad.</p>';
        }
      }
    }, 100);
  };

  window.closeCatModal = function() {
    const modal = document.getElementById('cat-modal');
    if (modal) modal.remove();
  };

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
      image_url: getImageValue('cat-image-uploader'),
      description: formData.get('description') || null,
      fiv_test: formData.get('fiv_test') || null,
      felv_test: formData.get('felv_test') || null,
      hcm_test: formData.get('hcm_test') || null,
      pkd_test: formData.get('pkd_test') || null,
    };

    try {
      showLoading('cat-form');
      let result;
      if (catId) {
        result = await supabaseClient.from('cats').update(catData).eq('id', catId);
      } else {
        result = await supabaseClient.from('cats').insert([catData]);
      }
      if (result.error) throw result.error;
      showSuccess(catId ? 'Katt uppdaterad!' : 'Katt tillagd!');
      closeCatModal();
      loadCats(currentCatsFilter);
    } catch (error) {
      console.error('Error saving cat:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  window.editCat = async function(catId) {
    try {
      const { data: cat, error } = await supabaseClient.from('cats').select('*').eq('id', catId).single();
      if (error) throw error;
      openCatModal(cat);
    } catch (error) {
      console.error('Error loading cat:', error);
      showError('Kunde inte ladda katt: ' + error.message);
    }
  };

  window.deleteCat = async function(catId) {
    if (!confirm('Är du säker på att du vill ta bort denna katt?')) return;
    try {
      const { error } = await supabaseClient.from('cats').delete().eq('id', catId);
      if (error) throw error;
      showSuccess('Katt borttagen!');
      loadCats(currentCatsFilter);
    } catch (error) {
      console.error('Error deleting cat:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== NEWS ====================
  async function loadNews() {
    try {
      showLoading('news-table');
      const { data: news, error } = await supabaseClient.from('news').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      renderNewsTable(news || []);
    } catch (error) {
      console.error('Error loading news:', error);
      showError('Kunde inte ladda nyheter: ' + error.message);
    }
  }

  function renderNewsTable(news) {
    const container = document.getElementById('news-table');
    if (!container) return;

    if (news.length === 0) {
      container.innerHTML = '<div class="text-center" style="padding: var(--space-12);"><p style="color: var(--color-text-muted);">Inga nyheter hittades</p></div>';
      return;
    }

    const rows = news.map(item => `
      <div class="table-row" data-id="${item.id}">
        <div style="grid-column: span 4;">
          <strong>${item.title}</strong><br>
          <span style="font-size: var(--text-sm); color: var(--color-text-muted);">${formatDate(item.published_at)}</span>
        </div>
        <div class="action-buttons">
          <button class="btn btn-outline btn-sm" onclick="Admin.editNews('${item.id}')">Redigera</button>
          <button class="btn btn-outline btn-sm" style="color: var(--color-accent); border-color: var(--color-accent);" onclick="Admin.deleteNews('${item.id}')">Ta bort</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = `<div class="table-header"><span style="grid-column: span 4;">Nyheter</span><span>Åtgärder</span></div>${rows}`;
  }

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
            <label>Bild (valfritt)</label>
            <div id="news-image-uploader"></div>
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
    
    setTimeout(() => {
      if (window.createImageUploader) {
        createImageUploader('news-image-uploader', 'image_url', newsItem?.image_url || '');
      }
    }, 100);
  };

  window.closeNewsModal = function() {
    const modal = document.getElementById('news-modal');
    if (modal) modal.remove();
  };

  window.saveNews = async function(event, newsId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newsData = {
      title: formData.get('title'),
      content: formData.get('content'),
      image_url: getImageValue('news-image-uploader'),
      published_at: new Date().toISOString(),
    };

    try {
      showLoading('news-form');
      let result;
      if (newsId) {
        result = await supabaseClient.from('news').update(newsData).eq('id', newsId);
      } else {
        result = await supabaseClient.from('news').insert([newsData]);
      }
      if (result.error) throw result.error;
      showSuccess(newsId ? 'Nyheter uppdaterad!' : 'Nyhet publicerad!');
      closeNewsModal();
      loadNews();
    } catch (error) {
      console.error('Error saving news:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  window.editNews = async function(newsId) {
    try {
      const { data: newsItem, error } = await supabaseClient.from('news').select('*').eq('id', newsId).single();
      if (error) throw error;
      openNewsModal(newsItem);
    } catch (error) {
      console.error('Error loading news:', error);
      showError('Kunde inte ladda nyhet: ' + error.message);
    }
  };

  window.deleteNews = async function(newsId) {
    if (!confirm('Är du säker på att du vill ta bort denna nyhet?')) return;
    try {
      const { error } = await supabaseClient.from('news').delete().eq('id', newsId);
      if (error) throw error;
      showSuccess('Nyhet borttagen!');
      loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      showError('Kunde inte ta bort: ' + error.message);
    }
  };

  // ==================== SETTINGS ====================
  async function loadSettings() {
    try {
      const { data: settings, error } = await supabaseClient.from('settings').select('*');
      if (error) throw error;
      
      const settingsObj = {};
      (settings || []).forEach(s => {
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

  function populateSettingsForm(settings) {
    const form = document.getElementById('settings-form');
    if (!form) return;

    const fields = {
      'hero_title': settings.hero_title || '',
      'hero_subtitle': settings.hero_subtitle || '',
      'kennel_name': settings.kennel_name || '',
      'kennel_description': settings.kennel_description || '',
      'contact_email': settings.contact_email || '',
      'contact_phone': settings.contact_phone || '',
      'contact_address': settings.contact_address || '',
      'facebook_url': settings.facebook_url || '',
      'instagram_url': settings.instagram_url || '',
    };

    Object.keys(fields).forEach(key => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) field.value = fields[key];
    });

    // Hero image uploader
    if (window.createImageUploader) {
      const heroImageContainer = document.getElementById('hero-image-uploader');
      if (heroImageContainer) {
        createImageUploader('hero-image-uploader', 'hero_image_url', settings.hero_image_url || '');
      }
    }
  }

  window.saveSettings = async function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const settingsToUpdate = [];
    
    for (let [key, value] of formData.entries()) {
      settingsToUpdate.push({ key, value });
    }

    // Add hero image from uploader
    const heroImage = getImageValue('hero-image-uploader');
    if (heroImage) {
      settingsToUpdate.push({ key: 'hero_image_url', value: heroImage });
    }

    try {
      showLoading('settings-form');
      
      for (const setting of settingsToUpdate) {
        const { error } = await supabaseClient.from('settings').upsert(setting, { onConflict: 'key' });
        if (error) throw error;
      }
      
      showSuccess('Inställningar sparade!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Kunde inte spara: ' + error.message);
    }
  };

  // ==================== DASHBOARD ====================
  async function loadDashboard() {
    try {
      const [
        { count: kittensCount },
        { count: catsCount },
        { count: newsCount },
      ] = await Promise.all([
        supabaseClient.from('kittens').select('*', { count: 'exact', head: true }),
        supabaseClient.from('cats').select('*', { count: 'exact', head: true }),
        supabaseClient.from('news').select('*', { count: 'exact', head: true }),
      ]);

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

  // ==================== INITIALIZE ====================
  document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    
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
