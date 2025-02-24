import {Model, Q, Query, Relation} from "@nozbe/watermelondb";
import {children, date, immutableRelation, lazy, readonly, text} from "@nozbe/watermelondb/decorators";
import List from "./List";
import CurrentItem from "./CurrentItem";
import PreviousItem from "./PreviousItem";
import ItemSource from "./ItemSource";
import Source from "./Source";

export default class Item extends Model {
    static table = 'items'
    static associations = {
        lists: { type: <const> 'belongs_to', key: 'list_id' },
        current_items: { type: <const> 'has_many', foreignKey: 'item_id' },
        previous_items: { type: <const> 'has_many', foreignKey: 'item_id' },
        item_sources: { type: <const> 'has_many', foreignKey: 'item_id' },
    }

    @text('list_id') listId!: string
    @text('name') name!: string
    @text('units') units!: string
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date

    @immutableRelation('lists', 'list_id') list!: Relation<List>

    @children('current_items') currentItems!: Query<CurrentItem>
    @children('previous_items') previousItems!: Query<PreviousItem>
    @children('item_sources') itemSources!: Query<ItemSource>

    @lazy sources: Query<Source> = this.collections.get<Source>('sources').query(
        Q.on('item_sources', 'item_id', this.id),
    )
}
