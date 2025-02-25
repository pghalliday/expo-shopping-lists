import {Model, Relation} from "@nozbe/watermelondb";
import {date, immutableRelation, readonly, text, writer} from "@nozbe/watermelondb/decorators";
import Item from "./Item";
import Source from "./Source";
import List from "./List";
import PreviousItem from "~/model/PreviousItem";

export default class ItemSource extends Model {
    static table = 'item_sources'
    static associations = {
        lists: { type: <const> 'belongs_to', key: 'list_id' },
        items: { type: <const> 'belongs_to', key: 'item_id' },
        sources: { type: <const> 'belongs_to', key: 'source_id' },
    }

    @text('list_id') listId!: string
    @text('item_id') itemId!: string
    @text('source_id') sourceId!: string
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @immutableRelation('lists', 'list_id') list!: Relation<List>
    @immutableRelation('items', 'item_id') item!: Relation<Item>
    @immutableRelation('sources', 'source_id') source!: Relation<Source>

    @writer async addPreviousItem(quantity: number) {
        return this.collections.get<PreviousItem>('previous_items').create((previousItem: PreviousItem) => {
            previousItem.itemId = this.itemId;
            previousItem.listId = this.listId;
            previousItem.sourceId = this.sourceId;
            previousItem.quantity = quantity;
        });
    }
}
