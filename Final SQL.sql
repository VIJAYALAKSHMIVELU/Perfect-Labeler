CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants Table --

create table tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz default now()
);

-- Tenant users table --
create table tenant_users (
  user_id uuid references auth.users(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  role text default 'user',
  primary key (user_id, tenant_id)
);

-- receipt designs table --

create table receipt_designs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  name text not null,
  width integer not null,
  height integer not null,
  created_at timestamptz default now()
);

alter table receipt_designs enable row level security;

-- Select Policy --

create policy "Tenant can read designs"
on receipt_designs
for select
using (
  tenant_id in (
    select tenant_id
    from tenant_users
    where user_id = auth.uid()
  )
);

-- Insert Policy --

create policy "Tenant can insert designs"
on receipt_designs
for insert
with check (
  tenant_id in (
    select tenant_id
    from tenant_users
    where user_id = auth.uid()
  )
);

-- Update Policy--

create policy "Tenant can update own designs"
on receipt_designs
for update
using (
  tenant_id in (
    select tenant_id
    from tenant_users
    where user_id = auth.uid()
  )
)
with check (
  tenant_id in (
    select tenant_id
    from tenant_users
    where user_id = auth.uid()
  )
);

-- Delete Policy--  

create policy "Tenant can delete own designs"
on receipt_designs
for delete
using (
  tenant_id in (
    select tenant_id
    from tenant_users
    where user_id = auth.uid()
  )
);

-- Get random tenant value --
insert into tenants (name)
values ('Demo Tenant')
returning id;

-- Insert Tenant User based on tenant --
insert into tenant_users (user_id, tenant_id, role)
values (
  '3bd7a2b7-8c97-45c1-900f-fc5ad907613f',
  '55fac84c-671f-443d-869d-f6b5d6e0ccae',
  'user1'
);

-- Receipt element Table --
create table receipt_elements (
  id uuid primary key default uuid_generate_v4(),
  design_id uuid references receipt_designs(id) on delete cascade,
  tenant_id uuid not null,
  element_type text NOT NULL CHECK ( element_type IN ('text', 'qr', 'line', 'logo', 'code128', 'code39', 'placeholder')),
  position_x integer not null,
  position_y integer not null,
  content text,
  properties jsonb,
  created_at timestamptz default now()
);


-- Enable RLS --

alter table receipt_elements enable row level security;

-- Selecet Policy --
create policy "Tenant can read elements"
on receipt_elements
for select
using (
  design_id in (
    select id
    from receipt_designs
    where tenant_id in (
      select tenant_id
      from tenant_users
      where user_id = auth.uid()
    )
  )
);

-- insert values --
INSERT INTO receipt_elements (
  design_id,
  tenant_id,
  element_type,
  position_x,
  position_y
)
VALUES (
  '48c14b56-980e-4647-a20f-66f4c02e8c53',
  '55fac84c-671f-443d-869d-f6b5d6e0ccae',
  'text',
  100,
  200
);