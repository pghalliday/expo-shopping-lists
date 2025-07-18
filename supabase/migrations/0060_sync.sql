create function push_internal(p_id uuid, p_user_id uuid, p_last_pulled_at bigint, p_changes jsonb) returns jsonb as
$$
declare
    v_last_pulled_at public.timestamp_ms;
    v_timestamp      public.timestamp_ms;
begin
    v_last_pulled_at := public.epoch_to_timestamp(coalesce(p_last_pulled_at, 0));
    insert into public.changesets (id, timestamp, user_id, changes, last_pulled_at)
    values (p_id, public.timestamp_ms 'epoch', p_user_id, p_changes, v_last_pulled_at)
    returning timestamp into v_timestamp;
    return jsonb_build_object(
            'timestamp',
            public.timestamp_to_epoch(v_timestamp)
           );
end;
$$ language plpgsql;

create function push(p_id uuid, p_last_pulled_at bigint, p_changes jsonb) returns jsonb as
$$
select public.push_internal(p_id, (select auth.uid()), p_last_pulled_at, p_changes);
$$ language sql;

create function pull(p_last_pulled_at bigint default 0) returns jsonb as
$$
declare
    v_last_pulled_at public.timestamp_ms;
    v_timestamp      public.timestamp_ms;
    v_profiles       jsonb;
begin
    v_last_pulled_at := public.epoch_to_timestamp(coalesce(p_last_pulled_at, 0));
    v_timestamp := public.get_timestamp_state('changesets_last_timestamp');
    v_profiles := public.pull_profiles(v_last_pulled_at);
    return jsonb_build_object(
            'changes',
            jsonb_build_object(
                    'profiles',
                    v_profiles
            ),
            'timestamp',
            public.timestamp_to_epoch(v_timestamp)
           );
end;
$$ language plpgsql;

create function after_insert_changeset() returns trigger as
$$
begin
    perform realtime.send(jsonb_build_object(
                                  'id',
                                  new.id,
                                  'timestamp',
                                  public.timestamp_to_epoch(new.timestamp)
                          ),
                          'change',
                          topic,
                          true)
    from (select public.push_profiles(new.timestamp, new.last_pulled_at,
                                      coalesce(new.changes -> 'profiles', '[]'::jsonb))) as channels(topic);
    return new;
end;
$$ language plpgsql;
create trigger after_insert_changeset
    after insert
    on changesets
    for each row
execute procedure after_insert_changeset();
