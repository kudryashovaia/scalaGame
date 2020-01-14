package controllers

import javax.inject.Inject
import models.user.{UserDAO, UserDataDAO}
import play.api.Configuration
import play.api.mvc.InjectedController
import utils.{MailService, ResultContentTypes}

import scala.concurrent.ExecutionContext

class Users @Inject() (
  auth: Auth,
  userDAO: UserDAO,
  userDataDAO: UserDataDAO,
  authenticationController: Authentication,
  configuration: Configuration,
  mailService: MailService,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers with ResultContentTypes {

  def byId(userId: Long) = auth.apply().async {
    userDataDAO.byId(userId).map(optToJson(_))
  }


  def list() = auth.apply().async {
    userDAO.list().map(toOkJsonArray(_))
  }


}
