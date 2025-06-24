// model/ProfileView.js
import {Model} from '@nozbe/watermelondb'
import {date, readonly, text} from "@nozbe/watermelondb/decorators";

export default class Profile extends Model {
    static table = 'profiles'
    static associations = {
    }

    @text('user_id') userId!: string
    @text('display_name') displayName!: string
    @readonly() @date('created_at') createdAt!: Date
    @readonly() @date('updated_at') updatedAt!: Date
}
