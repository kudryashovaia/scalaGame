package models

import io.getquill.MappedEncoding
import play.api.libs.json.{JsObject, Json}
import scala.concurrent.Future
import utils.UnauthorizedException

trait QuillHelpers {

  def assertUpdate(result: Long): Unit = {
    if (result != 1 && result != 0) {
      throw new Exception(s"expected update result to equal 0 or 1, but got ${result}")
    }
  }

  def assertBatchUpdate(result: Long): Unit = {
    if (result < 0) {
      throw new Exception(s"expected update result to be >= 0, but got ${result}")
    }
  }

  def assertInsert(result: Long): Unit = {
    if (result <= 0) {
      throw new Exception(s"expected insert result to be > 0, but got ${result}")
    }
  }

  def assertDelete(result: Long): Unit = {
    if (result != 1) {
      throw new Exception(s"expected delete result to equal 1, but got ${result}")
    }
  }

  def Forbidden = Future.failed(new UnauthorizedException)
  def throwForbidden() = throw new UnauthorizedException

  implicit val jsObjectEncoder = MappedEncoding[JsObject, String](obj => Json.stringify(obj))
  implicit val jsObjectDecoder = MappedEncoding[String, JsObject](str => Json.parse(str).as[JsObject])

}
