package utils

import scala.concurrent.{ExecutionContext, Future}

object FutureOption {
  def apply[A](opt: Option[A]): FutureOption[A] =
    new FutureOption[A](Future.successful(opt))

  def apply[A](fut: Future[A])(implicit executor: ExecutionContext): FutureOption[A] =
    new FutureOption[A](fut.map(Some(_)))

  def pure[A](a: A): FutureOption[A] =
    new FutureOption[A](Future.successful(Some(a)))

  def wrap[A](fo: Future[Option[A]]): FutureOption[A] =
    new FutureOption[A](fo)
}

/**
  * Helper to allow for fluid for-comprehensions in cases when we mix Futures, Options and Future[Option]s.
  */
class FutureOption[A](val fo: Future[Option[A]]) {

  def flatMap[B](fn: A => FutureOption[B])(implicit executor: ExecutionContext): FutureOption[B] = {
    new FutureOption(fo.flatMap {
      case Some(a) => fn(a).fo
      case None => Future.successful(None)
    })
  }

  def map[B](fn: A => B)(implicit executor: ExecutionContext): FutureOption[B] = {
    new FutureOption(fo.map(_.map(fn)))
  }

  def extract: Future[Option[A]] = fo
}
