package utils

import akka.actor.Actor
import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class FutureHelpers @Inject() (
  implicit val executionContext: ExecutionContext
) {

  def fireAndForgetFuture(log: Logger)(future: Future[Unit]): Unit = {
    val originalCallStack = new Exception("original call stack")
    future.recover {
      case err: Throwable =>
        log.error(err, "got error from fire-and-forget future")
        log.error(originalCallStack)
    }
    ()
  }

  def fireAndForgetFutureAnyType[A](log: Logger)(future: Future[A]): Unit = {
    val originalCallStack = new Exception("original call stack")
    future.recover[Any] {
      case err: Throwable =>
        log.error(err, "got error from fire-and-forget future")
        log.error(originalCallStack)
    }
    ()
  }

  def logActorExceptions(log: Logger)(pf: Actor.Receive): PartialFunction[Any, Unit] = {
    new PartialFunction[Any, Unit] {
      override def isDefinedAt(x: Any) = {
        try {
          pf.isDefinedAt(x)
        } catch {
          case ex: Throwable =>
            log.error(ex, "error in actor receive.isDefinedAt")
            throw ex
        }
      }

      override def apply(v1: Any) = {
        try {
          pf.apply(v1)
        } catch {
          case ex: Throwable =>
            log.error(ex, "error in actor receive.apply")
            throw ex
        }
      }
    }
  }


}
