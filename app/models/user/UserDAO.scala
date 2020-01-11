package models.user

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.permissions.{PermissionFunctionality, Permissions}
import models.{DB, QuillHelpers}
import play.api.Configuration
import scala.concurrent.Future
import utils.UnauthorizedException

class UserDAO @Inject() (
  val db: DB,
  val configuration: Configuration
) extends UserUpdate
  with UserQuery
  with QuillHelpers {

  import db.context._

  def create(user: User, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Long] = {
    if (permissions.testPath("/admin/users") || permissions.bypass) {
      run(query[User].insert(lift(user)).returning(_.id))
    } else Forbidden
  }

  def createClient(
    login: String,
    password: String
  )(implicit executionContext: TransactionalExecutionContext): Future[Long] = {
    val newUser = User(
      id = 0L,
      login = login,
      password = Some(password).fold("")(User.hashPassword),
    )
    for {
      userId <- run(query[User].insert(lift(newUser)).returning(_.id))
      _ <- run(query[PermissionFunctionality].insert(lift(PermissionFunctionality(userId = userId, path = "/client"))).returning(_.id))
    } yield userId
  }

  def delete(userId: Long, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    if (permissions.testPath("/admin/clients") || permissions.bypass) {
      run(query[User].filter(_.id == lift(userId)).delete).map(assertDelete)
    } else Future.failed(new UnauthorizedException)
  }
}
