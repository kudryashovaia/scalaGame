package models.user

import doobie.implicits._
import io.getquill.context.async.TransactionalExecutionContext
import models.DB

import scala.concurrent.{ExecutionContext, Future}

class UserDAO {

  val dbConnection = DB
  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._

  def creator(user: User)(implicit executionContext: TransactionalExecutionContext): Future[Unit] =
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


  def setPasswordHash(userId: Long, passwordHash: String)(implicit executionContext: TransactionalExecutionContext): Future[Unit] =
    sql"""update users set
         |  password = $passwordHash
         |where id   = $userId
         |""".stripMargin
      .update
      .quick
      .unsafeToFuture()


  def byIdSearcher(id: Long)(implicit executionContext: ExecutionContext): Future[Option[User]] =
    sql"""select *
         |from users
         |where id = $id
         |""".stripMargin
      .query[User]
      .to[List]
      .transact(dbConnection.mode)
      .unsafeToFuture()
      .map(_.headOption)


  def byLogin(login: String)(implicit executionContext: ExecutionContext): Future[Option[User]] =
    sql"""select *
         |from users
         |where login = $login
         |""".stripMargin
      .query[User]
      .to[List]
      .transact(dbConnection.mode)
      .unsafeToFuture()
      .map(_.headOption)


  def list()(implicit executionContext: ExecutionContext): Future[List[User]] =
    sql"""select *
         |from users
         |order by RANDOM()
         |""".stripMargin
      .query[User]
      .to[List]
      .transact(dbConnection.mode)
      .unsafeToFuture()

  def create(userData: User)(implicit excecutionContext: TransactionalExecutionContext): Future[Long] = {
    for {
      _ <- creator(userData)
      userId <- userId(userData)
    } yield userId
  }

  def byId(userId: Long)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    for {
      userOpt <- byIdSearcher(userId)
    } yield userOpt
  }
}
