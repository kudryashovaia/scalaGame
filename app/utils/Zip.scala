package utils

import java.io._
import java.util.zip._

import org.apache.commons.io.IOUtils

object Zip {

  def readFiles(stream: InputStream): List[(String, Array[Byte])] = {
    val zipin = new ZipInputStream(stream)
    Iterator.continually(zipin.getNextEntry).takeWhile(_ != null).map { entry =>
      (entry.getName, IOUtils.toByteArray(zipin))
    }.toList
  }

  def writeFiles(files: List[(String, Array[Byte])]): Array[Byte] = {
    val out = new ByteArrayOutputStream()
    val zipout = new ZipOutputStream(out)
    files.foreach { case (name, content) =>
      zipout.putNextEntry(new ZipEntry(name))
      IOUtils.write(content, zipout)
    }
    zipout.close()
    out.close()
    out.toByteArray
  }

}
