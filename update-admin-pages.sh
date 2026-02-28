#!/bin/bash
# Script to update all admin pages with proper JavaScript integration

# Admin Cats Page
cat > /root/.openclaw/workspace/northwindscatters/admin-cats-new.html << 'EOF'
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hantera katter | Admin - NorthWind Scatters</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body data-page="cats">
  
  <div class="admin-layout">
    
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="admin-brand-icon">N</div>
        <span class="admin-brand-text">NorthWind</span>
      </div>
      
      <nav>
        <ul class="admin-nav">
          <li class="admin-nav-item">
            <a href="admin-dashboard.html" class="admin-nav-link">
              📊 Dashboard
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-kittens.html" class="admin-nav-link">
              🐱 Kattungar
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-cats.html" class="admin-nav-link active">
              🐾 Mina katter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-news.html" class="admin-nav-link">
              📰 Nyheter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-hero.html" class="admin-nav-link">
              🖼️ Hero bild
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-settings.html" class="admin-nav-link">
              ⚙️ Inställningar
            </a>
          </li>
          <li class="admin-nav-item" style="margin-top: var(--space-8);">
            <a href="index.html" class="admin-nav-link">
              🌐 Visa sida
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-login.html" class="admin-nav-link">
              🚪 Logga ut
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <!-- Content -->
    <main class="admin-content">
      
      <div class="admin-header">
        <h1 class="admin-title">Hantera katter</h1>
        <button class="btn btn-primary" onclick="Admin.openCatModal()">
          + Lägg till katt
        </button>
      </div>
      
      <!-- Filters -->
      <div id="cats-filters" class="filters" style="margin-bottom: var(--space-5); justify-content: flex-start;">
        <!-- Filters will be populated by JavaScript -->
      </div>
      
      <!-- Table -->
      <div id="cats-table" class="admin-table">
        <!-- Table will be populated by JavaScript -->
        <div class="text-center" style="padding: var(--space-12);">
          <p style="color: var(--color-text-muted);">Laddar katter...</p>
        </div>
      </div>
      
    </main>
    
  </div>

  <script src="admin.js"></script>
</body>
</html>
EOF

# Admin News Page
cat > /root/.openclaw/workspace/northwindscatters/admin-news-new.html << 'EOF'
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hantera nyheter | Admin - NorthWind Scatters</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body data-page="news">
  
  <div class="admin-layout">
    
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="admin-brand-icon">N</div>
        <span class="admin-brand-text">NorthWind</span>
      </div>
      
      <nav>
        <ul class="admin-nav">
          <li class="admin-nav-item">
            <a href="admin-dashboard.html" class="admin-nav-link">
              📊 Dashboard
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-kittens.html" class="admin-nav-link">
              🐱 Kattungar
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-cats.html" class="admin-nav-link">
              🐾 Mina katter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-news.html" class="admin-nav-link active">
              📰 Nyheter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-hero.html" class="admin-nav-link">
              🖼️ Hero bild
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-settings.html" class="admin-nav-link">
              ⚙️ Inställningar
            </a>
          </li>
          <li class="admin-nav-item" style="margin-top: var(--space-8);">
            <a href="index.html" class="admin-nav-link">
              🌐 Visa sida
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-login.html" class="admin-nav-link">
              🚪 Logga ut
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <!-- Content -->
    <main class="admin-content">
      
      <div class="admin-header">
        <h1 class="admin-title">Hantera nyheter</h1>
        <button class="btn btn-primary" onclick="Admin.openNewsModal()">
          + Skriv nyhet
        </button>
      </div>
      
      <!-- Table -->
      <div id="news-table" class="admin-table">
        <!-- Table will be populated by JavaScript -->
        <div class="text-center" style="padding: var(--space-12);">
          <p style="color: var(--color-text-muted);">Laddar nyheter...</p>
        </div>
      </div>
      
    </main>
    
  </div>

  <script src="admin.js"></script>
</body>
</html>
EOF

# Admin Dashboard Page
cat > /root/.openclaw/workspace/northwindscatters/admin-dashboard-new.html << 'EOF'
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard | Admin - NorthWind Scatters</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .stat-card {
      background: var(--color-white);
      padding: var(--space-6);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    
    .stat-label {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }
    
    .stat-value {
      font-size: var(--text-4xl);
      font-weight: 600;
      color: var(--color-primary);
    }
  </style>
</head>
<body data-page="dashboard">
  
  <div class="admin-layout">
    
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="admin-brand-icon">N</div>
        <span class="admin-brand-text">NorthWind</span>
      </div>
      
      <nav>
        <ul class="admin-nav">
          <li class="admin-nav-item">
            <a href="admin-dashboard.html" class="admin-nav-link active">
              📊 Dashboard
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-kittens.html" class="admin-nav-link">
              🐱 Kattungar
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-cats.html" class="admin-nav-link">
              🐾 Mina katter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-news.html" class="admin-nav-link">
              📰 Nyheter
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-hero.html" class="admin-nav-link">
              🖼️ Hero bild
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-settings.html" class="admin-nav-link">
              ⚙️ Inställningar
            </a>
          </li>
          <li class="admin-nav-item" style="margin-top: var(--space-8);">
            <a href="index.html" class="admin-nav-link">
              🌐 Visa sida
            </a>
          </li>
          <li class="admin-nav-item">
            <a href="admin-login.html" class="admin-nav-link">
              🚪 Logga ut
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    
    <!-- Content -->
    <main class="admin-content">
      
      <div class="admin-header">
        <h1 class="admin-title">Dashboard</h1>
      </div>
      
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Kattungar</div>
          <div class="stat-value" id="stat-kittens">0</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Mina katter</div>
          <div class="stat-value" id="stat-cats">0</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-label">Nyheter</div>
          <div class="stat-value" id="stat-news">0</div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="admin-table">
        <div style="padding: var(--space-6);">
          <h2 style="font-size: var(--text-xl); margin-bottom: var(--space-4);">Snabbåtgärder</h2>
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <a href="admin-kittens.html" class="btn btn-primary">Hantera kattungar</a>
            <a href="admin-cats.html" class="btn btn-secondary">Hantera katter</a>
            <a href="admin-news.html" class="btn btn-outline">Skriv nyhet</a>
          </div>
        </div>
      </div>
      
    </main>
    
  </div>

  <script src="admin.js"></script>
</body>
</html>
EOF

# Replace old files
mv /root/.openclaw/workspace/northwindscatters/admin-cats-new.html /root/.openclaw/workspace/northwindscatters/admin-cats.html
mv /root/.openclaw/workspace/northwindscatters/admin-news-new.html /root/.openclaw/workspace/northwindscatters/admin-news.html
mv /root/.openclaw/workspace/northwindscatters/admin-dashboard-new.html /root/.openclaw/workspace/northwindscatters/admin-dashboard.html

echo "✅ All admin pages updated successfully!"
