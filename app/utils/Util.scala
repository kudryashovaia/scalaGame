package utils

import com.github.mustachejava.DefaultMustacheFactory
import com.twitter.mustache.ScalaObjectHandler
import java.io.{BufferedInputStream, ByteArrayOutputStream, InputStream, StringReader, StringWriter}
import java.util.Base64
import scala.concurrent.{ExecutionContext, Future}

object Util {

  def base64encode(input: String) = Base64.getEncoder.encodeToString(input.getBytes("UTF-8"))
  def base64decode(input: String) = new String(Base64.getDecoder.decode(input), "UTF-8")

  def resourceAsBytes(resourceName: String): Array[Byte] = {
    inputStreamToBytes(getClass.getResourceAsStream(resourceName))
  }

  def resourceAsString(resourceName: String): String = {
    new String(resourceAsBytes(resourceName), "UTF-8")
  }

  def inputStreamToBytes(inputStream: InputStream): Array[Byte] = {
    if (inputStream == null) {
      sys.error("trying to read null input stream")
    }
    val bufferedInputStream = new BufferedInputStream(inputStream)
    val baos = new ByteArrayOutputStream()
    try {
      val buffer = new Array[Byte](4096)
      var readBytes = 0
      while ({readBytes = bufferedInputStream.read(buffer); readBytes != -1}) {
        baos.write(buffer, 0, readBytes)
      }
      baos.toByteArray
    } finally bufferedInputStream.close()
  }

  def readTemplate(resourceName: String, fields: Map[String, Any]): String = {
    val template = resourceAsString(resourceName)
    val out = new StringWriter()
    val mustacheFactory = new DefaultMustacheFactory()
    mustacheFactory.setObjectHandler(new ScalaObjectHandler)

    mustacheFactory
    .compile(new StringReader(template), "template")
    .execute(out, fields)

    out.toString
  }

  implicit class TrimmableStringOption(option: Option[String]) {
    def trim: Option[String] = option.map(_.trim).filter(_.nonEmpty)
  }

  def futureSerialSequence[A, B](in: Seq[A])(fn: A => Future[B])(implicit executor: ExecutionContext): Future[Seq[B]] = {
    if (in.isEmpty) {
      Future.successful(Nil)
    } else {
      fn(in.head).flatMap { headResult =>
        futureSerialSequence(in.tail)(fn)(executor).map(headResult +: _)(executor)
      }(executor)
    }
  }

  implicit class BigDecimalRounding(bigDecimal: BigDecimal) {
    def round(scale: Int): BigDecimal = bigDecimal.setScale(scale, BigDecimal.RoundingMode.HALF_EVEN)
  }

}
