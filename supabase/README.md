# Supabase Setup für RecipeMaster

## Migrations ausführen

1. Installiere Supabase CLI:
```bash
npm install -g supabase
```

2. Login bei Supabase:
```bash
supabase login
```

3. Link zu deinem Projekt:
```bash
supabase link --project-ref your-project-ref
```

4. Migrationen ausführen:
```bash
supabase db push
```

## Manuelle Ausführung

Alternativ kannst du die SQL-Dateien auch manuell im Supabase Dashboard ausführen:

1. Gehe zu deinem Supabase Projekt Dashboard
2. Navigiere zu "SQL Editor"
3. Führe die Migrations-Dateien in dieser Reihenfolge aus:
   - `20240101_initial_schema.sql` - Erstellt alle Tabellen
   - `20240102_rls_policies.sql` - Aktiviert Row Level Security
   - `20240103_seed_nutrition_data.sql` - Füllt Nährwertdatenbank

## Storage Buckets erstellen

Erstelle folgende Storage Buckets im Supabase Dashboard:

1. **recipe-images**
   - Public: Ja
   - Allowed MIME types: image/jpeg, image/png, image/webp
   - Max file size: 5MB

2. **pantry-images**
   - Public: Ja
   - Allowed MIME types: image/jpeg, image/png, image/webp
   - Max file size: 5MB

## Environment Variables

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

Hole die Werte aus dem Supabase Dashboard:
- Settings → API → Project URL
- Settings → API → Project API keys → anon public
