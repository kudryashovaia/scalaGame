package controllers

import javax.inject.Inject
import models.DB
import models.user.{User, UserDAO}
import play.api.Configuration
import play.api.libs.json.{JsObject, Json}
import play.api.libs.ws.WSClient
import play.api.mvc.InjectedController
import utils.Util._
import utils.{FriendlyException, ResultContentTypes}

import scala.concurrent.{ExecutionContext, Future}

class Clients @Inject()(
  auth: Auth,
  userDAO: UserDAO,
  authenticationController: Authentication,
  configuration: Configuration,
  val ws: WSClient,
  db: DB,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers with ResultContentTypes {

  def register() = auth.unauthenticated().async(parse.json) { request =>
    db.context.transaction { implicit transactionContext =>
      val email = (request.body \ "email").as[String]
      val password = (request.body \ "password").as[String]
      log.info(s"new client ${email} requests registration")
      userDAO.createClient(email, password).map { userId =>
        authenticationController.getTokenResponse(userId)
      }
    }
  }

//  def listClients() = auth.checkPermissions("/admin/clients").async { request =>
//    userDAO.generateClientTable(request.permissions).map(toOkJsonArray(_))
//  }
//
//  def listClientNames() = auth.checkPermissions("/admin/clients").async { request =>
//    userDAO.generateClientNamesTable(request.permissions).map(toOkJsonArray(_))
//  }
//
//  def byId(userId: Long) = auth.checkPermissions("/admin/clients").async { request =>
//    userDAO.byId(userId, request.permissions).map(optToJson(_))
//  }
//
//  def current() = auth.checkPermissions("/admin/clients").async { request =>
//    userDAO.byId(request.userId, request.permissions).map(optToJson(_))
//  }
//
//
//  def update() = auth.apply().async(parse.json) { request =>
//    db.context.transaction { implicit transactionContext =>
//      readJson[User](request.body) { user =>
//        userDAO.byId(user.id, request.permissions).flatMap {
//          case None =>
//            throw new Exception(s"user #${user.id} not found")
//          case Some(origUser) =>
//            log.change(request.userId, s"updating user", Json.toJson(user).toString)
//            userDAO.update(user, request.permissions)
//              .flatMap { _ =>
//                val generatePassword = (request.body \ "generatePassword").asOpt[Boolean].getOrElse(false)
//                val newPasswordOpt =
//                  if (generatePassword)
//                    Some(User.generatePassword())
//                  else
//                    (request.body \ "newPassword").asOpt[String].trim
//
//                newPasswordOpt match {
//                  case None => Future.successful(())
//                  case Some(password) =>
//                    log.change(request.userId, s"changing user #${user.id} password")
//                    userDAO.setPasswordHash(user.id, User.hashPassword(password), request.permissions)
//                }
//              }
//              .map(_ => Ok(""))
//        }
//      }
//    }
//  }

  def delete(userId: Long) = auth.checkPermissions("/admin/clients").async { request =>
    log.change(request.userId, s"deleting user ${userId}")
    db.context.transaction { implicit transactionContext =>
      userDAO.delete(userId, request.permissions).map(_ => Ok(""))
    }
  }


}
