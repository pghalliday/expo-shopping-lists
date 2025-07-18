create policy "Authenticated users can receive their own broadcasts."
    on "realtime"."messages"
    for select
    to authenticated
    using ((select realtime.topic()) = ('user:' || (select auth.uid())::text));

create policy "Authenticated users can send their own broadcasts."
    on "realtime"."messages"
    for insert
    to authenticated
    with check ((select realtime.topic()) = ('user:' || (select auth.uid())::text));
