package models.user

import doobie.implicits._
import macros.JsonFormatAnnotation
import models.permissions.Permissions
import utils.UnauthorizedException

import scala.concurrent.{ExecutionContext, Future}

@JsonFormatAnnotation
case class UserCredentials(
  id: Long,
  login: String,
  password: String
)

trait UserQuery { this: UserDAO =>

  def byId(id: Long, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    if (permissions.testPath("/admin/clients") || permissions.testPath("/admin/users") || permissions.bypass) {
      sql"""select *
           |from users
           |where id = $id
           |""".stripMargin
        .query[User]
        .to[List]
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_.headOption)
    } else Future.failed(new UnauthorizedException)
  }

  def byLogin(login: String, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    if (permissions.bypass) {
      sql"""select *
           |from users
           |where login = $login
           |""".stripMargin
        .query[User]
        .to[List]
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_.headOption)
    } else Forbidden
  }

  def list(permissions: Permissions)(implicit executionContext: ExecutionContext): Future[List[User]] = {
    if (permissions.testPath("/admin/clients") || permissions.bypass) {
      sql"""select *
           |from users
           |order by RANDOM()
           |""".stripMargin
        .query[User]
        .to[List]
        .transact(dbConnection.mode)
        .unsafeToFuture()
    } else Forbidden
  }
}
