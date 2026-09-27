CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'agent');
CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'solved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE workspace (
 id UUID NOT NULL DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 ticket_counter INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (id)
);

CREATE TABLE workspace_member (
 workspace_id UUID NOT NULL REFERENCES workspace (id) ON DELETE CASCADE,
 profile_id UUID NOT NULL REFERENCES profile (id) ON DELETE CASCADE,
 role workspace_role NOT NULL DEFAULT 'agent',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (workspace_id, profile_id)
);

CREATE INDEX workspace_member_profile_id_idx ON workspace_member (profile_id);

CREATE TABLE ticket (
 id UUID NOT NULL DEFAULT gen_random_uuid(),
 workspace_id UUID NOT NULL REFERENCES workspace (id) ON DELETE CASCADE,
 number INTEGER NOT NULL,
 subject TEXT NOT NULL,
 requester_email TEXT NOT NULL,
 status ticket_status NOT NULL DEFAULT 'open',
 priority ticket_priority NOT NULL DEFAULT 'normal',
 assignee_profile_id UUID REFERENCES profile (id) ON DELETE SET NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (id),
 UNIQUE (workspace_id, number)
);

CREATE INDEX ticket_workspace_status_idx ON ticket (workspace_id, status, created_at DESC);
