import Post from "./Post"
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, hasMany,HasMany,beforeSave} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static get hidden() {
    return ['password'];
  }

  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Post,{
    foreignKey: 'user_id'
  })
  public posts: HasMany<typeof Post>

  @column()
  public username: String

  @column()
  public name: String

  @column()
  public email: String

  @column({serializeAs: null})
  public password: string

  @column()
  public status: String

  @column()
  public role: String

  @column()
  public avatar: String

  @column()
  public remember_me_token: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User){
    if(user.$dirty.password){
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
