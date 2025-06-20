-- Create a table for lists
create table lists
(
    id         uuid not null primary key default gen_random_uuid(),
    name       text not null,
    created_at date,
    updated_at date
);

-- Create a table for list users
create table list_users
(
    id      uuid                                         not null primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    list_id uuid references lists on delete cascade      not null
);

-- Create a table for list invites
create table list_invites
(
    id      uuid                                    not null primary key default gen_random_uuid(),
    email   text                                    not null,
    list_id uuid references lists on delete cascade not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table lists
    enable row level security;
alter table list_users
    enable row level security;
alter table list_invites
    enable row level security;

create policy "Users can update lists they belong to." on lists
    for update using ((select auth.uid()) in (select user_id
                                              from list_users
                                              where list_id = id));

create policy "Users can leave lists." on list_users
    for delete using ((select auth.uid()) = user_id);

create policy "Users can invite to lists they belong to." on list_invites
    for insert with check ((select auth.uid()) in (select user_id
                                                   from list_users
                                                   where list_id = id));

create policy "Users can select profiles of users they share a list with." on profiles
    for select using ((select auth.uid()) in (select user_id
                                              from list_users
                                              where list_id in (select list_id from list_users where user_id = id)));

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user_initial_list()
    returns trigger
    set search_path = ''
as
$$
begin
    if new.raw_user_meta_data ->> 'firstRun' then
        with new_list as (
            insert into public.lists (name)
                values ('My first list')
                returning id)
        insert
        into public.list_users (user_id, list_id)
        values (new.id, (select id from new_list));
    end if;
    return new;
end;
$$ language plpgsql security definer;
create trigger handle_new_user_initial_list
    after insert
    on auth.users
    for each row
execute procedure public.handle_new_user_initial_list();
