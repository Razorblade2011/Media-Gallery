// дтошка для фильтрации информации о пользователе
export class UserDto {
  email
  id
  constructor(model) {
    this.email = model.email
    this.id = model._id
  }
}
