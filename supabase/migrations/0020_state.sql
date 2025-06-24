create table state
(
    k           text primary key,
    text_v      text,
    bigint_v    bigint,
    timestamp_v timestamp_ms
);

alter table state
    enable row level security;

create policy "Users can read the state values." on state
    for select
    to authenticated
    using (true);

create function get_text_state(p_k text) returns text as
$$
select text_v
from public.state
where k = p_k;
$$ language sql;

create function set_text_state(p_k text, p_v text) returns void as
$$
insert into public.state (k, text_v)
values (p_k, p_v)
on conflict (k) do update set text_v = p_v;
$$ language sql;

create function get_bigint_state(p_k text) returns bigint as
$$
select bigint_v
from public.state
where k = p_k;
$$ language sql;

create function set_bigint_state(p_k text, p_v bigint) returns void as
$$
insert into public.state (k, bigint_v)
values (p_k, p_v)
on conflict (k) do update set bigint_v = p_v;
$$ language sql;

create function get_timestamp_state(p_k text) returns timestamp_ms as
$$
select timestamp_v
from public.state
where k = p_k;
$$ language sql;

create function set_timestamp_state(p_k text, p_v timestamp_ms) returns void as
$$
insert into public.state (k, timestamp_v)
values (p_k, p_v)
on conflict (k) do update set timestamp_v = p_v;
$$ language sql;

