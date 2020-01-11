package utils

import java.net.URLEncoder
import play.api.mvc.{BaseController, Result}

trait ResultContentTypes extends BaseController {
  implicit class ExtResponse(result: Result) {

    def asXLS(filename: String) = {
      result.withHeaders(
        "Content-Disposition" -> ("attachment; filename=\"" + URLEncoder.encode(filename, "UTF-8").replace("+", "%20") + "\""),
        "Content-Transfer-Encoding" -> "binary"
      ).as("application/vnd.ms-excel")
    }

    def asDOCX(filename: String) = {
      result.withHeaders(
        "Content-Disposition" -> ("attachment; filename=\"" + URLEncoder.encode(filename, "UTF-8").replace("+", "%20") + "\""),
        "Content-Transfer-Encoding" -> "binary"
      ).as("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    }

    def asHTML() = {
      result.withHeaders("Content-Type" -> "text/html")
    }

    def asPDF() = {
      result.withHeaders(
        "Content-Disposition" -> "inline",
        "Content-Transfer-Encoding" -> "binary"
      ).as("application/pdf")
    }

    def asTextAttachment(filename: String) = {
      result.withHeaders(
        "Content-Disposition" -> ("attachment; filename=\"" + URLEncoder.encode(filename, "UTF-8").replace("+", "%20") + "\""),
        "Content-Transfer-Encoding" -> "binary"
      ).as("text/plain")
    }
  }
}
