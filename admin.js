// NorthWind Scatters - Admin Panel
// Complete CRUD operations with Supabase

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

  // ==================== INITIALIZE ====================
  document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    switch (page) {
      case 'kittens':
        loadKittens();
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
  };

})();
