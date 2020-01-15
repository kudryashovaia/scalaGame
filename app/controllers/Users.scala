package controllers

import javax.inject.Inject
import models.user.UserDAO
import play.api.Configuration
import play.api.mvc.InjectedController
import utils.ResultContentTypes

import scala.concurrent.ExecutionContext

class Users @Inject() (
  auth: Auth,
  userDAO: UserDAO,
  authenticationController: Authentication,
  configuration: Configuration,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers with ResultContentTypes {

  def byId(userId: Long) = auth.apply().async {
    userDAO.byId(userId).map(optToJson(_))
  }


  def list() = auth.apply().async {
    userDAO.list().map(toOkJsonArray(_))
  }


}
