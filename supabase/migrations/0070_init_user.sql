create function init_user() returns trigger as
$$
begin
    perform public.push_internal(
            new.id,
            0,
            jsonb_build_object(
                    'profiles',
                    jsonb_build_object(
                            'created',
                            jsonb_build_array(
                                    jsonb_build_object(
                                            'id',
                                            gen_random_uuid(),
                                            'user_id',
                                            new.id,
                                            'display_name',
                                            new.email
                                    )
                            )
                    )
            )
            );
    return new;
end;
$$ language plpgsql security definer;
create trigger init_user
    after insert
    on auth.users
    for each row
execute procedure init_user();
