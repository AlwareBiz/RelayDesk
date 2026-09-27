CREATE TYPE log_level AS ENUM ('debug', 'info', 'warn', 'error');

CREATE TABLE log (
 id UUID NOT NULL DEFAULT gen_random_uuid(),
 content TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 log_level log_level NOT NULL DEFAULT 'info',
 PRIMARY KEY (id)
);

CREATE INDEX log_created_at_idx ON log (created_at);
