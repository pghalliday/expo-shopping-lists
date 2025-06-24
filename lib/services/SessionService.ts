import {inject, singleton} from "tsyringe";
import {SUPABASE} from "~/tsyringe/symbols";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "~/supabase/ts/supabase.types";
import {BehaviorSubject} from "rxjs";
import {Session} from "@supabase/auth-js";

@singleton()
export class SessionService extends BehaviorSubject<Session | null> {
    constructor(
        @inject(SUPABASE) supabase: SupabaseClient<Database>,
    ) {
        super(null);
        supabase.auth.getSession().then(({data: {session}}) => {
            this.next(session);
        });
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('SessionService: onAuthStateChange: event: ', event);
            console.log('SessionService: onAuthStateChange: session: ', session);
            this.next(session);
        });
    }
}
