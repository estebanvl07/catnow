-- =============================================
-- CatalogoPro Database Schema
-- =============================================

-- 1. Stores (Workspaces)
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  whatsapp_number text,
  primary_color text default 'indigo',
  layout_template text default 'classic' check (layout_template in ('classic', 'modern', 'minimal')),
  plan text default 'small' check (plan in ('small', 'medium', 'superstore', 'custom')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Sections (Product Categories)
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  section_id uuid references public.sections(id) on delete set null,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Enable RLS on all tables
-- =============================================
alter table public.stores enable row level security;
alter table public.sections enable row level security;
alter table public.products enable row level security;

-- =============================================
-- RLS Policies: Stores
-- =============================================
create policy "stores_select_own" on public.stores
  for select using (auth.uid() = user_id);

create policy "stores_insert_own" on public.stores
  for insert with check (auth.uid() = user_id);

create policy "stores_update_own" on public.stores
  for update using (auth.uid() = user_id);

create policy "stores_delete_own" on public.stores
  for delete using (auth.uid() = user_id);

-- Public read access for storefront (anyone can view a store by slug)
create policy "stores_public_read" on public.stores
  for select using (true);

-- =============================================
-- RLS Policies: Sections
-- =============================================
create policy "sections_select_own" on public.sections
  for select using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "sections_insert_own" on public.sections
  for insert with check (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "sections_update_own" on public.sections
  for update using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "sections_delete_own" on public.sections
  for delete using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

-- Public read for storefront
create policy "sections_public_read" on public.sections
  for select using (true);

-- =============================================
-- RLS Policies: Products
-- =============================================
create policy "products_select_own" on public.products
  for select using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "products_insert_own" on public.products
  for insert with check (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "products_update_own" on public.products
  for update using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

create policy "products_delete_own" on public.products
  for delete using (
    store_id in (select id from public.stores where user_id = auth.uid())
  );

-- Public read for storefront
create policy "products_public_read" on public.products
  for select using (true);

-- =============================================
-- Indexes for performance
-- =============================================
create index if not exists idx_stores_user_id on public.stores(user_id);
create index if not exists idx_stores_slug on public.stores(slug);
create index if not exists idx_sections_store_id on public.sections(store_id);
create index if not exists idx_products_store_id on public.products(store_id);
create index if not exists idx_products_section_id on public.products(section_id);
create index if not exists idx_products_status on public.products(status);
