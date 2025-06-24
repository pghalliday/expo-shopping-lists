import {Database} from "@nozbe/watermelondb";
import {SyncService} from "~/lib/services/SyncService";
import List from "~/model/List";
import Item from "~/model/Item";
import CurrentItem from "~/model/CurrentItem";
import Profile from "~/model/Profile";
import {inject, singleton} from "tsyringe";
import {DATABASE} from "~/tsyringe/symbols";

@singleton()
export class Api {
    constructor(
        @inject(DATABASE) private readonly database: Database,
        private readonly syncService: SyncService
    ) {
    }

    async resetDatabase() {
        await this.database.write(async () => {
            return this.database.unsafeResetDatabase();
        });
        this.syncService.requestSync();
    }

    async addList(name: string) {
        const list = await this.database.write(async () => {
            return this.database.get<List>('lists').create(list => {
                list.name = name;
            });
        });
        this.syncService.requestSync();
        return list;
    }

    async addCurrentItem(listId: string, name: string) {
        const currentItem = await this.database.write(async () => {
            const item = await this.database.get<Item>('items').create(item => {
                item.listId = listId;
                item.name = name;
            });
            return this.database.get<CurrentItem>('current_items').create(currentItem => {
                currentItem.itemId = item.id;
                currentItem.listId = listId;
            });
        });
        this.syncService.requestSync();
        return currentItem;
    }

    async updateList(list: List, name: string) {
        const newList = await this.database.write(async () => {
            return list.update(list => {
                list.name = name;
            });
        });
        this.syncService.requestSync();
        return newList;
    }

    async updateProfileDisplayName(profile: Profile, displayName: string) {
        const newProfile = await this.database.write(async () => {
            return profile.update(profile => {
                profile.displayName = displayName;
            });
        });
        this.syncService.requestSync();
        return newProfile;
    }
}
