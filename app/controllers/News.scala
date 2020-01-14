package controllers

import javax.inject.Inject
import models.{NewsPost, NewsPostDAO}
import play.api.mvc.InjectedController

import scala.concurrent.ExecutionContext

class News @Inject() (
  auth: Auth,
  newsPostDAO: NewsPostDAO,
  implicit val executionContext: ExecutionContext
) extends InjectedController with ControllerHelpers {

  def list() = auth.apply().async {
    newsPostDAO.list().map(toOkJsonArray(_))
  }

  def byId(id: Long) = auth.apply().async {
    newsPostDAO.byId(id).map(optToJson(_))
  }

  def updateOrCreate() = auth.apply().async(parse.json) { request =>
    readJson[NewsPost](request.body) { post =>
      if (post.id == 0) {
        log.change(request.userId, "inserting news post", request.body.toString)
        newsPostDAO.insert(post)
      } else {
        log.change(request.userId, "updating news post", request.body.toString)
        newsPostDAO.update(post)
      }
    }
  }

  def delete(id: Long) = auth.apply().async {
    newsPostDAO.delete(id)
  }
}
