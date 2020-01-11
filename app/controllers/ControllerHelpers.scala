package controllers

import play.api.libs.json.{JsError, JsSuccess, JsValue, Json, Reads, Writes}
import play.api.mvc.{Result, Results}
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.ClassTag
import utils.{Logger, Logging}

trait ControllerHelpers extends Logging {

  implicit def unitFutureToResponse(f: Future[Unit])(implicit executionContext: ExecutionContext): Future[Result] = {
    f.map(_ => Results.Ok(""))
  }

  implicit class ToOkFuture(f: Future[Unit]) {
    def toOk(implicit executionContext: ExecutionContext): Future[Result] = f.map(_ => Results.Ok(""))
  }

  def toOkJson[A](item: A)(implicit writes: Writes[A]): Result = {
    Results.Ok(Json.stringify(Json.toJson(item))).as("application/json")
  }

  def toOkJsonArray[A](items: Seq[A])(implicit writes: Writes[A]): Result = {
    Results.Ok(Json.stringify(Json.toJson(items))).as("application/json")
  }

  def optToJson[A](optA: Option[A])(implicit writes: Writes[A]): Result = {
    optA match {
      case Some(a) => toOkJson(a)
      case None => Results.NotFound
    }
  }

  def readJson[A](json: JsValue)(fn: A => Future[Result])(implicit reads: Reads[A], classTag: ClassTag[A]): Future[Result] = {
    reads.reads(json) match {
      case JsSuccess(item, _) =>
        fn(item)
      case JsError(errors) =>
        log.error(s"Failed to parse ${classTag} from ${json}: ${errors}")
        Future.failed(new Exception(s"Failed to parse ${classTag} from json"))
    }
  }

  implicit class ExtendedLogger(logger: Logger) {
    def change(userId: Long, changeMessage: String, body: String) {
      logger.info(s"user #${userId}, ${changeMessage}\n${body}")
    }
    def change(userId: Long, changeMessage: String) {
      logger.info(s"user #${userId}, ${changeMessage}")
    }
    def withDebug[A](prefix: String, value: A): A = {
      logger.debug(s"${prefix}: ${value}")
      value
    }
  }
}
