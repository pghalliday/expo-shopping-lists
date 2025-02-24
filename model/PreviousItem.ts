import {Model, Relation} from "@nozbe/watermelondb";
import {date, immutableRelation, readonly, text} from "@nozbe/watermelondb/decorators";
import Item from "./Item";
import Source from "./Source";
import List from "./List";

export default class PreviousItem extends Model {
    static table = 'previous_items'
    static associations = {
        lists: { type: <const> 'belongs_to', key: 'list_id' },
        items: { type: <const> 'belongs_to', key: 'item_id' },
        sources: { type: <const> 'belongs_to', key: 'source_id' },
    }

    @text('list_id') listId!: string
    @text('item_id') itemId!: string
    @text('source_id') sourceId!: string
    @text('quantity') quantity!: number
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @immutableRelation('lists', 'list_id') list!: Relation<List>
    @immutableRelation('items', 'item_id') item!: Relation<Item>
    @immutableRelation('sources', 'source_id') source!: Relation<Source>
}
