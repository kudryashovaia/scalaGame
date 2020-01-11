package models.permissions

import java.util.concurrent.CompletableFuture
import javax.inject.Inject
import models.user.UserDAO
import utils.{FutureHelpers, Logging}
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.Success

case class Permissions(
  userId: Long,
  functionality: Seq[String],
  locationWildcard: Boolean,
  locationIds: Seq[Long],
  bypass: Boolean = false
) {

  def testPath(path: String): Boolean = {
    Permissions.testPath(functionality, path) || bypass
  }

}

object Permissions {
  val Bypass = Permissions(
    userId = 0L,
    functionality = Seq(),
    locationWildcard = false,
    locationIds = Nil,
    bypass = true
  )

  def testPath(functionality: Seq[String], path: String): Boolean = {
    path == "" || functionality.exists(f => path.startsWith(f))
  }
}

class PermissionsGetter @Inject() (
  userDAO: UserDAO,
  permissionFunctionalityDAO: PermissionFunctionalityDAO,
  permissionLocationDAO: PermissionLocationDAO,
  futureHelpers: FutureHelpers,
  implicit val executionContext: ExecutionContext
) extends Logging {

  def getUserPermissions(userId: Long): CompletableFuture[Permissions] = {
    val result = new CompletableFuture[Permissions]()
    futureHelpers.fireAndForgetFuture(log)(
      (for {
        functionalityPermissions <- permissionFunctionalityDAO.list(userId)
        locationPermissions <- permissionLocationDAO.list(userId)
      } yield Permissions(
        userId = userId,
        functionality = functionalityPermissions,
        locationWildcard = locationPermissions.exists(_.isWildcard),
        locationIds = locationPermissions.flatMap(_.locationId)
      )).map { permissions =>
        result.complete(permissions)
        ()
      }.recover {
        case th: Throwable =>
          result.completeExceptionally(th)
          ()
      }
    )
    result
  }
}

class PermissionsCache @Inject() (
  permissionsCacheJ: PermissionsCacheJ
) {

  def forUser(userId: Long): Future[Permissions] = {
    val result = Promise[Permissions]()
    permissionsCacheJ.getUserPermissions(userId).thenAccept((p: Permissions) => {
      result.complete(Success(p))
      ()
    }).exceptionally(th => {
      result.failure(th)
      null
    })
    result.future
  }

  def clear(userId: Long) = {
    permissionsCacheJ.clear(userId)
  }

}
