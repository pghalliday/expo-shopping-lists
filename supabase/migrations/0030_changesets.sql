create table changesets
(
    timestamp      timestamp_ms primary key,
    user_id        uuid         references auth.users on delete set null,
    changes        jsonb        not null,
    last_pulled_at timestamp_ms not null
);

create index idx_changeset_user_id on changesets (user_id);

alter table changesets
    enable row level security;

create policy "Users can select their own changesets." on changesets
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

create policy "Users can insert changesets." on changesets
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

create function before_insert_changeset() returns trigger as
$$
declare
    v_timestamp      public.timestamp_ms;
    v_last_timestamp public.timestamp_ms;
begin
    v_timestamp := now();
    v_last_timestamp := public.get_timestamp_state('changesets_last_timestamp');
    if v_last_timestamp >= v_timestamp then
        v_timestamp := v_last_timestamp + interval '1 milliseconds';
    end if;
    perform public.set_timestamp_state('changesets_last_timestamp', v_timestamp);
    new.timestamp = v_timestamp;
    return new;
end;
$$ language plpgsql security definer;
create trigger before_insert_changeset
    before insert
    on changesets
    for each row
execute procedure before_insert_changeset();
