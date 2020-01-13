package models.user

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.permissions.{PermissionFunctionality, Permissions}
import models.{DB, QuillHelpers}
import play.api.Configuration
import scala.concurrent.Future
import utils.UnauthorizedException

import models.Context._
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.Read
import doobie.util.fragment.Fragment
import fs2.Stream

import scala.concurrent.Future

class UserDAO @Inject() (
  val configuration: Configuration
) extends UserUpdate
  with UserQuery
  with QuillHelpers {

  val dbConnection = DB
  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._

  def create(user: User, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    if (permissions.testPath("/admin/users") || permissions.bypass) {
      sql"""insert into users values(
           |${user.login},
           |${user.password},
           |${user.isAdmin}
           |)"""
        .update
        .run
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_ => ())
    } else Forbidden
  }

  def userId(user: User, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Long] = {
    if (permissions.testPath("/admin/users") || permissions.bypass) {
      sql"""select id
           |from users
           |where login = ${user.login}
           |"""
        .query[Long]
        .to[List]
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_.head)
    } else Forbidden
  }

  def delete(userId: Long, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    if (permissions.testPath("/admin/clients") || permissions.bypass) {
      sql"""delete from users where id = $userId""".update.quick.unsafeToFuture()
    } else Future.failed(new UnauthorizedException)
  }
}
