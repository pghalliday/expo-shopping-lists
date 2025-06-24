create policy "Authenticated users can receive their own broadcasts."
    on "realtime"."messages"
    for select
    to authenticated
    using ((select realtime.topic()) = ('user:' || (select auth.uid())::text));
