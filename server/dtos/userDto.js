// дтошка для фильтрации информации о пользователе
export class UserDto {
  name
  avatar
  email
  id
  settings
  constructor(model) {
    this.name = model.name
    this.avatar = model.avatar
    this.email = model.email
    this.id = model._id
    this.settings = model.settings
  }
}
