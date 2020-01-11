package utils

import java.io.ByteArrayInputStream
import java.util.regex.{Matcher, Pattern}

class DocxWrapper(resourceName: String) {
  val files = Zip.readFiles(getClass.getResourceAsStream(resourceName))

  val commentNameToId: Seq[(String, Int)] =
    files.find(_._1 == "word/comments.xml").map { case (_, data) =>
      val commentsXml = scala.xml.XML.load(new ByteArrayInputStream(data))
      (commentsXml \\ "comment").map(c => c.text -> c.attributes.asAttrMap("w:id").toInt)
    }.getOrElse(Nil)

  var document = new String(files.find(_._1 == "word/document.xml").get._2, "UTF-8")

  case class TransformerArgs(matcher: Matcher, fontSettings: String, buffer: StringBuffer)

  def transformComment(commentName: String, transformer: TransformerArgs => Unit) {
    val commentIds = commentNameToId.filter(_._1 == commentName).map(_._2)
    commentIds.foreach { id =>

      val commentRangePattern = Pattern.compile(
        "<w:commentRangeStart w:id=\"" + id + "\"/>" +
          ".*" +
          "<w:commentRangeEnd w:id=\"" + id + "\"/>"
      )

      val fontSettingsPattern = Pattern.compile("<w:rPr>.*?</w:rPr>")

      val matcher = commentRangePattern.matcher(document)

      val buffer = new StringBuffer()
      while (matcher.find()) {
        val fontSettingsMatcher = fontSettingsPattern.matcher(matcher.group())
        val fontSettings =
          if (fontSettingsMatcher.find()) fontSettingsMatcher.group()
          else ""

        transformer(TransformerArgs(matcher, fontSettings, buffer))
      }
      matcher.appendTail(buffer)
      document = buffer.toString

      val commentReferencePattern = Pattern.compile("<w:commentReference w:id=\"" + id + "\"/>")
      document = commentReferencePattern.matcher(document).replaceAll("")
    }
  }

  def replaceComment(commentName: String, text: String) {
    transformComment(commentName, { case TransformerArgs(matcher, fontSettings, buffer) =>
      matcher.appendReplacement(buffer, "<w:r>" + fontSettings + "<w:t>" + text)
      val _ = buffer.append("</w:t>").append("</w:r>")
    })
  }

  def fillTable[A](commentName: String, items: Seq[A], rowXmlTransformer: (String, A) => String) {
    transformComment(commentName, { case TransformerArgs(matcher, _, buffer) =>
      val table = matcher.group()

      matcher.appendReplacement(buffer, "")

      val rowPattern = Pattern.compile("<w:tr>.*?</w:tr>")
      val rowMatcher = rowPattern.matcher(table)

      // header row
      if (!rowMatcher.find()) {
        throw new Exception("table header row not found!")
      } else {
        rowMatcher.appendReplacement(buffer, rowMatcher.group())

        // data row
        if (!rowMatcher.find()) {
          throw new Exception("table template row not found!")
        } else {
          val rowTemplate = rowMatcher.group()

          rowMatcher.appendReplacement(buffer, "")

          items.foreach { item =>
            buffer.append(rowXmlTransformer(rowTemplate, item))
          }

          val _ = rowMatcher.appendTail(buffer)
        }
      }

    })
  }

  def removeAllComments() {
    document = document
      .replaceAll("<w:commentRangeStart w:id=\"\\d+\"/>", "")
      .replaceAll("<w:commentRangeEnd w:id=\"\\d+\"/>", "")
      .replaceAll("<w:commentReference w:id=\"\\d+\"/>", "")
  }

  def toByteArray(): Array[Byte] = {
    Zip.writeFiles(files.map {
      case (name, bytes) if name == "word/document.xml" =>
        (name, document.getBytes("UTF-8"))
      case other => other
    })
  }
}
