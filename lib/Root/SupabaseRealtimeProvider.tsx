import {createContext, PropsWithChildren, useContext, useEffect, useRef, useState} from "react";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {supabase} from "~/lib/supabase";
import {REALTIME_LISTEN_TYPES, RealtimeChannel} from "@supabase/realtime-js";
import {Subject} from "rxjs";

export interface SupabaseRealtimeEvent {
    topic: string
    payload: {
        [p: string]: any
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`
        event: string
    }
}

const SupabaseRealtimeContext = createContext<Subject<SupabaseRealtimeEvent> | undefined>(undefined);

export function SupabaseRealtimeProvider({children}: PropsWithChildren<{}>) {
    const [realtimeEvents, setRealtimeEvents] = useState<Subject<SupabaseRealtimeEvent>>();
    const session = useSupabaseSession();
    const userChannel = useRef<RealtimeChannel>(undefined);

    useEffect(() => {
        // TODO: wait for unsubscribe to complete before subscribing
        async function refreshSubscription() {
            if (userChannel.current) {
                const status = await userChannel.current.unsubscribe(5000);
                console.log('SupabaseRealtimeProvider: userChannel: unsubscribe: ', status);
                userChannel.current = undefined;
                realtimeEvents?.complete();
                setRealtimeEvents(undefined);
            }
            if (session) {
                const events = new Subject<SupabaseRealtimeEvent>();
                setRealtimeEvents(events);
                const topic = `user:${session.user.id}`;
                console.log('SupabaseRealtimeProvider: userChannel: subscribe:', topic);
                userChannel.current = supabase.channel(topic, {
                    config: {
                        broadcast: {
                            self: true,
                        },
                        private: true,
                    },
                })
                    .on(
                        'broadcast',
                        {event: '*'}, // Listen for "shout". Can be "*" to listen to all events
                        (payload) => events.next({
                            topic,
                            payload,
                        })
                    )
                    .subscribe((status, err) => {
                        console.log('SupabaseRealtimeProvider: on subscribe: status:', status);
                        console.log('SupabaseRealtimeProvider: on subscribe: err:', err);
                    }, 5000)
            }
        }
        refreshSubscription();
    }, [session]);

    return (
        <SupabaseRealtimeContext.Provider value={realtimeEvents}>
            {children}
        </SupabaseRealtimeContext.Provider>
    );
}

export function useSupabaseRealtime() {
    return useContext(SupabaseRealtimeContext);
}
