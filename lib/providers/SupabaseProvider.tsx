import * as React from "react";
import {createContext, PropsWithChildren, useContext} from "react";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "~/supabase/ts/supabase.types";
import assert from "assert";

const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(undefined);

export function SupabaseProvider({supabase, children}: PropsWithChildren<{ supabase: SupabaseClient<Database> }>) {
    return <SupabaseContext.Provider value={supabase}>
        {children}
    </SupabaseContext.Provider>
}

export function useSupabase() {
    const supabase = useContext(SupabaseContext);
    assert(supabase, 'Attempted to call useSupabase() outside of <SupabaseProvider>');
    return supabase;
}
