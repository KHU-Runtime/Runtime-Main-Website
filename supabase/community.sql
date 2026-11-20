-- Runtime; community board schema for a NEW Supabase project.
-- Run once in Supabase Dashboard > SQL Editor. No private service keys in frontend.
-- Auth email verification should be ON in Supabase Dashboard.
create extension if not exists pgcrypto;

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 120),
  category text not null check (category in ('해커톤','경진대회','공모전','개발 프로젝트','수상·소식')),
  event_date date not null,
  team text not null default '' check (char_length(team) <= 120),
  summary text not null check (char_length(btrim(summary)) between 3 and 300),
  body text not null check (char_length(btrim(body)) between 3 and 6000),
  award text not null default '' check (char_length(award) <= 200),
  cover_path text,
  attachments jsonb not null default '[]'::jsonb check (
    jsonb_typeof(attachments) = 'array' and jsonb_array_length(attachments) <= 5
  ),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint award_review_required check (
    status <> 'approved' or (category <> '수상·소식' and char_length(btrim(award)) = 0)
    or (category = '수상·소식' and char_length(btrim(award)) >= 0)
  )
);

-- The immutable identity fields are not editable from the browser.
create or replace function public.community_posts_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if new.author_id is distinct from old.author_id then
      raise exception 'Changing author_id is not allowed';
    end if;
    if new.created_at is distinct from old.created_at then
      raise exception 'Changing created_at is not allowed';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists community_posts_guard_trigger on public.community_posts;
create trigger community_posts_guard_trigger
before insert or update on public.community_posts
for each row execute function public.community_posts_guard();

-- Limit casual spam from the same signed-in user (5 posts/hour).
create or replace function public.community_posts_rate_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare recent_posts integer;
begin
  if tg_op = 'INSERT' then
    select count(*) into recent_posts
    from public.community_posts
    where author_id = new.author_id
      and created_at >= now() - interval '1 hour';
    if recent_posts >= 5 then
      raise exception '한 시간에 최대 5개의 게시물을 등록할 수 있습니다.';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists community_posts_rate_limit_trigger on public.community_posts;
create trigger community_posts_rate_limit_trigger
before insert on public.community_posts
for each row execute function public.community_posts_rate_limit();

alter table public.community_posts enable row level security;
grant select on public.community_posts to anon, authenticated;
grant insert, update, delete on public.community_posts to authenticated;

-- Anyone can read approved posts; authors also see their own unpublished entries.
drop policy if exists "read approved community posts" on public.community_posts;
create policy "read approved community posts" on public.community_posts
for select to anon, authenticated using (status = 'approved');
drop policy if exists "authors read own posts" on public.community_posts;
create policy "authors read own posts" on public.community_posts
for select to authenticated using (author_id = (select auth.uid()));
-- A moderator is designated only by trusted server-side app_metadata, not user_metadata.
drop policy if exists "moderators read all community posts" on public.community_posts;
create policy "moderators read all community posts" on public.community_posts
for select to authenticated using (auth.jwt()->'app_metadata'->>'community_role' = 'moderator');

-- Regular posts publish immediately. Claimed awards and award news await approval.
drop policy if exists "authors create posts" on public.community_posts;
create policy "authors create posts" on public.community_posts
for insert to authenticated with check (
  author_id = (select auth.uid())
  and (
    (category <> '수상·소식' and btrim(award) = '' and status = 'approved')
    or ((category = '수상·소식' or btrim(award) <> '') and status = 'pending')
  )
);
drop policy if exists "authors edit own posts" on public.community_posts;
create policy "authors edit own posts" on public.community_posts
for update to authenticated using (author_id = (select auth.uid()))
with check (
  author_id = (select auth.uid())
  and (
    (category <> '수상·소식' and btrim(award) = '' and status = 'approved')
    or ((category = '수상·소식' or btrim(award) <> '') and status = 'pending')
  )
);
drop policy if exists "authors delete own posts" on public.community_posts;
create policy "authors delete own posts" on public.community_posts
for delete to authenticated using (author_id = (select auth.uid()));
drop policy if exists "moderators review posts" on public.community_posts;
create policy "moderators review posts" on public.community_posts
for update to authenticated
using (auth.jwt()->'app_metadata'->>'community_role' = 'moderator')
with check (auth.jwt()->'app_metadata'->>'community_role' = 'moderator');

-- Public downloads are permitted, but uploading is restricted to verified users'
-- own UUID folder. This bucket must NEVER be used for confidential files.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('community-uploads','community-uploads',true,8388608,
  array['image/jpeg','image/png','image/webp','image/gif',
        'application/pdf','application/zip','application/x-zip-compressed',
        'text/csv','application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict (id) do update
set public = excluded.public, file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "users upload community files" on storage.objects;
create policy "users upload community files" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'community-uploads'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
drop policy if exists "users delete community files" on storage.objects;
create policy "users delete community files" on storage.objects
for delete to authenticated using (
  bucket_id = 'community-uploads'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Moderation example after verifying the award independently:
-- update public.community_posts
--   set status = 'approved'
-- where id = 'POST_UUID' and category = '수상·소식';
-- NEVER expose Supabase secret/service_role keys in Vite or GitHub source.
