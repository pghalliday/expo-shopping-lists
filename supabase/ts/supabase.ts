import {createClient} from "@supabase/supabase-js";
import {Database} from "~/supabase/ts/supabase.types";
import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        ...Platform.OS === 'web' ? {} : {storage: AsyncStorage},
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
