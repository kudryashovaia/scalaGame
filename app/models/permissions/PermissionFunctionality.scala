package models.permissions

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.DB
import scala.concurrent.{ExecutionContext, Future}
import utils.Util

case class PermissionFunctionality(
  id: Long = 0,
  userId: Long = 0,
  path: String = ""
)

class PermissionFunctionalityDAO @Inject() (
  db: DB
) {
  import db.context._

  def list(userId: Long)(implicit executionContext: ExecutionContext): Future[Seq[String]] = {
    run(query[PermissionFunctionality].filter(_.userId == lift(userId)).map(_.path))
  }

  def update(
    userId: Long,
    functionality: Seq[String],
    permissions: Permissions
  )(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    val newPermissions =
      functionality
      .filter(permissions.testPath)
      .map(path => PermissionFunctionality(0, userId, path))

    for {
      _ <- run(query[PermissionFunctionality].filter(_.userId == lift(userId)).delete)
      _ <- Util.futureSerialSequence(newPermissions) { p =>
        run(query[PermissionFunctionality].insert(lift(p.copy(id = 0))).returning(_.id))
      }
    } yield ()
  }

}
