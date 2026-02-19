-- Exécuter dans l'éditeur SQL Supabase (Table Editor > predictions ou SQL Editor)
-- Ajoute les colonnes optionnelles et archivage aux pronostics

ALTER TABLE predictions
  ADD COLUMN IF NOT EXISTS absents TEXT,
  ADD COLUMN IF NOT EXISTS meteo TEXT,
  ADD COLUMN IF NOT EXISTS enjeux TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;
