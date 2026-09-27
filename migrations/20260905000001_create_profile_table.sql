CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_migrations (
 filename text PRIMARY KEY,
 checksum text NOT NULL,
 applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE,
 password_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
