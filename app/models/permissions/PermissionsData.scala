package models.permissions

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import macros.JsonFormatAnnotation
import models.user.UserDAO
import scala.concurrent.{ExecutionContext, Future}

@JsonFormatAnnotation
case class PermissionsData(
  functionality: Seq[String] = Nil,
  locationIds: Seq[Long] = Nil
)

class PermissionsDataDAO @Inject() (
  userDAO: UserDAO,
  permissionFunctionalityDAO: PermissionFunctionalityDAO,
  permissionLocationDAO: PermissionLocationDAO,
  permissionsCacheJ: PermissionsCacheJ
) {

  def byId(userId: Long)(implicit executionContext: ExecutionContext) = {
    for {
      functionalityPermissions <- permissionFunctionalityDAO.list(userId)
      locationPermissions <- permissionLocationDAO.list(userId)
    } yield {
      PermissionsData(
        functionality = functionalityPermissions,
        locationIds = locationPermissions.flatMap(p => if (p.isWildcard) Some(-1L) else p.locationId)
      )
    }
  }

  def update(
    userId: Long,
    permissions: PermissionsData,
    requestPermissions: Permissions
  )(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    for {
      _ <- permissionFunctionalityDAO.update(userId, permissions.functionality, requestPermissions)

      _ <- permissionLocationDAO.update(userId, permissions.locationIds.map { locationId =>
        if (locationId == -1) PermissionLocation(isWildcard = true)
        else PermissionLocation(locationId = Some(locationId))
      }, requestPermissions)
    } yield {
      permissionsCacheJ.clear(userId)
    }
  }

}
