package controllers

import javax.inject.Inject
import models.user.{User, UserDAO}
import play.api.libs.crypto.CookieSigner
import play.api.libs.json._
import play.api.mvc._
import utils.{FriendlyException, Logging, Util}

import scala.concurrent.{ExecutionContext, Future}

class Authentication @Inject() (
  auth: Auth,
  userDAO: UserDAO,
  cookieSigner: CookieSigner,
  implicit val executionContext: ExecutionContext
) extends InjectedController with Logging {

  def login = auth.apply().async(parse.json) { request =>
    val username = (request.body \ "username").as[String]
    val password = (request.body \ "password").as[String]
    log.info(s"Login attempt for ${username} from ${request.remoteAddress}")
    (for {
      userOpt <- userDAO.byLogin(username)
      response <-
        userOpt
          .filter(user => User.checkPassword(password, user))
          .fold(Future.successful(Unauthorized: Result)) { user =>
            log.info(s"User ${username} logged in.")
            Future.successful(getTokenResponse(user.id))
          }
    } yield response).recover {
      case th: FriendlyException =>
        Results.BadRequest(th.getMessage)
    }
  }

  def refreshToken = auth.apply().async { request =>
    userDAO.byId(request.userId).map {
      _.fold(Unauthorized: Result) { user =>
        getTokenResponse(user.id)
      }
    }
  }

  def getTokenResponse(userId: Long): Result = {
    val token = Util.base64encode(JsObject(List(
      "uid" -> JsNumber(userId)
    )).toString())

    val signature = cookieSigner.sign(token)
    val signedToken = signature + "." + token

    Ok(JsString(signedToken))
  }

}
