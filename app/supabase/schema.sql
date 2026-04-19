-- Tourist Shopping List App — Supabase Schema (MVP)
-- Run this in the Supabase SQL editor to initialise your database.

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── shopping_lists ──────────────────────────────────────────────────────────
-- One list per tourist session / trip.
create table if not exists shopping_lists (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'My Tokyo List',
  city        text not null default 'tokyo',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── list_items ──────────────────────────────────────────────────────────────
-- Individual items on a shopping list.
create table if not exists list_items (
  id              uuid primary key default uuid_generate_v4(),
  list_id         uuid not null references shopping_lists(id) on delete cascade,
  name            text not null,
  category        text not null default 'other',
  -- category: electronics | food_snacks | clothing | souvenirs | beauty_health | books_stationery | other
  notes           text,
  budget          numeric(10,0),
  for_whom        text,
  is_purchased    boolean not null default false,
  purchased_at    timestamptz,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── stores ──────────────────────────────────────────────────────────────────
-- Discovered stores (populated by Claude API / LLM store-discovery).
create table if not exists stores (
  id              uuid primary key default uuid_generate_v4(),
  list_id         uuid not null references shopping_lists(id) on delete cascade,
  name            text not null,
  address         text,
  lat             double precision,
  lng             double precision,
  google_place_id text,
  categories      text[] not null default '{}',
  -- which item categories this store covers
  item_ids        uuid[] not null default '{}',
  -- list_items this store can fulfil
  hours           jsonb,
  -- { mon: "10:00-20:00", ... }
  discovered_at   timestamptz not null default now()
);

-- ─── store_matches ────────────────────────────────────────────────────────────
-- Claude-discovered store recommendations, cached per list item.
create table if not exists store_matches (
  id          uuid primary key default uuid_generate_v4(),
  item_id     uuid not null references list_items(id) on delete cascade,
  store_name  text not null,
  area        text,
  address     text,
  lat         double precision,
  lng         double precision,
  reasoning   text,
  cached_at   timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists list_items_list_id_idx on list_items(list_id);
create index if not exists stores_list_id_idx on stores(list_id);
create index if not exists stores_location_idx on stores(lat, lng);
create index if not exists store_matches_item_id_idx on store_matches(item_id);

-- ─── Row Level Security (placeholder — tighten before launch) ────────────────
-- For MVP with anonymous/session-based lists, RLS is permissive.
-- Replace with user-scoped policies when auth is added.
alter table shopping_lists enable row level security;
alter table list_items enable row level security;
alter table stores enable row level security;

create policy "Allow all for now" on shopping_lists for all using (true) with check (true);
create policy "Allow all for now" on list_items for all using (true) with check (true);
create policy "Allow all for now" on stores for all using (true) with check (true);

alter table store_matches enable row level security;
create policy "Allow all for now" on store_matches for all using (true) with check (true);
