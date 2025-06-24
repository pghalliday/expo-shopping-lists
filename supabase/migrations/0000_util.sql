create domain timestamp_ms as timestamp(3) with time zone;

create function epoch_to_timestamp(p_epoch bigint) returns timestamp_ms as
$$
begin
    return public.timestamp_ms 'epoch' + p_epoch * interval '1 millisecond';
end;
$$ language plpgsql;

create function timestamp_to_epoch(p_timestamp timestamp_ms) returns bigint as
$$
begin
    return (
        extract(
                epoch
                from p_timestamp
        ) * 1000
        )::bigint;
end;
$$ language plpgsql;
