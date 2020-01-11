package models.user

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import macros.JsonFormatAnnotation
import models.permissions.{Permissions, PermissionsData, PermissionsDataDAO}
import models.{DB, QuillHelpers}
import scala.concurrent.{ExecutionContext, Future}

@JsonFormatAnnotation
case class UserData(
  data: User,
  permissions: PermissionsData
)

class UserDataDAO @Inject() (
  db: DB,
  userDAO: UserDAO,
  permissionsDataDAO: PermissionsDataDAO
) extends QuillHelpers {

  def create(userData: UserData, requestPermissions: Permissions)(implicit excecutionContext: TransactionalExecutionContext): Future[Long] = {
    for {
      userId <- userDAO.create(userData.data, requestPermissions)
      _ <- permissionsDataDAO.update(userId, userData.permissions, requestPermissions)
    } yield userId
  }

  def byId(userId: Long, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[UserData]] = {
    for {
      userOpt <- userDAO.byId(userId, permissions)
      permissionsData <- permissionsDataDAO.byId(userId)
    } yield userOpt.map { user =>
      UserData(
        data = user,
        permissions = permissionsData
      )
    }
  }


}
