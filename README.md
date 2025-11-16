# RecipeMaster 🍳

Ein intelligentes Rezept-Management-Tool mit KI-Unterstützung, entwickelt mit React, TypeScript, Supabase und Google Gemini AI.

![RecipeMaster](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### ✅ Phase 1: Foundation (Abgeschlossen)
- React 18 + TypeScript + Vite Setup
- Tailwind CSS v4 mit modernem Design
- Supabase Backend-Integration
- User Authentication (Login/Register)
- Protected Routes & Layout
- Responsive Sidebar-Navigation
- Wiederverwendbare UI-Komponenten
- Vollständiges TypeScript Type System
- Database Migrations & Row Level Security

### ✅ Phase 2: Core Features (Abgeschlossen)

**Vorratsmanagement:**
- CRUD-Operationen für Vorratsartikel
- Ablaufdatum-Tracking mit Warnungen
- Kategorisierung (Gemüse, Obst, Fleisch, etc.)
- Filterung und Statistiken

**Rezeptverwaltung:**
- Vollständiges Rezept-CRUD
- Dynamische Zutaten und Anweisungen
- Schwierigkeitsgrade und Zeitangaben
- Private/Öffentliche Rezepte

**Ziele & Tracking:**
- 7 Zieltypen (Kalorien, Wasser, Protein, etc.)
- Fortschrittsbalken mit visueller Rückmeldung
- Quick Increment/Decrement Buttons
- Statistik-Dashboard

**Einkaufslisten:**
- Mehrere Listen verwalten
- Checkbox-Funktionalität
- Status-Management (Aktiv, Abgeschlossen, Archiviert)
- Fortschritts-Tracking

### ✅ Phase 3: KI-Integration (Abgeschlossen)

**KI-Rezeptgenerator:**
- Automatische Rezeptgenerierung aus verfügbaren Zutaten
- Anpassbare Präferenzen (Küche, Zeit, Schwierigkeit, Ernährung)
- Generierte Rezepte direkt speichern
- Google Gemini 1.5 Flash Integration

**Bilderkennung:**
- Foto-Upload für Lebensmittelerkennung
- KI-gestützte Bildanalyse
- Automatisches Hinzufügen erkannter Artikel
- Konfidenz-Scores für Erkennungen

**Nährwertanalyse:**
- KI-basierte Nährwertberechnung
- Detaillierte Makro- und Mikronährstoffe
- Visuelle Darstellung mit Fortschrittsbalken
- Vitamin- und Mineralstoffanalyse

### ✅ Phase 4: Advanced Features (Abgeschlossen)

**Meal Planning:**
- Interaktiver Wochenkalender
- 4 Mahlzeiten pro Tag (Frühstück, Mittagessen, Abendessen, Snack)
- Drag-and-Drop Rezept-Zuordnung
- Mahlzeiten als gekocht markieren
- Automatische Einkaufslisten-Generierung
- Export-Funktionalität

**Nutrition Dashboard:**
- Umfassendes Nährwert-Tracking
- Makronährstoff-Verteilung (Pie Chart)
- Ziel-Fortschritts-Verfolgung
- Insights und Empfehlungen
- Durchschnittswerte pro Mahlzeit

### ✅ Phase 5: Feinschliff & Deployment (Abgeschlossen)

**Rezeptsuche:**
- Volltextsuche in Rezepten und Zutaten
- Erweiterte Filter (Schwierigkeit, Zeit, Tags)
- Live-Filter-Vorschau
- Responsive Suchergebnisse

**Dokumentation:**
- Umfassendes README
- Environment Setup Guide (.env.example)
- Deployment-Anleitung

## 🚀 Installation

### Voraussetzungen

- Node.js 18+ und npm
- Supabase Account ([supabase.com](https://supabase.com))
- Google Gemini API Key (optional) ([ai.google.dev](https://ai.google.dev))

### Schritt-für-Schritt-Anleitung

1. **Repository klonen**
```bash
git clone <repository-url>
cd recipe
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Umgebungsvariablen einrichten**
```bash
cp .env.example .env
```

Bearbeiten Sie `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key  # Optional
```

4. **Supabase Datenbank einrichten**

Führen Sie die Migrations in Ihrer Supabase SQL-Editor aus:
```sql
-- In Reihenfolge:
supabase/migrations/20240101_initial_schema.sql
supabase/migrations/20240102_rls_policies.sql
supabase/migrations/20240103_seed_nutrition_data.sql
```

5. **Entwicklungsserver starten**
```bash
npm run dev
```

App läuft unter: `http://localhost:5173`

6. **Production Build**
```bash
npm run build
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS v4** - Styling
- **React Router v6** - Navigation
- **React Hook Form + Zod** - Formular-Handling
- **Lucide React** - Icons
- **React Dropzone** - File Upload

### Backend & Services
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Datenbank
  - Authentication & RLS
  - Storage
  - Realtime
- **Google Gemini AI** - KI-Features
  - gemini-1.5-flash-latest

## 📁 Projektstruktur

```
recipe/
├── src/
│   ├── components/
│   │   ├── common/       # UI-Komponenten
│   │   ├── auth/         # Authentication
│   │   ├── layout/       # Layout
│   │   ├── pantry/       # Vorratsschrank
│   │   ├── recipes/      # Rezepte
│   │   ├── goals/        # Ziele
│   │   ├── shopping/     # Einkaufslisten
│   │   ├── mealplan/     # Meal Planning
│   │   └── ai/           # KI-Features
│   ├── hooks/            # Custom Hooks
│   ├── pages/            # Seiten
│   ├── services/         # API Services
│   ├── types/            # TypeScript Types
│   └── App.tsx
├── supabase/
│   └── migrations/       # SQL Migrations
└── package.json
```

## 🗄️ Datenbankstruktur

### Tabellen

- `users_profile` - Benutzerprofile
- `pantry_items` - Vorratsartikel
- `recipes` - Rezepte mit Zutaten
- `user_goals` - Ernährungsziele
- `shopping_lists` - Einkaufslisten
- `meal_plans` - Essensplanung
- `nutrition_database` - Nährwertdatenbank (40+ deutsche Lebensmittel)

### Row Level Security (RLS)

- Alle Tabellen sind mit RLS geschützt
- Benutzer sehen nur ihre eigenen Daten
- Öffentliche Rezepte sind für alle lesbar

## 🔑 Supabase Setup

1. **Projekt erstellen** auf [supabase.com](https://supabase.com)
2. **SQL-Migrationen** im SQL Editor ausführen
3. **Environment Variables** kopieren
4. **Storage Buckets** erstellen (optional):
   - `recipe-images`
   - `pantry-images`

## 🤖 Google Gemini AI Setup (Optional)

1. API Key auf [ai.google.dev](https://ai.google.dev) erstellen
2. In `.env` eintragen: `VITE_GEMINI_API_KEY=your-key`

### KI-Features ohne API Key:
- Rezeptgenerierung nicht verfügbar
- Bilderkennung nicht verfügbar
- Nährwertanalyse nicht verfügbar
- Alle anderen Features funktionieren normal

## 📝 Verwendung

### Erste Schritte

1. **Registrieren** - Konto erstellen
2. **Vorratsschrank** - Zutaten hinzufügen
3. **Rezepte** - Eigene Rezepte erstellen oder KI nutzen
4. **Ziele** - Ernährungsziele definieren
5. **Meal Plan** - Woche planen
6. **Einkaufsliste** - Aus Meal Plan generieren

## 🧪 Entwicklung

### Scripts

```bash
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run preview      # Build Vorschau
npm run lint         # Linting
```

### Code-Qualität

- TypeScript Strict Mode
- ESLint für Code-Qualität
- Component-basierte Architektur
- Custom Hooks für State Management

## 🔒 Sicherheit

- ✅ Row Level Security (RLS)
- ✅ Umgebungsvariablen für Secrets
- ✅ Passwort-Hashing via Supabase
- ✅ CSRF-Schutz
- ✅ XSS-Schutz durch React

⚠️ **Produktions-Hinweis**: Gemini API Calls sollten über Supabase Edge Functions laufen, nicht direkt vom Client

## 🚢 Deployment

### Vercel (Empfohlen)

1. Repository zu GitHub pushen
2. Mit Vercel verbinden
3. Environment Variables eintragen
4. Automatisches Deployment

### Netlify

1. Build Command: `npm run build`
2. Publish Directory: `dist`
3. Environment Variables eintragen

### Andere Plattformen

Funktioniert auf allen Static Hosting Plattformen (Cloudflare Pages, GitHub Pages, etc.)

## 📊 Features-Übersicht

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| Authentication | ✅ | Email/Password Login |
| Vorratsschrank | ✅ | CRUD, Ablaufdatum, Kategorien |
| Rezepte | ✅ | CRUD, Privat/Öffentlich |
| Rezeptsuche | ✅ | Volltext, Filter |
| KI-Rezeptgenerator | ✅ | Gemini AI |
| Bilderkennung | ✅ | Gemini Vision |
| Nährwertanalyse | ✅ | KI-basiert |
| Ziele-Tracking | ✅ | 7 Zieltypen |
| Einkaufslisten | ✅ | Mehrere Listen |
| Meal Planning | ✅ | Wochenkalender |
| Nutrition Dashboard | ✅ | Makro-Tracking |

## 🤝 Beitragen

Contributions sind willkommen!

1. Fork das Repository
2. Feature Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

## 📄 Lizenz

MIT License

## 🙏 Credits

- [Supabase](https://supabase.com) - Backend
- [Google Gemini](https://ai.google.dev) - AI
- [Lucide](https://lucide.dev) - Icons
- [Tailwind CSS](https://tailwindcss.com) - Styling

## 📞 Support

- GitHub Issues für Bugs
- Pull Requests für Features

---

**RecipeMaster** - Intelligentes Kochen mit KI-Unterstützung 🍳✨

**Version 1.0.0** - Alle Phasen abgeschlossen!
