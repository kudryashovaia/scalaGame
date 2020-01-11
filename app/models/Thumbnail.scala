package models

import io.getquill.context.async.TransactionalExecutionContext
import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

case class Thumbnail(
  id: Long = 0,
  fileId: Long,
  watermark: Boolean,
  width: Option[Int],
  height: Option[Int],
  s3filename: String
)

class ThumbnailDAO @Inject() (
  db: DB
) extends QuillHelpers {
  import db.context._

  def storeThumbnailInfo(thumbnail: Thumbnail)(implicit executionContext: TransactionalExecutionContext): Future[Unit] = {
    run(query[Thumbnail].insert(lift(thumbnail)).returning(_.id)).map(assertInsert)
  }

  def getThumbnailPath(
    fileId: Long,
    watermark: Boolean,
    width: Option[Int],
    height: Option[Int]
  )(implicit executionContext: ExecutionContext): Future[Option[String]] = {
    run(
      query[Thumbnail]
        .filter(_.fileId == lift(fileId))
        .filter(_.watermark == lift(watermark))
        .filter(t => infix"${t.width} is not distinct from ${lift(width)}".as[Boolean])
        .filter(t => infix"${t.height} is not distinct from ${lift(height)}".as[Boolean])
        .map(_.s3filename)
        .take(1)
    ).map(_.headOption)
  }

}
