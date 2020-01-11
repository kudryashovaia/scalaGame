package models.permissions

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.DB
import scala.concurrent.{ExecutionContext, Future}
import utils.Util

case class PermissionLocation(
  id: Long = 0,
  userId: Long = 0,
  locationId: Option[Long] = None,
  isWildcard: Boolean = false
)

class PermissionLocationDAO @Inject() (
  db: DB
) {
  import db.context._

  def list(userId: Long)(implicit executionContext: ExecutionContext): Future[Seq[PermissionLocation]] = {
    run(query[PermissionLocation].filter(_.userId == lift(userId)))
  }

  def update(
    userId: Long,
    newPermissions: Seq[PermissionLocation],
    permissions: Permissions
  )(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {

    val filteredPermissions = newPermissions.flatMap { p =>
      if (p.isWildcard) {
        if (permissions.locationWildcard) {
          Seq(PermissionLocation(isWildcard = true))
        } else {
          permissions.locationIds.map(id => PermissionLocation(locationId = Some(id)))
        }
      } else {
        if (permissions.locationWildcard || p.locationId.exists(permissions.locationIds.contains)) {
          Seq(p)
        } else {
          Seq()
        }
      }
    }.distinct


    for {
      _ <- run(query[PermissionLocation].filter(_.userId == lift(userId)).delete)
      _ <- Util.futureSerialSequence(filteredPermissions) { p =>
        run(query[PermissionLocation].insert(lift(p.copy(userId = userId))).returning(_.id))
      }
    } yield ()
  }

}
