# RecipeMaster - Intelligentes Deutsches Rezept-Tool

Ein modernes, KI-gestütztes Rezept-Management-Tool mit Vorratsschrank-Verwaltung, Nährwert-Tracking und Google Gemini AI Integration.

## Features

### Phase 1: Foundation (✅ Abgeschlossen)

- ✅ React 18 + TypeScript + Vite Setup
- ✅ Tailwind CSS Styling
- ✅ Supabase Backend Integration
- ✅ User Authentication (Login/Register)
- ✅ Protected Routes
- ✅ Responsive Layout mit Sidebar
- ✅ Common UI Components
- ✅ TypeScript Type System
- ✅ Database Migrations
- ✅ Row Level Security (RLS)

### Phase 2: Core Features (In Planung)

- [ ] Vorratsschrank-Management (CRUD)
- [ ] Rezept-Datenbank mit Filter/Suche
- [ ] User Goals System
- [ ] Nährwert-Anzeige
- [ ] Einkaufslisten-Verwaltung

### Phase 3: AI Integration (In Planung)

- [ ] Google Gemini API Integration
- [ ] Foto-Upload für Vorratsschrank-Erkennung
- [ ] Intelligente Rezept-Generierung
- [ ] Erweiterte Nährwertanalyse
- [ ] KI-gestützte Suchvorschläge

### Phase 4: Advanced Features (In Planung)

- [ ] Meal Planning System
- [ ] Automatische Einkaufslisten
- [ ] Erweiterte Dashboards
- [ ] Mobile Optimierung
- [ ] Performance-Optimierung

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod Validation
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **Edge Functions:** Deno/TypeScript

### AI
- **Google Gemini AI:** Rezept-Generierung, Nährwert-Analyse, Bild-Erkennung

## Projektstruktur

```
src/
├── components/
│   ├── auth/              # Login, Register, ProtectedRoute
│   ├── common/            # Button, Input, Card, Modal, etc.
│   ├── layout/            # Header, Sidebar, MainLayout
│   ├── pantry/            # Vorratsschrank-Komponenten
│   ├── recipes/           # Rezept-Komponenten
│   ├── search/            # Such-Komponenten
│   ├── nutrition/         # Nährwert-Komponenten
│   ├── goals/             # Ziel-Komponenten
│   ├── shopping/          # Einkaufslisten-Komponenten
│   └── planning/          # Meal-Planning-Komponenten
├── pages/                 # Dashboard, Recipes, Pantry, etc.
├── hooks/                 # useAuth, custom hooks
├── services/              # Supabase, Gemini, API services
│   ├── supabase.ts        # Supabase Client + Services
│   └── gemini.ts          # Gemini AI Service
├── types/                 # TypeScript Type Definitions
│   ├── database.types.ts  # Datenbank-Typen
│   └── api.types.ts       # API Response Typen
├── utils/                 # Helper Functions
└── styles/                # Global Styles

supabase/
├── migrations/            # SQL Migrations
│   ├── 20240101_initial_schema.sql
│   ├── 20240102_rls_policies.sql
│   └── 20240103_seed_nutrition_data.sql
├── functions/             # Edge Functions
│   ├── gemini-proxy/
│   ├── nutrition-ai/
│   └── recipe-generator/
└── README.md              # Supabase Setup Anleitung
```

## Installation

### 1. Repository klonen

```bash
git clone <repository-url>
cd recipe
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Environment Variables konfigurieren

Kopiere `.env.example` zu `.env`:

```bash
cp .env.example .env
```

Fülle die folgenden Werte aus:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Supabase Setup

Siehe [supabase/README.md](./supabase/README.md) für detaillierte Anweisungen.

**Kurzfassung:**

1. Erstelle ein Supabase-Projekt auf [supabase.com](https://supabase.com)
2. Führe die Migrations-Dateien aus (in Reihenfolge):
   - `20240101_initial_schema.sql`
   - `20240102_rls_policies.sql`
   - `20240103_seed_nutrition_data.sql`
3. Erstelle Storage Buckets:
   - `recipe-images` (public)
   - `pantry-images` (public)

### 5. Development Server starten

```bash
npm run dev
```

App läuft unter: http://localhost:5173

## Scripts

```bash
# Development Server
npm run dev

# TypeScript Type Check
npm run type-check

# Build für Production
npm run build

# Preview Production Build
npm run preview

# Linting
npm run lint
```

## Datenbankschema

### Haupttabellen

- **users_profile** - User-Profile mit Präferenzen
- **pantry_items** - Vorratsschrank-Artikel
- **recipes** - Rezept-Datenbank (öffentlich + privat)
- **user_goals** - Ernährungsziele
- **shopping_lists** - Einkaufslisten
- **meal_plans** - Meal-Planning-Kalender
- **nutrition_database** - Nährwert-Datenbank (mit 40+ deutschen Lebensmitteln vorausgefüllt)

Siehe [Database Schema Documentation](./supabase/migrations/20240101_initial_schema.sql) für Details.

## API Services

### Supabase Services

```typescript
import { authService, pantryService, recipeService, goalsService } from './services/supabase';

// Authentication
await authService.signUp(email, password, displayName);
await authService.signIn(email, password);
await authService.signOut();

// Pantry
const items = await pantryService.getAll();
await pantryService.create({ name: 'Tomaten', quantity: 5, unit: 'Stück', ... });
await pantryService.update(id, { quantity: 3 });
await pantryService.delete(id);

// Recipes
const recipes = await recipeService.getAll();
const recipe = await recipeService.getById(id);
await recipeService.search('pasta', { maxPrepTime: 30 });
```

### Gemini AI Service

```typescript
import { geminiService } from './services/gemini';

// Rezept-Generierung
const recipes = await geminiService.generateRecipes({
  ingredients: ['Tomaten', 'Pasta', 'Knoblauch'],
  preferences: {
    dietary: ['vegetarisch'],
    maxTime: 30,
    servings: 2
  }
});

// Nährwert-Analyse
const nutrition = await geminiService.analyzeNutrition({
  ingredients: [
    { name: 'Tomaten', quantity: 200, unit: 'g' },
    { name: 'Pasta', quantity: 100, unit: 'g' }
  ]
});

// Bild-Analyse
const analysis = await geminiService.analyzeImage({
  imageBase64: base64String,
  type: 'pantry'
});
```

## Authentication Flow

Die App nutzt Supabase Auth mit Email/Password:

1. User registriert sich über `/register`
2. Automatische Erstellung eines User-Profils (via Trigger)
3. Login über `/login`
4. Geschützte Routen nutzen `<ProtectedRoute>`
5. Auth-State wird via `useAuth()` Hook verwaltet

## Deployment

### Vercel (Empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deploy
vercel
```

### Manual Build

```bash
# Production Build erstellen
npm run build

# dist/ Ordner auf beliebigem Static Host deployen
```

## Environment Variables für Production

Stelle sicher, dass folgende Environment Variables gesetzt sind:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

## Sicherheit

- ✅ Row Level Security (RLS) aktiviert
- ✅ Input Validation mit Zod
- ✅ Protected Routes
- ✅ API Keys in Environment Variables
- ⚠️ **Wichtig:** Gemini API Calls sollten über Supabase Edge Functions laufen (nicht direkt vom Client)

## Roadmap

### Kurzfristig (1-2 Monate)
- [ ] Phase 2: Core Features implementieren
- [ ] Responsive Design verbessern
- [ ] Unit Tests schreiben

### Mittelfristig (3-6 Monate)
- [ ] Phase 3: AI Integration
- [ ] PWA Support
- [ ] Offline-Modus

### Langfristig (6+ Monate)
- [ ] Mobile App (React Native)
- [ ] Multi-Language Support
- [ ] Recipe Sharing Community

## Contributing

Contributions sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## License

MIT

## Support

Bei Fragen oder Problemen, bitte ein Issue erstellen.

---

**Built with ❤️ using React, TypeScript, Supabase & Google Gemini AI**
