import {singleton} from "tsyringe";
import {SyncService} from "~/lib/services/SyncService";
import {SessionService} from "~/lib/services/SessionService";
import {RealtimeChannels} from "~/lib/services/RealtimeChannels";

@singleton()
export class RealtimeService {
    private userTopic?: string;

    constructor(
        channels: RealtimeChannels,
        syncService: SyncService,
        sessionService: SessionService,
    ) {
        channels.subscribe(event => {
            console.log('RealtimeService: realtimeEvents: ', event);
            syncService.requestSync();
        });
        sessionService.subscribe(session => {
            if (this.userTopic) {
                channels.remove(this.userTopic);
                delete this.userTopic;
            }
            if (session) {
                this.userTopic = `user:${session.user.id}`;
                channels.add(this.userTopic);
            }
        });
    }
}
