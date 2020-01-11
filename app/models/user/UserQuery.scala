package models.user

import macros.JsonFormatAnnotation
import models.permissions.Permissions
import scala.concurrent.{ExecutionContext, Future}
import utils.UnauthorizedException

@JsonFormatAnnotation
case class UserCredentials(
  id: Long,
  login: String,
  password: String
)

trait UserQuery { this: UserDAO =>

  import db.context._

  def byId(id: Long, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    if (permissions.testPath("/admin/clients") || permissions.testPath("/admin/users") || permissions.bypass) {
      run(query[User].filter(_.id == lift(id)).take(1)).map(_.headOption)
    } else Future.failed(new UnauthorizedException)
  }

  def byUsername(email: String, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    if (permissions.bypass) {
      run(query[User].filter(_.login.equals(lift(email))).take(1)).map(_.headOption)
    } else Forbidden
  }

  def list(permissions: Permissions)(implicit executionContext: ExecutionContext): Future[List[User]] = {
    if (permissions.testPath("/admin/clients") || permissions.bypass) {
      run(query[User].sortBy(_.id))
    } else Forbidden
  }
}
