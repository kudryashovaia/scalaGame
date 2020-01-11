package utils

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import com.google.inject.Inject
import play.api.mvc.{Filter, RequestHeader, Result}
import scala.concurrent.{ExecutionContext, Future}

class LoggingFilter @Inject() (
  actorSystem: ActorSystem,
  implicit val executionContext: ExecutionContext
) extends Filter with Logging {

  implicit val mat = ActorMaterializer()(actorSystem)

  override def apply(nextFilter: (RequestHeader) => Future[Result])(requestHeader: RequestHeader) = {
    val startTime = System.currentTimeMillis()
    nextFilter(requestHeader).map { result =>
      val requestTime = System.currentTimeMillis() - startTime
      log.debug(s"${requestHeader.remoteAddress} ${requestHeader.method} ${requestHeader.uri}, ${result.header.status}, ${result.body.contentLength.getOrElse("?")} bytes, $requestTime ms")
      result
    }
  }

}
