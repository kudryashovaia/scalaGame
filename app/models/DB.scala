package models

import akka.actor.ActorSystem
import cats.effect.IO
import com.typesafe.config.ConfigFactory
import doobie.Transactor
import akka.actor.ActorSystem
import akka.stream.{ActorMaterializer, ActorMaterializerSettings, Supervision}

object DB {
  implicit val actorSystem: ActorSystem = ActorSystem("apiClient")

  private lazy val dbConfig = ConfigFactory.load().getConfig("database_connection")

  implicit lazy val cs = IO.contextShift(Context.executionContext)

  lazy val mode = Transactor.fromDriverManager[IO](
    dbConfig.getString("properties.driver"),
    dbConfig.getString("properties.sessionUrl"),
    dbConfig.getString("properties.user"),
    dbConfig.getString("properties.password")
  )
}

object Context {
  val stoppingDecider: Supervision.Decider = {
    case th: Throwable =>
      print(s"Error in event processing, event processing stopped, $th", th)
      Supervision.Stop
  }

  implicit val actorSystem: ActorSystem = ActorSystem("apiClient")

  implicit val materializer = ActorMaterializer(
    ActorMaterializerSettings(actorSystem).withSupervisionStrategy(stoppingDecider)
  )

  implicit val executionContext = actorSystem.dispatcher
}