package controllers

import javax.inject.Inject
import models.{DB, NewsPost, NewsPostDAO}
import play.api.mvc.InjectedController
import scala.concurrent.ExecutionContext

class News @Inject() (
  auth: Auth,
  newsPostDAO: NewsPostDAO,
  db: DB,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers {

  def list() = auth.apply().async { request =>
    newsPostDAO.list(request.permissions).map(toOkJsonArray(_))
  }

  def byId(id: Long) = auth.checkPermissions("/admin/news").async { request =>
    newsPostDAO.byId(id, request.permissions).map(optToJson(_))
  }

  def updateOrCreate() = auth.checkPermissions("/admin/news").async(parse.json) { request =>
    readJson[NewsPost](request.body) { post =>
      db.context.transaction { implicit transactionContext =>
        if (post.id == 0) {
          log.change(request.userId, "inserting news post", request.body.toString)
          newsPostDAO.insert(post, request.permissions)
        } else {
          log.change(request.userId, "updating news post", request.body.toString)
          newsPostDAO.update(post, request.permissions)
        }
      }
    }
  }

  def delete(id: Long) = auth.checkPermissions("/admin/news").async { request =>
    db.context.transaction { implicit transactionContext =>
      newsPostDAO.delete(id, request.permissions)
    }
  }

}
