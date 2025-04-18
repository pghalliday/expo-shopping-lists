// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 5,
    tables: [
        tableSchema({
            name: 'lists',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'sources',
            columns: [
                { name: 'list_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'items',
            columns: [
                { name: 'list_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'units', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'current_items',
            columns: [
                { name: 'list_id', type: 'string', isIndexed: true },
                { name: 'item_id', type: 'string', isIndexed: true },
                { name: 'quantity', type: 'number' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'previous_items',
            columns: [
                { name: 'list_id', type: 'string', isIndexed: true },
                { name: 'item_id', type: 'string', isIndexed: true },
                { name: 'source_id', type: 'string', isIndexed: true },
                { name: 'quantity', type: 'number' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'item_sources',
            columns: [
                { name: 'list_id', type: 'string', isIndexed: true },
                { name: 'item_id', type: 'string', isIndexed: true },
                { name: 'source_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ]
        }),
    ]
})
