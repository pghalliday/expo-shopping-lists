import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";
import {asyncScheduler, EMPTY, exhaustMap, from, retry, Subject, throttleTime, timer} from "rxjs";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database as SupabaseDatabase} from "~/supabase/ts/supabase.types";
import {Database as WatermelonDatabase} from "@nozbe/watermelondb";
import {SyncDatabaseChangeSet, synchronize} from "@nozbe/watermelondb/sync";
import {inject, singleton} from "tsyringe";

import {DATABASE, SUPABASE, SYNC_RETRY_DELAY, SYNC_THROTTLE_DURATION} from "~/tsyringe/symbols";
import {SessionService} from "~/lib/services/SessionService";

@singleton()
export class SyncService {
    private readonly logger = new SyncLogger(1);
    private readonly syncNotifier = new Subject<void>();
    private running = false;

    constructor(
        @inject(SUPABASE) supabase: SupabaseClient<SupabaseDatabase>,
        @inject(DATABASE) database: WatermelonDatabase,
        @inject(SYNC_THROTTLE_DURATION) throttleDuration: number,
        @inject(SYNC_RETRY_DELAY) retryDelay: number,
        sessionService: SessionService,
    ) {
        sessionService.subscribe(session => {
            if (session) {
                this.start();
            } else {
                this.stop();
            }
        });
        this.syncNotifier
            .pipe(
                throttleTime(throttleDuration, asyncScheduler, {
                    leading: true,
                    trailing: true,
                }),
                exhaustMap(() => {
                    if (!this.running) {
                        return EMPTY;
                    }
                    return from(synchronize({
                        database,
                        log: this.logger.newLog(),
                        pullChanges: async ({lastPulledAt, schemaVersion, migration}) => {
                            const {data, error} = await supabase.rpc('pull', {
                                p_last_pulled_at: lastPulledAt,
                            })
                            if (error) throw error
                            const {changes, timestamp} = data as {
                                changes: SyncDatabaseChangeSet
                                timestamp: number
                            }
                            return {changes, timestamp}
                        },
                        pushChanges: async ({changes, lastPulledAt}) => {
                            const {error} = await supabase.rpc('push', {
                                p_last_pulled_at: lastPulledAt,
                                p_changes: changes,
                            })
                            if (error) throw error
                        },
                        sendCreatedAsUpdated: true,
                    }))
                }),
                retry({
                    delay: ((error, retryCount) => {
                        console.log(error);
                        console.log('SyncService: retryCount: ', retryCount);
                        return timer(retryDelay);
                    }),
                    resetOnSuccess: true,
                })
            )
            .subscribe(() => {
                console.log(this.logger.formattedLogs)
            });
    }

    requestSync() {
        if (this.running) {
            this.syncNotifier.next();
        }
    }

    private stop() {
        this.running = false;
    }

    private start() {
        this.running = true;
        this.requestSync();
    }
}