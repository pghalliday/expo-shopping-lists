import {inject, singleton} from "tsyringe";
import {from, mergeMap, Subject} from "rxjs";
import {REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES, RealtimeChannel} from "@supabase/realtime-js";
import {SUPABASE} from "~/tsyringe/symbols";
import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "~/supabase/ts/supabase.types";

export interface RealtimeEvent {
    topic: string
    payload: {
        [p: string]: any
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`
        event: string
    }
}

type AddAction = {
    type: 'ADD',
    topic: string,
};

type RemoveAction = {
    type: 'REMOVE',
    topic: string,
};

type Action = AddAction | RemoveAction;

@singleton()
export class RealtimeChannels extends Subject<RealtimeEvent> {
    private readonly actions = new Subject<Action>();
    private readonly channels: Record<string, RealtimeChannel> = {};

    constructor(
        @inject(SUPABASE) private readonly supabase: SupabaseClient<Database>,
    ) {
        super();
        this.actions.pipe(
            mergeMap(action => {
                console.log(`RealtimeChannels: action:`, action);
                switch (action.type) {
                    case "ADD":
                        return from(this.doAdd(action.topic));
                    case "REMOVE":
                        return from(this.doRemove(action.topic));
                }
            })
        ).subscribe();
    }

    add(topic: string) {
        this.actions.next({type: "ADD", topic});
    }

    remove(topic: string) {
        this.actions.next({type: "REMOVE", topic});
    }

    private subscribeToChannel(topic: string) {
        return new Promise<RealtimeChannel>((resolve, reject) => {
            const channel = this.supabase.channel(topic, {config: {private: true}});
            channel.on(
                'broadcast',
                {event: '*'}, // "*" to listen to all events
                (payload) => this.next({
                    topic,
                    payload,
                })
            );
            try {
                channel.subscribe((status, err) => {
                    console.log(`RealtimeChannels: ${topic}: subscribe:`, status);
                    switch (status) {
                        case REALTIME_SUBSCRIBE_STATES.SUBSCRIBED:
                            resolve(channel);
                            break;
                        case REALTIME_SUBSCRIBE_STATES.CLOSED:
                            // ignore closed
                            break;
                        case REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR:
                            reject(err);
                            break;
                        case REALTIME_SUBSCRIBE_STATES.TIMED_OUT:
                            reject(new Error('Timed out'));
                            break;
                    }
                }, 5000)
            } catch (err) {
                reject(err);
            }
        })
    }

    private async doAdd(topic: string) {
        if (!this.channels[topic]) {
            try {
                await this.supabase.realtime.setAuth();
                this.channels[topic] = await this.subscribeToChannel(topic);
            } catch (err) {
                console.log(`RealtimeChannels: ${topic}: subscribe:`, err);
            }
        }
    }

    private async doRemove(topic: string) {
        if (this.channels[topic]) {
            console.log(`RealtimeChannels: ${topic}: unsubscribe`);
            const status = await this.channels[topic].unsubscribe();
            console.log(`RealtimeChannels: ${topic}: unsubscribe:`, status);
            delete this.channels[topic];
        }
    }
}
