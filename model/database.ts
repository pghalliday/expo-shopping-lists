// First, create the adapter to the underlying database:
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "./schema";
import {Database} from "@nozbe/watermelondb";
import List from "./List";
import Item from "./Item";
import Source from "~/model/Source";
import CurrentItem from "~/model/CurrentItem";
import PreviousItem from "~/model/PreviousItem";
import ItemSource from "~/model/ItemSource";

const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    // migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: true, /* Platform.OS === 'ios' */
    // (optional, but you should implement this method)
    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [
        List,
        Source,
        Item,
        CurrentItem,
        PreviousItem,
        ItemSource,
    ],
})

export async function resetDatabase() {
    return  database.write(async () => {
        return  database.unsafeResetDatabase();
    });
}

export async function addList(name: string): Promise<List> {
    return  database.write(async () => {
        return  database.get<List>('lists').create(list => {
            list.name = name;
        });
    });
}

export async function addCurrentItem(listId: string, name: string): Promise<CurrentItem> {
    return  database.write(async () => {
        const item = await database.get<Item>('items').create(item => {
            item.listId = listId;
            item.name = name;
        });
        return database.get<CurrentItem>('current_items').create(currentItem => {
            currentItem.itemId = item.id;
            currentItem.listId = listId;
        });
    });
}

export async function updateList(list: List, name: string) {
    return database.write(async () => {
        return list.update(list => {
            list.name = name;
        });
    });
}

export const lists = database.get<List>('lists').query();
