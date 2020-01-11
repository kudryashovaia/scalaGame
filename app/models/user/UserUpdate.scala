package models.user

import io.getquill.context.async.TransactionalExecutionContext
import models.permissions.Permissions
import scala.concurrent.Future
import scala.util.Random
import utils.UnauthorizedException

trait UserUpdate { this: UserDAO =>

  import db.context._

  def setPasswordHash(userId: Long, passwordHash: String, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    if (permissions.testPath("/admin/clients") || permissions.userId == userId || permissions.bypass) {
      run(query[User].filter(_.id == lift(userId)).update(_.password -> lift(passwordHash))).map(assertUpdate)
    } else Forbidden
  }

}
