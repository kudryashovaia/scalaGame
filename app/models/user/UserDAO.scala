package models.user

import doobie.implicits._
import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.{DB, QuillHelpers}

import scala.concurrent.Future

class UserDAO @Inject()
  extends UserUpdate
    with UserQuery
    with QuillHelpers {

  val dbConnection = DB
  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._

  def create(user: User)(implicit executionContext: TransactionalExecutionContext): Future[Unit] =
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


  def userId(user: User)(implicit executionContext: TransactionalExecutionContext): Future[Long] =
    sql"""select id
         |from users
         |where login = ${user.login}
         |"""
      .query[Long]
      .to[List]
      .transact(dbConnection.mode)
      .unsafeToFuture()
      .map(_.head)


  def delete(userId: Long)(implicit executionContext: TransactionalExecutionContext): Future[Unit] =
    sql"""delete from users where id = $userId""".update.quick.unsafeToFuture()

}
