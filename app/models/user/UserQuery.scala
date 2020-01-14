package models.user

import doobie.implicits._

import scala.concurrent.{ExecutionContext, Future}

trait UserQuery { this: UserDAO =>

  def byId(id: Long)(implicit executionContext: ExecutionContext): Future[Option[User]] =
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

}
