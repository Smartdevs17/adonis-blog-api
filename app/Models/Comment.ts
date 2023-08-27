import User from './User'
import Post from './Post'
import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo, } from '@ioc:Adonis/Lucid/Orm'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User,{
    foreignKey: "user_id"
  })
  public user: BelongsTo<typeof User>
 
  @belongsTo(() => Post,{
    foreignKey: "post_id"
  })
  public post: BelongsTo<typeof Post>

  @column()
  public user_id: Number

  @column()
  public post_id: Number

  @column()
  public comment_text: String;
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
