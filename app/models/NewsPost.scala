package models


import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import macros.JsonFormatAnnotation
import models.permissions.Permissions


import scala.concurrent.{ExecutionContext, Future}

@JsonFormatAnnotation
case class NewsPost(
  id: Long = 0,
  timestamp: Long = System.currentTimeMillis(),
  subject: String,
  body: String
)

class NewsPostDAO @Inject() (
  db: DB
) extends QuillHelpers {
  import db.context._


  def list(permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Seq[NewsPost]] = {
    run(
      query[NewsPost]
        .sortBy(t =>t.timestamp)(Ord.desc)
    )
  }


  def byId(id: Long, permissions: Permissions)(implicit executionContext: ExecutionContext): Future[Option[NewsPost]] = {
    if (permissions.testPath("/admin/news") || permissions.bypass) {
      run(
        query[NewsPost]
          .filter(_.id == lift(id))
          .take(1)
      ).map(_.headOption)
    } else Forbidden
  }

  def insert(
    post: NewsPost,
    permissions: Permissions
  )(
    implicit executionContext: TransactionalExecutionContext
  ): Future[Unit] = {
    if (permissions.testPath("/admin/news") || permissions.bypass) {
      run(
        query[NewsPost]
          .insert(lift(post)).returning(_.id)
      ).map(assertInsert)
    } else Forbidden
  }

  def update(
    post: NewsPost,
    permissions: Permissions
  )(
    implicit executionContext: TransactionalExecutionContext
  ): Future[Unit] = {
    if (permissions.testPath("/admin/news") || permissions.bypass) {
      run(
        query[NewsPost]
          .filter(_.id == lift(post.id))
          .update(lift(post))
      ).map(assertUpdate)
    } else Forbidden
  }

  def delete(
    postId: Long,
    permissions: Permissions
  )(
    implicit executionContext: TransactionalExecutionContext
  ): Future[Unit] = {
    if (permissions.testPath("/admin/news") || permissions.bypass) {
      run(
        query[NewsPost]
          .filter(_.id == lift(postId))
          .delete
      ).map(assertDelete)
    } else Forbidden
  }

}
