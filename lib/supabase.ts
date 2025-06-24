import AsyncStorage from '@react-native-async-storage/async-storage'
import {createClient} from '@supabase/supabase-js'
import {Platform} from "react-native";
import {Database} from "~/lib/supabase.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        ... Platform.OS === 'web' ? {} : {storage: AsyncStorage},
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

export async function signOutSupabase() {
    const {error} = await supabase.auth.signOut({scope: 'local'});
    console.log(`supabase: signOut error: ${error}`);
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
