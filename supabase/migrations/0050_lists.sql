create table lists
(
    id         uuid primary key,
    name       text                                           not null,
    updated_at timestamp_ms references changesets (timestamp) not null,
    deleted_at timestamp_ms references changesets (timestamp)
);

create index idx_lists_updated_at on lists (updated_at);
create index idx_lists_deleted_at on lists (deleted_at);

alter table lists
    enable row level security;

create table list_users
(
    id         uuid primary key,
    user_id    uuid references auth.users on delete cascade   not null,
    list_id    uuid references lists on delete cascade        not null,
    created_at timestamp_ms references changesets (timestamp) not null,
    deleted_at timestamp_ms references changesets (timestamp),
    -- The following unique constraint should ensure that users can only
    -- have 1 undeleted list membership per list
    unique nulls not distinct (user_id, list_id, deleted_at)
);

create index idx_list_users_user_id on list_users (user_id);
create index idx_list_users_list_id on list_users (list_id);
create index idx_list_users_created_at on list_users (created_at);
create index idx_list_users_deleted_at on list_users (deleted_at);

alter table list_users
    enable row level security;

create policy "Users can see their own list memberships." on list_users
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

-- Users should only be able to update the deleted_at field to indicate that
-- they have left a list
create policy "Users can leave lists." on list_users
    for update
    to authenticated
    using ((select auth.uid()) = user_id and deleted_at is null)
    with check ((select auth.uid()) = user_id);
create function on_update_list_user() returns trigger as
$$
begin
    new.id = old.id;
    new.user_id = old.user_id;
    new.list_id = old.list_id;
    new.created_at = old.created_at;
    return new;
end;
$$ language plpgsql;
create trigger on_update_list_user
    before update
    on list_users
    for each row
execute procedure on_update_list_user();

create function user_lists() returns setof uuid as
$$
select list_id
from list_users
where user_id = (select auth.uid())
  and deleted_at is null;
$$ language sql security definer;

create policy "Users can see other list users." on list_users
    for select
    to authenticated
    using (list_id in (select user_lists()));

create policy "Users can see lists they belong to." on lists
    for select
    to authenticated
    using (id in (select user_lists()));

create policy "Users can update lists they belong to." on lists
    for update
    to authenticated
    using (id in (select user_lists()));

create policy "Users can select profiles of users they share a list with." on profiles
    for select
    to authenticated
    using (user_id in (select user_id
                       from list_users
                       where list_id in (select user_lists())
                         and deleted_at is null));
