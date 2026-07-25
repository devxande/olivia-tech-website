-- Schema do banco D1 da Olivia Tech: leads do formulário e eventos de clique.
-- Aplicar com (idempotente — pode rodar de novo com segurança):
--   wrangler d1 execute olivia-tech-leads --remote --file=db/schema.sql   (produção)
--   wrangler d1 execute olivia-tech-leads --local  --file=db/schema.sql   (local/dev)

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  company    TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  message    TEXT,
  user_agent TEXT,
  referer    TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);

-- Eventos de clique nos CTAs — mede qual botão e qual posição convertem.
-- Sem dado pessoal: só rótulos de uma allowlist fechada (ver functions/event.js).
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  event      TEXT NOT NULL,  -- ex.: 'cta_click'
  label      TEXT NOT NULL,  -- ex.: 'solicitar-diagnostico', 'whatsapp'
  location   TEXT NOT NULL,  -- ex.: 'hero', 'navbar', 'footer'
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_label_location ON events (label, location);
