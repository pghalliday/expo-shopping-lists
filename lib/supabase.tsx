import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from '@supabase/supabase-js'
import {SyncDatabaseChangeSet, synchronize} from "@nozbe/watermelondb/sync";
import {database} from "~/model/database";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Session} from "@supabase/auth-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

export async function sync() {
    await synchronize({
        database,
        pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
            const {data, error} = await supabase.rpc('pull', {
                last_pulled_at: lastPulledAt,
            })
            const {changes, timestamp} = data as {
                changes: SyncDatabaseChangeSet
                timestamp: number
            }
            return {changes, timestamp}
        },
        pushChanges: async ({changes, lastPulledAt}) => {
            const {error} = await supabase.rpc('push', {changes})
        },
        sendCreatedAsUpdated: true,
    })
}

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
