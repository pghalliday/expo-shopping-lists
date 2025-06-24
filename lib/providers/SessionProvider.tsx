import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/auth-js";
import assert from "assert";
import {SessionService} from "~/lib/services/SessionService";

const SupabaseSessionContext = createContext<Session | null | undefined>(null);

export function SessionProvider({service, children}: PropsWithChildren<{service: SessionService}>) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        service.subscribe(session => {
            setSession(session);
        });
    }, []);

    return (
        <SupabaseSessionContext.Provider value={session}>
            {children}
        </SupabaseSessionContext.Provider>
    );
}

export function useSupabaseSession() {
    const session = useContext(SupabaseSessionContext);
    assert(session !== undefined, 'Attempted to call useSession() outside of <SupabaseSessionProvider>');
    return session;
}
