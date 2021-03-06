package controllers

import com.github.mauricio.async.db.postgresql.exceptions.GenericDatabaseException
import javax.inject.Inject
import play.api.libs.crypto.CookieSigner
import play.api.libs.json.Json
import play.api.mvc._
import utils.{FriendlyException, Logging, ShortcutResultException, UnauthorizedException, Util}
import scala.concurrent.{ExecutionContext, Future}

class AuthenticatedRequest[A](
  val userId: Long,
  request: Request[A]
) extends WrappedRequest[A](request)

class Auth @Inject() (
  cookieSigner: CookieSigner,
  executionContext: ExecutionContext,
  bodyParser: BodyParsers.Default
) {

  def apply() = checkPermissions(Seq(""))
  def checkPermissions(path: String): Authenticated = checkPermissions(Seq(path))
  def checkPermissions(paths: Seq[String]): Authenticated = new Authenticated(
    paths,
    cookieSigner,
    executionContext,
    bodyParser
  )

  //def unauthenticated() = new Unauthenticated(executionContext, bodyParser)
}

class Authenticated(
  paths: Seq[String],
  cookieSigner: CookieSigner,
  implicit val executionContext: ExecutionContext,
  val parser: BodyParsers.Default
) extends ActionBuilder[AuthenticatedRequest, AnyContent] with Logging {

  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]) = {
    try {
      getUserId(request).map { userId =>
        handleFriendlyExceptions(request, userId, {
          checkPathPermissions(
            block(new AuthenticatedRequest[A](userId, request))
          )
        })
      } getOrElse {
        Future.successful(Results.Unauthorized(views.html.defaultpages.unauthorized()))
      }
    } catch {
      case th: Throwable =>
        log.error(th, s"authenticated block invocation failed for $request")
        Future.successful(Results.InternalServerError("Внутренняя ошибка"))
    }
  }

  def getUserId[A](request: Request[A]): Option[Long] = {
    request.headers.get("Authorization")
    .orElse(request.queryString.get("auth").flatMap(_.headOption))
    .fold[Option[Long]](None) { signedCookie =>
      signedCookie.stripPrefix("Bearer").trim.split("\\.") match {
        case Array(signature, cookie) =>
          val fixedCookie = cookie.replace(" ", "+")
          if (signature != cookieSigner.sign(fixedCookie)) {
            None
          } else {
            val fields = Json.parse(Util.base64decode(fixedCookie))
            Some((fields \ "uid").as[Long])
          }
        case _ => None
      }
    }
  }

  def checkPathPermissions[A](result: => Future[Result]): Future[Result] = {
      result
  }

  def handleFriendlyExceptions[A](request: Request[A], userId: Long, result: => Future[Result]): Future[Result] = {
    val exceptionHandler: PartialFunction[Throwable, Result] = {
      case ShortcutResultException(res) =>
        res
      case ex: FriendlyException =>
        log.warn(s"Friendly exception for $request, user #$userId: ${ex.getMessage}")
        Results.BadRequest(ex.getMessage)
      case ex: GenericDatabaseException if ex.errorMessage.message.contains("duplicate key value") =>
        ex.errorMessage.fields.get('D').flatMap { msg =>
          """Key \(.*\)=\((.*)\) already exists""".r.findFirstMatchIn(msg)
        }.map { m =>
          Results.BadRequest("Значение уже есть в базе данных: " + m.group(1))
        }.getOrElse(Results.BadRequest("Значение уже есть в базе данных"))
      case _: UnauthorizedException =>
        log.warn(s"Unauthorized exception for $request, user #$userId")
        Results.Forbidden
      case ex: Throwable =>
        log.error(ex, s"Internal server error for $request, user #$userId")
        Results.InternalServerError("Внутренняя ошибка")
    }

    try {
      result.recover(exceptionHandler)
    } catch exceptionHandler.andThen(Future.successful)
  }
}


//class Unauthenticated(
//  implicit val executionContext: ExecutionContext,
//  val parser: BodyParsers.Default
//) extends ActionBuilder[Request, AnyContent] with Logging {
//
//  def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = {
//    val exceptionHandler: PartialFunction[Throwable, Result] = {
//      case ShortcutResultException(res) =>
//        res
//      case ex: FriendlyException =>
//        log.warn(s"Friendly exception for $request: ${ex.getMessage}")
//        Results.BadRequest(ex.getMessage)
//      case ex: Throwable =>
//        log.error(ex, s"Internal server error for $request")
//        Results.InternalServerError("Внутренняя ошибка")
//    }
//
//    try {
//      block(request).recover(exceptionHandler)
//    } catch exceptionHandler.andThen(Future.successful)
//  }
//
//}

