// Public Pages - Fetch data from Supabase
// For kittens.html, cats.html, news.html

(function() {
  'use strict';

  // Supabase Configuration
  const SUPABASE_URL = 'https://lsjzeubrhagoutqxlsoz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzanpldWJyaGFnb3V0cXhsc296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODQzODksImV4cCI6MjA4Nzg2MDM4OX0.BPkdOavlxXwsP7ubHpWqjGMOU_QpkiP5hl5XKK4IePg';

  let supabaseClient;

  try {
    if (window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.db = supabaseClient;
      console.log('✅ Supabase initialized for public pages');
    }
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
  }

  // Helper functions
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

  // ==================== KITTENS PAGE ====================
  async function loadKittensPublic() {
    try {
      const container = document.getElementById('kittens-grid');
      if (!container) return;

      container.innerHTML = '<div class="text-center" style="grid-column: 1 / -1;"><p>Laddar kattungar...</p></div>';

      const { data: kittens, error } = await supabaseClient
        .from('kittens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!kittens || kittens.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: var(--space-12);">
            <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">
              Inga kattungar tillgängliga just nu
            </p>
            <p style="font-size: var(--text-sm); color: var(--color-text-muted);">
              Kontakta oss för mer information om kommande kullar!
            </p>
          </div>
        `;
        return;
      }

      const cards = kittens.map(kitten => `
        <div class="card">
          <img src="${kitten.image_url || 'https://via.placeholder.com/400x300'}" 
               alt="${kitten.name}" 
               class="card-image"
               onerror="this.src='https://via.placeholder.com/400x300?text=Ingen+bild'">
          <div class="card-body">
            <span class="badge badge-${kitten.status}">${getStatusLabel(kitten.status)}</span>
            <h3 class="card-title">${kitten.name}</h3>
            <p class="card-text">
              ${kitten.gender === 'male' ? 'Hane' : 'Hona'} • ${calculateAge(kitten.born_date)}<br>
              ${kitten.color || 'Vacker'}
            </p>
            ${kitten.status === 'sale' && kitten.price ? 
              `<p style="font-size: var(--text-lg); font-weight: 600; color: var(--color-primary); margin-top: var(--space-2);">${kitten.price.toLocaleString('sv-SE')} kr</p>` 
              : ''}
            <a href="kitten-detail.html?id=${kitten.id}" class="btn btn-outline" style="margin-top: var(--space-3); width: 100%;">
              Läs mer
            </a>
          </div>
        </div>
      `).join('');

      container.innerHTML = cards;

    } catch (error) {
      console.error('Error loading kittens:', error);
      const container = document.getElementById('kittens-grid');
      if (container) {
        container.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: var(--space-12);">
            <p style="color: var(--color-text-muted);">
              Kunde inte ladda kattungar. Försök igen senare.
            </p>
          </div>
        `;
      }
    }
  }

  // ==================== CATS PAGE ====================
  async function loadCatsPublic() {
    try {
      const container = document.getElementById('cats-grid');
      if (!container) return;

      container.innerHTML = '<div class="text-center" style="grid-column: 1 / -1;"><p>Laddar katter...</p></div>';

      const { data: cats, error } = await supabaseClient
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!cats || cats.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: var(--space-12);">
            <p style="color: var(--color-text-muted);">Inga katter att visa</p>
          </div>
        `;
        return;
      }

      const cards = cats.map(cat => `
        <div class="card">
          <img src="${cat.image_url || 'https://via.placeholder.com/400x300'}" 
               alt="${cat.name}" 
               class="card-image"
               onerror="this.src='https://via.placeholder.com/400x300?text=Ingen+bild'">
          <div class="card-body">
            <span class="badge badge-${cat.role}">${getRoleLabel(cat.role)}</span>
            <h3 class="card-title">${cat.name}</h3>
            <p class="card-text">
              ${cat.gender === 'male' ? 'Hane' : 'Hona'}<br>
              ${cat.ems_code || ''}
            </p>
            <a href="cat-detail.html?id=${cat.id}" class="btn btn-outline" style="margin-top: var(--space-3); width: 100%;">
              Läs mer
            </a>
          </div>
        </div>
      `).join('');

      container.innerHTML = cards;

    } catch (error) {
      console.error('Error loading cats:', error);
      const container = document.getElementById('cats-grid');
      if (container) {
        container.innerHTML = `
          <div class="text-center" style="grid-column: 1 / -1; padding: var(--space-12);">
            <p style="color: var(--color-text-muted);">
              Kunde inte ladda katter. Försök igen senare.
            </p>
          </div>
        `;
      }
    }
  }

  // ==================== NEWS PAGE ====================
  async function loadNewsPublic() {
    try {
      const container = document.getElementById('news-list');
      if (!container) return;

      container.innerHTML = '<p>Laddar nyheter...</p>';

      const { data: news, error } = await supabaseClient
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (!news || news.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="padding: var(--space-12);">
            <p style="color: var(--color-text-muted);">Inga nyheter ännu</p>
          </div>
        `;
        return;
      }

      const items = news.map(item => `
        <article class="news-item">
          <div class="news-date">${formatDate(item.published_at)}</div>
          <h2 class="news-title">${item.title}</h2>
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-4);">` : ''}
          <div class="news-content">
            <p>${item.content}</p>
          </div>
        </article>
      `).join('');

      container.innerHTML = items;

    } catch (error) {
      console.error('Error loading news:', error);
      const container = document.getElementById('news-list');
      if (container) {
        container.innerHTML = `
          <div class="text-center" style="padding: var(--space-12);">
            <p style="color: var(--color-text-muted);">
              Kunde inte ladda nyheter. Försök igen senare.
            </p>
          </div>
        `;
      }
    }
  }

  // ==================== INITIALIZE ====================
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    
    switch (page) {
      case 'kittens':
        loadKittensPublic();
        break;
      case 'cats':
        loadCatsPublic();
        break;
      case 'news':
        loadNewsPublic();
        break;
    }
  });

})();
