package controllers

import javax.inject.Inject
import models.permissions.PermissionsCache
import models.user.{User, UserCredentials, UserDAO, UserData, UserDataDAO}
import models.DB
import play.api.Configuration
import play.api.mvc.{InjectedController, Results}
import scala.concurrent.{ExecutionContext, Future}
import utils.{MailService, ResultContentTypes}

class Users @Inject() (
  auth: Auth,
  userDAO: UserDAO,
  userDataDAO: UserDataDAO,
  permissionsCache: PermissionsCache,
  authenticationController: Authentication,
  configuration: Configuration,
  mailService: MailService,
  db: DB,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers with ResultContentTypes {

  def currentPermissions() = auth.apply().async { request =>
    permissionsCache.forUser(request.userId).map(_.functionality).map(toOkJsonArray(_))
  }

  def byId(userId: Long) = auth.checkPermissions("/admin/users").async { request =>
    userDataDAO.byId(userId, request.permissions).map(optToJson(_))
  }

  def list() = auth.checkPermissions("/admin/users").async { request =>
    userDAO.list(request.permissions).map(toOkJsonArray(_))
  }


}
