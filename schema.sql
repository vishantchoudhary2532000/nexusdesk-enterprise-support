-- Create tickets table
create table tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text not null,
  priority text not null,
  status text default 'open',
  attachment_url text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table tickets enable row level security;

-- Policy: Users can only view their own tickets
create policy "Users can view only their own tickets" on tickets
  for select using (auth.uid() = user_id);

-- Policy: Users can only insert their own tickets
create policy "Users can insert only their own tickets" on tickets
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own tickets (optional but good for a full app, adding to be safe)
create policy "Users can update their own tickets" on tickets
  for update using (auth.uid() = user_id);

-- Enable realtime for the tickets table
alter publication supabase_realtime add table tickets;

-- Create storage bucket for support files
insert into storage.buckets (id, name, public) values ('support-files', 'support-files', true);

-- Storage policy: authenticated users can upload files to support-files bucket
create policy "Authenticated users can upload files" on storage.objects
  for insert with check ( bucket_id = 'support-files' and auth.role() = 'authenticated' );

-- Storage policy: everyone can view files from support-files bucket (since it's public)
create policy "Anyone can view files" on storage.objects
  for select using ( bucket_id = 'support-files' );

-- ==============================================================================
-- PHASE 2 UPDATES (Run these in your Supabase SQL Editor if upgrading existing DB)
-- ==============================================================================

-- 1. Add new columns
alter table tickets add column if not exists category text;
alter table tickets add column if not exists updated_at timestamp with time zone default now();

-- 2. Add Delete Policy (Insert, Select, and Update already exist above)
create policy "Users can delete only their own tickets" on tickets
  for delete using (auth.uid() = user_id);

-- ==============================================================================
-- PHASE 3 UPDATES (Real-time Collaborative Support System)
-- ==============================================================================

-- 1. Create ticket_messages table
create table if not exists ticket_messages (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references tickets(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  message text not null,
  attachment_url text,
  created_at timestamp with time zone default now()
);

-- RLS for ticket_messages
alter table ticket_messages enable row level security;
create policy "Users can read messages for their own tickets" on ticket_messages
  for select using ( 
    exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()) 
  );
create policy "Users can insert messages for their own tickets" on ticket_messages
  for insert with check ( 
    exists (select 1 from tickets where tickets.id = ticket_messages.ticket_id and tickets.user_id = auth.uid()) 
  );

-- 2. Create notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- RLS for notifications
alter table notifications enable row level security;
create policy "Users can only read their own notifications" on notifications
  for select using (auth.uid() = user_id);
create policy "Users can only update their own notifications" on notifications
  for update using (auth.uid() = user_id);

-- 3. Storage bucket for ticket-files
insert into storage.buckets (id, name, public) values ('ticket-files', 'ticket-files', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload ticket files" on storage.objects
  for insert with check ( bucket_id = 'ticket-files' and auth.role() = 'authenticated' );

create policy "Anyone can view ticket files" on storage.objects
  for select using ( bucket_id = 'ticket-files' );

-- 4. Enable realtime for new tables
alter publication supabase_realtime add table ticket_messages;
alter publication supabase_realtime add table notifications;


-- ==============================================================================
-- PHASE 4/6 UPDATES (Multi-Tenant SaaS Platform)
-- ==============================================================================

-- 1. Create Organizations Table
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now()
);

-- 2. Create Organization Members Table
create table if not exists organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default now(),
  unique(organization_id, user_id)
);

-- 3. Update Tickets Table
alter table tickets add column if not exists organization_id uuid references organizations(id);
alter table tickets add column if not exists assigned_to uuid references auth.users(id);

-- 4. Enable RLS
alter table organizations enable row level security;
alter table organization_members enable row level security;

-- 5. Helper Functions to avoid infinite recursion
create or replace function public.get_user_organizations()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  select organization_id from organization_members where user_id = auth.uid();
$$;

create or replace function public.is_org_owner(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_org_admin_or_owner(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid() and role in ('admin', 'owner')
  );
$$;

-- 5a. RLS Policies for Organizations
drop policy if exists "Users can view orgs they belong to" on organizations;
create policy "Users can view orgs they belong to" on organizations
  for select using (
    id in (select get_user_organizations())
  );

-- 6. RLS Policies for Organization Members
drop policy if exists "Users can view members of their orgs" on organization_members;
create policy "Users can view members of their orgs" on organization_members
  for select using (
    organization_id in (select get_user_organizations())
  );

drop policy if exists "Owners can insert members" on organization_members;
create policy "Owners can insert members" on organization_members
  for insert with check (
    is_org_owner(organization_id)
  );

drop policy if exists "Owners can update members" on organization_members;
create policy "Owners can update members" on organization_members
  for update using (
    is_org_owner(organization_id)
  );

drop policy if exists "Owners can delete members" on organization_members;
create policy "Owners can delete members" on organization_members
  for delete using (
    is_org_owner(organization_id)
  );

-- 7. Replace Old Ticket RLS Policies with Multi-Tenant RLS
drop policy if exists "Users can view only their own tickets" on tickets;
drop policy if exists "Users can insert only their own tickets" on tickets;
drop policy if exists "Users can update their own tickets" on tickets;
drop policy if exists "Users can delete only their own tickets" on tickets;

drop policy if exists "Users can view tickets in their org" on tickets;
create policy "Users can view tickets in their org" on tickets
  for select using (
    organization_id in (select get_user_organizations()) OR auth.uid() = user_id
  );

drop policy if exists "Users can insert tickets in their org" on tickets;
create policy "Users can insert tickets in their org" on tickets
  for insert with check (
    organization_id in (select get_user_organizations()) OR auth.uid() = user_id
  );

drop policy if exists "Admins and owners can update tickets" on tickets;
create policy "Admins and owners can update tickets" on tickets
  for update using (
    is_org_admin_or_owner(organization_id) OR auth.uid() = user_id
  );

drop policy if exists "Admins and owners can delete tickets" on tickets;
create policy "Admins and owners can delete tickets" on tickets
  for delete using (
    is_org_admin_or_owner(organization_id) OR auth.uid() = user_id
  );

-- 8. Backfill existing data
DO $$
DECLARE
    u_record RECORD;
    new_org_id UUID;
BEGIN
    FOR u_record IN SELECT distinct user_id FROM tickets WHERE organization_id IS NULL LOOP
        -- Create a personal org for this user
        INSERT INTO organizations (name, owner_id)
        VALUES ('Personal Org', u_record.user_id)
        RETURNING id INTO new_org_id;
        
        -- Insert user as owner
        INSERT INTO organization_members (organization_id, user_id, role)
        VALUES (new_org_id, u_record.user_id, 'owner');
        
        -- Update their tickets
        UPDATE tickets SET organization_id = new_org_id WHERE user_id = u_record.user_id;
    END LOOP;
END $$;

-- 9. Postgres trigger for auto-organization creation on new user signup
create or replace function public.handle_new_user_org()
returns trigger as $$
declare
    new_org_id uuid;
begin
    insert into public.organizations (name, owner_id)
    values (coalesce(new.email, new.id::text) || '''s Team', new.id)
    returning id into new_org_id;

    insert into public.organization_members (organization_id, user_id, role)
    values (new_org_id, new.id, 'owner');

    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_org on auth.users;
create trigger on_auth_user_created_org
  after insert on auth.users
  for each row execute procedure public.handle_new_user_org();

-- ==============================================================================
-- PHASE 7 UPDATES (Advanced SaaS Capabilities)
-- ==============================================================================

-- 1. Add summary to tickets
alter table tickets add column if not exists summary text;

-- 2. Create reply_templates table
create table if not exists reply_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- RLS for reply_templates
alter table reply_templates enable row level security;
drop policy if exists "Users can view templates for their orgs" on reply_templates;
create policy "Users can view templates for their orgs" on reply_templates
  for select using (
    organization_id in (select get_user_organizations())
  );
drop policy if exists "Admins and owners can insert templates" on reply_templates;
create policy "Admins and owners can insert templates" on reply_templates
  for insert with check (
    is_org_admin_or_owner(organization_id)
  );
drop policy if exists "Admins and owners can update templates" on reply_templates;
create policy "Admins and owners can update templates" on reply_templates
  for update using (
    is_org_admin_or_owner(organization_id)
  );
drop policy if exists "Admins and owners can delete templates" on reply_templates;
create policy "Admins and owners can delete templates" on reply_templates
  for delete using (
    is_org_admin_or_owner(organization_id)
  );

-- 3. Create activity_logs table
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamp with time zone default now()
);

-- RLS for activity_logs
alter table activity_logs enable row level security;
drop policy if exists "Users can view activity logs for their org" on activity_logs;
create policy "Users can view activity logs for their org" on activity_logs
  for select using (
    organization_id in (select get_user_organizations())
  );
drop policy if exists "Users can insert activity logs for their org" on activity_logs;
create policy "Users can insert activity logs for their org" on activity_logs
  for insert with check (
    organization_id in (select get_user_organizations())
  );

-- 4. Create usage_metrics table
create table if not exists usage_metrics (
  organization_id uuid references organizations(id) on delete cascade primary key,
  tickets_created integer default 0,
  members_count integer default 1,
  period text not null
);

-- RLS for usage_metrics
alter table usage_metrics enable row level security;
drop policy if exists "Users can view usage for their org" on usage_metrics;
create policy "Users can view usage for their org" on usage_metrics
  for select using (
    organization_id in (select get_user_organizations())
  );
drop policy if exists "Users can update usage for their org" on usage_metrics;
create policy "Users can update usage for their org" on usage_metrics
  for update using (
    organization_id in (select get_user_organizations())
  );
drop policy if exists "Users can insert usage for their org" on usage_metrics;
create policy "Users can insert usage for their org" on usage_metrics
  for insert with check (
    organization_id in (select get_user_organizations())
  );

-- ==============================================================================
-- PHASE 8 UPDATES (Launch-Ready SaaS Product)
-- ==============================================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 2. Trigger to create a profile automatically when a user signs up
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- 3. Storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Anyone can view avatars" on storage.objects
  for select using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatars" on storage.objects
  for insert with check ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can update their own avatars" on storage.objects
  for update using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own avatars" on storage.objects
  for delete using ( bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1] );

-- ==============================================================================
-- PHASE 9 UPDATES (Performance & Index Optimization)
-- ==============================================================================

-- --------------------------------------------------
-- 1. Tickets table indexes
-- --------------------------------------------------

-- Query: get user tickets
create index if not exists idx_tickets_user_id
on tickets(user_id);

-- Query: org based ticket listing
create index if not exists idx_tickets_organization_id
on tickets(organization_id);

-- Query: ticket status filtering
create index if not exists idx_tickets_status
on tickets(status);

-- Query: ticket priority filtering
create index if not exists idx_tickets_priority
on tickets(priority);

-- Query: assigned tickets
create index if not exists idx_tickets_assigned_to
on tickets(assigned_to);

-- Query: sorting by created_at
create index if not exists idx_tickets_created_at
on tickets(created_at desc);



-- --------------------------------------------------
-- 2. Ticket messages indexes
-- --------------------------------------------------

-- Query: load messages for ticket
create index if not exists idx_ticket_messages_ticket_id
on ticket_messages(ticket_id);

-- Query: user messages
create index if not exists idx_ticket_messages_user_id
on ticket_messages(user_id);

-- Query: message ordering
create index if not exists idx_ticket_messages_created_at
on ticket_messages(created_at desc);



-- --------------------------------------------------
-- 3. Notifications indexes
-- --------------------------------------------------

-- Query: get user notifications
create index if not exists idx_notifications_user_id
on notifications(user_id);

-- Query: unread notifications
create index if not exists idx_notifications_is_read
on notifications(is_read);

-- Query: notification ordering
create index if not exists idx_notifications_created_at
on notifications(created_at desc);



-- --------------------------------------------------
-- 4. Organization members indexes
-- --------------------------------------------------

-- Query: find members of org
create index if not exists idx_org_members_org_id
on organization_members(organization_id);

-- Query: find organizations of user
create index if not exists idx_org_members_user_id
on organization_members(user_id);



-- --------------------------------------------------
-- 5. Activity logs indexes
-- --------------------------------------------------

-- Query: org activity timeline
create index if not exists idx_activity_logs_org_id
on activity_logs(organization_id);

-- Query: entity lookup
create index if not exists idx_activity_logs_entity
on activity_logs(entity_type, entity_id);

-- Query: activity ordering
create index if not exists idx_activity_logs_created_at
on activity_logs(created_at desc);



-- --------------------------------------------------
-- 6. Reply templates indexes
-- --------------------------------------------------

create index if not exists idx_reply_templates_org
on reply_templates(organization_id);



-- --------------------------------------------------
-- 7. Usage metrics index
-- --------------------------------------------------

create index if not exists idx_usage_metrics_org
on usage_metrics(organization_id);

-- ==============================================================================
-- PHASE 10 UPDATES (Production AI Integration)
-- ==============================================================================

-- 1. Add AI Usage Tracking
alter table usage_metrics add column if not exists ai_requests integer default 0;

-- 2. Create AI Cache Table
create table if not exists ai_cache (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  ticket_id uuid references tickets(id) on delete cascade not null,
  type text not null check (type in ('summary', 'reply')),
  content text not null,
  created_at timestamp with time zone default now(),
  unique(ticket_id, type)
);

-- 3. RLS for AI Cache
alter table ai_cache enable row level security;

drop policy if exists "Users can view AI cache for their org" on ai_cache;
create policy "Users can view AI cache for their org" on ai_cache
  for select using ( organization_id in (select get_user_organizations()) );

drop policy if exists "Users can insert AI cache for their org" on ai_cache;
create policy "Users can insert AI cache for their org" on ai_cache
  for insert with check ( organization_id in (select get_user_organizations()) );

-- 4. Index for exact cache hits
create index if not exists idx_ai_cache_lookup
on ai_cache(ticket_id, type);
