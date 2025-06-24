import {container} from "tsyringe";
import {supabase} from "~/supabase/ts/supabase";
import {database} from "~/model/database";
import {DATABASE, SUPABASE, SYNC_RETRY_DELAY, SYNC_THROTTLE_DURATION} from "~/tsyringe/symbols";

export function configure() {
    container.register(SUPABASE, {useValue: supabase});
    container.register(DATABASE, {useValue: database});
    container.register(SYNC_THROTTLE_DURATION, {useValue: 5000});
    container.register(SYNC_RETRY_DELAY, {useValue: 2000});
}
