package models.user

import doobie.implicits._
import io.getquill.context.async.TransactionalExecutionContext

import scala.concurrent.Future

trait UserUpdate { this: UserDAO =>

  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._

  def setPasswordHash(userId: Long, passwordHash: String)(implicit executionContext: TransactionalExecutionContext): Future[Unit] =
      sql"""update users set
           |  password = $passwordHash
           |where id   = $userId
           |""".stripMargin
        .update
        .quick
        .unsafeToFuture()
}
