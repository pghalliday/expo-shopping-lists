import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/auth-js";
import {supabase} from "~/lib/supabase";

const SupabaseSessionContext = createContext<Session | null>(null);

export function SupabaseSessionProvider({children}: PropsWithChildren<{}>) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
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
    return useContext(SupabaseSessionContext);
}
