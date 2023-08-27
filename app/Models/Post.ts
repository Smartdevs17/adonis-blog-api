import User from "./User"
import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo,BelongsTo,hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from "./Comment"

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User,{
    foreignKey: "user_id"
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Comment,{
    foreignKey: "post_id"
  })
  public comments: HasMany<typeof Comment>

  @column()
  public user_id: Number

  @column()
  public title: String

  @column()
  public desc: String

  @column()
  public photo: String

  @column()
  public status: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
