-- Create a table for public profiles
create table profiles
(
    id   uuid references auth.users on delete cascade not null primary key,
    name text                                         not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table profiles
    enable row level security;

create policy "Users can select their own profile." on profiles
    for select using ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
    for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
    returns trigger
    set search_path = ''
as
$$
begin
    insert into public.profiles (id, name)
        values (new.id, new.email);
    return new;
end;
$$ language plpgsql security definer;
create trigger handle_new_user
    after insert
    on auth.users
    for each row
execute procedure public.handle_new_user();
