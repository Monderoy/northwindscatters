# NorthWind Scatters - Kattuppfödning Webbplats

En snygg, mobil-först webbplats för en Norsk Skogskatt-uppfödare byggd med HTML, CSS och vanilla JavaScript.

![NorthWind Scatters](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80)

## 🎯 Funktioner

### Offentlig webbplats
- **Hem** - Hero sektion med introduktion
- **Kattungar** - Lista med filter (Till salu/Tingad/Såld)
- **Kattunge detaljer** - Full information om varje kattunge
- **Mina katter** - Avelskatter med roller (Avelshane/Aktiv hona/Pensionerad/Ängel)
- **Katt detaljer** - Hälsotester, meriter, kullar
- **Om oss** - Kennelns historia och filosofi
- **Galleri** - Bildgalleri med filter
- **Nyheter** - Uppdateringar och meddelanden
- **Kontakt** - Kontaktformulär och information

### Admin panel
- **Dashboard** - Översikt och statistik
- **Hantera kattungar** - CRUD-operationer
- **Hantera katter** - CRUD-operationer
- **Hantera nyheter** - Skapa/redigera nyheter
- **Hero bild** - Byta startsidans bild
- **Inställningar** - Konfigurera webbplatsen

### Design
- ✅ Mobile-first responsiv design
- ✅ Scandinavian jordnära färgpalett
- ✅ 8-pt spacing system
- ✅ Apple-nivå polish
- ✅ Snabba, mjuka interaktioner
- ✅ Tillgänglighet i fokus

## 🚀 Deployment till Vercel

### Steg 1: Skapa Vercel-konto
1. Gå till [vercel.com](https://vercel.com)
2. Klicka "Sign Up"
3. Välj "Continue with GitHub" (rekommenderas) eller e-post

### Steg 2: Ladda upp projektet

#### Alternativ A: Via Vercel CLI (rekommenderas)
```bash
# Installera Vercel CLI
npm install -g vercel

# Navigera till projektmappen
cd northwindscatters

# Logga in
vercel login

# Deploya
vercel

# Följ instruktionerna:
# - Link to existing project? No
# - Project name? northwindscatters
# - Directory? ./
```

#### Alternativ B: Via Vercel dashboard (enklare)
1. Gå till [vercel.com/new](https://vercel.com/new)
2. Dra och släpp `northwindscatters`-mappen till sidan
3. Vercel deployar automatiskt

### Steg 3: Konfigurera domän (valfritt)
1. I Vercel dashboard, gå till ditt projekt
2. Klicka "Settings" → "Domains"
3. Lägg till din domän (t.ex. northwindscatters.com)
4. Följ instruktionerna för DNS-konfiguration

### Steg 4: Klart!
Din webbplats är nu live på:
- `https://ditt-projekt-namn.vercel.app`
- Eller din egen domän

## 📁 Projektstruktur

```
northwindscatters/
├── index.html              # Startsida
├── kittens.html            # Kattungar lista
├── kitten-detail.html      # Kattunge detaljsida
├── cats.html               # Mina katter lista
├── cat-detail.html         # Katt detaljsida
├── about.html              # Om oss
├── gallery.html            # Galleri
├── news.html               # Nyheter
├── contact.html            # Kontakt
├── style.css               # Design system + alla stilar
├── admin-login.html        # Admin inloggning
├── admin-dashboard.html    # Admin dashboard
├── admin-kittens.html      # Hantera kattungar
├── admin-cats.html         # Hantera katter
├── admin-news.html         # Hantera nyheter
├── admin-hero.html         # Byta hero bild
├── admin-settings.html     # Inställningar
└── README.md               # Denna fil
```

## 🎨 Design System

### Färgpalett
- **Primary:** `#2D4A3E` (Skoggrön)
- **Accent:** `#C17F59` (Terracotta)
- **Neutral base:** `#F5F1EB` (Varm beige)
- **Text:** `#1A1A1A` (Nästan svart)
- **Text muted:** `#6B7280` (Mjuk grå)

### Typografi
- **Rubriker:** DM Serif Display (serif)
- **Body:** Inter (sans-serif)

### Spacing
8-pt system: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px

## 💻 Utveckling

### Lokal förhandsvisning
```bash
# Starta lokal server (Python)
cd northwindscatters
python3 -m http.server 8080

# Eller använd Node.js
npx serve
```

Öppna `http://localhost:8080` i webbläsaren.

### Redigera
1. Öppna `.html`-filer för innehåll
2. Redigera `style.css` för designändringar
3. Spara och ladda om webbläsaren

### Nästa steg (backend)
För full funktionalitet, integrera med:
- **Supabase** för databas och auth
- **Cloudinary** för bildhantering
- **Next.js** för dynamiska sidor

## 📋 Status

✅ **Prototyp klar** (100%)
- Alla sidor designade
- Admin panel mockup
- Mobile-first responsiv
- Deploy-ready

🔄 **Ej implementerat (backend)**
- Dynamiskt innehåll från databas
- Inloggning/authentication
- Bilduppladdning
- Kontaktformulär som fungerar
- Språkbyte (SV/EN)

## 🛠️ Teknikstack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Mobile-first, CSS custom properties
- **Hosting:** Vercel (statisk hosting)
- **Bilder:** Unsplash (placeholder)

## 📝 Licens

Skapad för NorthWind Scatters. Alla rättigheter förbehållna.

---

**Byggd med ❤️ av Memo**
