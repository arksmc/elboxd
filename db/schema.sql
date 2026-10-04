-- UPLB Eats schema. A record of what exists in Supabase.
-- Run once on a fresh project. Don't re-run on the live database.

-- Eateries
create table eateries (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  branch text,
  chain text,
  area text,
  category text,
  tags text[],
  status text not null default 'open'
);

alter table eateries enable row level security;

create policy "Anyone can read eateries"
  on eateries for select using (true);

-- Profiles: public nickname per user
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null check (char_length(nickname) between 3 and 20),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Anyone can read profiles"
  on profiles for select using (true);

create policy "Users insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

create policy "Users update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Reviews
create table reviews (
  id bigint generated always as identity primary key,
  eatery_id bigint not null references eateries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text check (char_length(body) <= 1000),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (eatery_id, user_id)
);

alter table reviews enable row level security;

create policy "Users insert own reviews"
  on reviews for insert with check (auth.uid() = user_id);

create policy "Users update own reviews"
  on reviews for update using (auth.uid() = user_id);

create policy "Users delete own reviews"
  on reviews for delete using (auth.uid() = user_id);

create policy "Users read own reviews"
  on reviews for select using (auth.uid() = user_id);

-- Public view: no user_id exposed
create view public_reviews as
select
  r.id,
  r.eatery_id,
  r.rating,
  r.body,
  r.created_at,
  coalesce(p.nickname, 'Anonymous') as nickname
from reviews r
left join profiles p on p.user_id = r.user_id
where r.hidden = false;

grant select on public_reviews to anon, authenticated;

create view eatery_stats as
select
  eatery_id,
  count(*)::int as review_count,
  round(avg(rating)::numeric, 1)::float as avg_rating
from public_reviews
group by eatery_id;

grant select on eatery_stats to anon, authenticated;