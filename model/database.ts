import {Database} from "@nozbe/watermelondb";
import List from "./List";
import Item from "./Item";
import Source from "~/model/Source";
import CurrentItem from "~/model/CurrentItem";
import PreviousItem from "~/model/PreviousItem";
import ItemSource from "~/model/ItemSource";
import {adapter} from "~/model/adapter";

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
