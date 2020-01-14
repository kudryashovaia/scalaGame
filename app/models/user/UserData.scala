package models.user

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import models.QuillHelpers

import scala.concurrent.{ExecutionContext, Future}


class UserDataDAO @Inject() (
  userDAO: UserDAO,
) extends QuillHelpers {

  def create(userData: User)(implicit excecutionContext: TransactionalExecutionContext): Future[Long] = {
    for {
      _ <- userDAO.create(userData)
      userId <- userDAO.userId(userData)
    } yield userId
  }

  def byId(userId: Long)(implicit executionContext: ExecutionContext): Future[Option[User]] = {
    for {
      userOpt <- userDAO.byId(userId)
    } yield userOpt
  }
}
