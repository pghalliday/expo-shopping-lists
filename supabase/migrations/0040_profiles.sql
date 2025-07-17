create table profiles
(
    id           uuid primary key,
    user_id      uuid references auth.users on delete cascade   not null,
    display_name text                                           not null,
    created_at   timestamp_ms references changesets (timestamp) not null,
    updated_at   timestamp_ms references changesets (timestamp) not null,
    deleted_at   timestamp_ms references changesets (timestamp),
    -- The following unique constraint should ensure that only 1
    -- undeleted profile exists for each user
    unique nulls not distinct (user_id, deleted_at)
);

create index idx_profiles_user_id on profiles (user_id);
create index idx_profiles_created_at on profiles (created_at);
create index idx_profiles_updated_at on profiles (updated_at);
create index idx_profiles_deleted_at on profiles (deleted_at);

alter table profiles
    enable row level security;

create policy "Users can select their own profile." on profiles
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

-- This policy also prevents a user deleting their profile
create policy "Users can update their own profile." on profiles
    for update
    to authenticated
    using ((select auth.uid()) = user_id and deleted_at is null);

create function create_update_profile(
    p_id uuid,
    p_user_id uuid,
    p_display_name text,
    p_timestamp timestamp_ms,
    p_last_pulled_at timestamp_ms
) returns void as
$$
declare
    v_id         uuid;
    v_updated_at public.timestamp_ms;
    v_deleted_at public.timestamp_ms;
begin
    select id, updated_at, deleted_at
    into v_id, v_updated_at, v_deleted_at
    from public.profiles
    where id = p_id;
    if v_id is null then
        insert into public.profiles (id,
                                     user_id,
                                     display_name,
                                     created_at,
                                     updated_at)
        values (p_id,
                p_user_id,
                p_display_name,
                p_timestamp,
                p_timestamp);
    else
        if v_deleted_at is null then
            if v_updated_at > p_last_pulled_at then
                raise exception 'create_update_profile: Profile with id (%) has been updated since the last pull: updated (%): pulled (%)', v_id, v_updated_at, p_last_pulled_at;
            else
                update public.profiles
                set user_id      = p_user_id,
                    display_name = p_display_name,
                    updated_at   = p_timestamp
                where id = v_id;
            end if;
        else
            raise exception 'create_update_profile: Profile with id (%) has already been deleted (%)', v_id, v_deleted_at;
        end if;
    end if;
end;
$$ language plpgsql;

create function delete_profile(
    p_id uuid,
    p_timestamp timestamp_ms,
    p_last_pulled_at timestamp_ms
) returns void as
$$
declare
    v_id         uuid;
    v_updated_at public.timestamp_ms;
    v_deleted_at public.timestamp_ms;
begin
    select id, updated_at, deleted_at
    into v_id, v_updated_at, v_deleted_at
    from public.profiles
    where id = p_id;
    if v_id is null then
        -- do nothing
    else
        if v_deleted_at is null then
            if v_updated_at > p_last_pulled_at then
                raise exception 'delete_profile: Profile with id (%) has been updated since the last pull: updated (%): pulled (%)', v_id, v_updated_at, p_last_pulled_at;
            else
                update public.profiles
                set deleted_at = p_timestamp
                where id = p_id;
            end if;
        end if;
    end if;
end;
$$ language plpgsql;

create function push_profiles(
    p_timestamp timestamp_ms,
    p_last_pulled_at timestamp_ms,
    p_changes jsonb
) returns void as
$$
with created_or_updated
         as (select jsonb_array_elements(
                            coalesce(p_changes -> 'created', '[]'::jsonb) ||
                            coalesce(p_changes -> 'updated', '[]'::jsonb)
                    ) as json)
select public.create_update_profile(
               (json ->> 'id')::uuid,
               (json ->> 'user_id')::uuid,
               json ->> 'display_name',
               p_timestamp,
               p_last_pulled_at
       )
from created_or_updated;
with deleted as (select jsonb_array_elements_text(coalesce(p_changes -> 'deleted', '[]'::jsonb))::uuid as id)
select public.delete_profile(id, p_timestamp, p_last_pulled_at)
from deleted;
$$ language sql;

create function pull_profiles(
    p_last_pulled_at timestamp_ms
) returns jsonb as
$$
select jsonb_build_object(
               'created',
-- don't bother with created, just add everything as updated
               '[]'::jsonb,
               'updated',
               coalesce(jsonb_agg(jsonb_build_object(
                       'id',
                       id,
                       'user_id',
                       user_id,
                       'display_name',
                       display_name,
                       'created_at',
                       timestamp_to_epoch(created_at),
                       'updated_at',
                       timestamp_to_epoch(updated_at)
                                  )) filter (
                            where deleted_at is null
                       and updated_at > p_last_pulled_at
                            ),
                        '[]'::jsonb),
               'deleted',
               coalesce(jsonb_agg(to_jsonb(id)) filter (
                   where deleted_at > p_last_pulled_at
                   ),
                        '[]'::jsonb)
       )
from public.profiles;
$$ language sql;

create function broadcast_own_profile_changes()
    returns trigger
    security definer
    language plpgsql
as
$$
begin
    perform realtime.broadcast_changes(
            'user:' || coalesce(new.user_id, old.user_id)::text, -- topic - the topic to which we're broadcasting
            TG_OP, -- event - the event that triggered the function
            TG_OP, -- operation - the operation that triggered the function
            TG_TABLE_NAME, -- table - the table that caused the trigger
            TG_TABLE_SCHEMA, -- schema - the schema of the table that caused the trigger
            new, -- new record - the record after the change
            old -- old record - the record before the change
            );
    return null;
end;
$$;

create trigger broadcast_own_profile_changes
    after insert or update or delete
    on public.profiles
    for each row
execute function broadcast_own_profile_changes();
