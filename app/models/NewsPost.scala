package models


import doobie.implicits._
import javax.inject.Inject
import macros.JsonFormatAnnotation
import models.Context._

import scala.concurrent.Future

@JsonFormatAnnotation
case class NewsPost(
  id: Long = 0,
  timestamp: Long = System.currentTimeMillis(),
  subject: String,
  body: String
)

class NewsPostDAO @Inject()
  extends QuillHelpers {

  private val dbConnection = DB

  private val updateTransactor = dbConnection.mode.yolo
  import updateTransactor._


  def list(): Future[Seq[NewsPost]] =
    sql"""select *
         |from news_posts
         |order by RANDOM()
         |""".stripMargin
      .query[NewsPost]
      .to[List]
      .transact(dbConnection.mode)
      .unsafeToFuture()


  def byId(id: Long): Future[Option[NewsPost]] =
      sql"""select *
           |from news_posts
           |where id = $id
           |""".stripMargin
        .query[NewsPost]
        .to[List]
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_.headOption)

  def insert(post: NewsPost): Future[Unit] =
      sql"""insert into news_posts values(
            |${post.id},
            |${post.timestamp},
            |${post.subject},
            |${post.body}
            |)
           |""".stripMargin
        .update
        .run
        .transact(dbConnection.mode)
        .unsafeToFuture()
        .map(_ => ())

  def update(post: NewsPost): Future[Unit] =
      sql"""select *
           |from news_posts
           |order by RANDOM()
           |""".stripMargin
        .update
        .quick
        .unsafeToFuture()

  def delete(postId: Long): Future[Unit] =
    sql"""delete from news_posts
         |where id = $postId
         |""".stripMargin
      .update
      .quick
      .unsafeToFuture()

}
