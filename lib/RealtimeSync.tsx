import {useSync} from "~/lib/Root/SyncProvider";
import {useSupabaseRealtime} from "~/lib/Root/SupabaseRealtimeProvider";
import {useEffect} from "react";

export function RealtimeSync() {
    const realtimeEvents = useSupabaseRealtime();
    const sync = useSync();

    useEffect(() => {
        if (realtimeEvents && sync) {
            realtimeEvents.subscribe((event) => {
                console.log('SyncProvider: realtimeEvents: ', event);
                sync();
            })
        }
    }, [realtimeEvents, sync]);

    return null;
}