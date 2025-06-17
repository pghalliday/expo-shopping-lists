import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from '@supabase/supabase-js'
import {SyncDatabaseChangeSet, synchronize} from "@nozbe/watermelondb/sync";
import {database} from "~/model/database";
import {Platform} from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        ... Platform.OS === 'web' ? {} : {storage: AsyncStorage},
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

export async function signOutSupabase() {
    const {error} = await supabase.auth.signOut({scope: 'local'});
    console.log(`signOut error: ${error}`);
    // TODO: sometimes we get an AuthSessionMissingError even though there seems
    // TODO: to be a session. This may be related to a refresh of the app and the
    // TODO: following code works around the problem by setting the session again
    // TODO: before trying to signOut
    // const {data: {session}, error} = await supabase.auth.getSession();
    // console.log(`getSession error: ${error}`);
    // console.log(`getSession session: ${session}`);
    // await supabase.auth.setSession(session!);
    // const {error} = await supabase.auth.signOut({scope: 'local'});
    // console.log(`signOut error: ${error}`);
}

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
