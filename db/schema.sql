-- Schema do banco D1 de leads (Olivia Tech).
-- Aplicar com:
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
