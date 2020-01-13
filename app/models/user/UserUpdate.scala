package models.user

import doobie.implicits._
import io.getquill.context.async.TransactionalExecutionContext
import models.permissions.Permissions

import scala.concurrent.Future

trait UserUpdate { this: UserDAO =>

  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._

  def setPasswordHash(userId: Long, passwordHash: String, permissions: Permissions)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    if (permissions.testPath("/admin/clients") || permissions.userId == userId || permissions.bypass) {
      sql"""update users set
           |  password = $passwordHash
           |where id   = $userId
           |""".stripMargin
        .update
        .quick
        .unsafeToFuture()
    } else Forbidden
  }

}
