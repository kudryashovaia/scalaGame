package models

import com.typesafe.config.ConfigFactory
import io.getquill.PostgresAsyncContext
import javax.inject.Inject
import play.api.Configuration
import scala.collection.JavaConverters._
import macros.QuillNamingStrategy

class DB @Inject() (configuration: Configuration) {
  val context = new PostgresAsyncContext(QuillNamingStrategy, ConfigFactory.parseMap(Map(
    "host" -> configuration.get[String]("db.default.host"),
    "port" -> configuration.get[String]("db.default.port"),
    "database" -> configuration.get[String]("db.default.database"),
    "user" -> configuration.get[String]("db.default.username"),
    "password" -> Option(configuration.get[String]("db.default.password")).filter(_.nonEmpty).orNull,
    "charset" -> "UTF-8",
    "poolMaxQueueSize" -> 256 * 256
  ).asJava))
}
