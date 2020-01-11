package utils

import akka.actor._
import javax.inject.{Inject, Named, Singleton}
import play.api.Configuration
import play.api.libs.ws.{WSAuthScheme, WSClient}
import scala.concurrent.{ExecutionContext, Future}

class MailService @Inject() (
  @Named("mail-service-actor") mailServiceActor: ActorRef
) {

  import MailServiceActor._

  def sendText(to: String, subject: String, body: String) {
    send(List(to), Nil, subject, body, Text)
  }

  def send(to: List[String], cc: List[String], subject: String, body: String, bodyType: BodyType) {
    mailServiceActor ! MailServiceActor.SendEmail(to, cc, subject, body, bodyType)
  }

  def sendTemplate(to: String, resourceName: String, fields: Map[String, Any]) {
    val template = Util.readTemplate(resourceName, fields)

    val subjectRegex = """^Subject:(.*)\n""".r
    val subject =
      subjectRegex
        .findFirstMatchIn(template)
        .map(_.group(1))
        .getOrElse(throw new Exception(s"no subject in email template ${resourceName}"))
        .trim
    val body =
      subjectRegex.replaceFirstIn(template, "")

    if (resourceName.endsWith(".html")) {
      mailServiceActor ! SendEmail(List(to), Nil, subject, body, Html)
    } else {
      mailServiceActor ! SendEmail(List(to), Nil, subject, body, Text)
    }
  }

}

object MailServiceActor {
  sealed trait BodyType { def value: String }
  case object Text extends BodyType { def value = "text" }
  case object Html extends BodyType { def value = "html" }

  case class SendEmail(
    to: Seq[String],
    cc: Seq[String],
    subject: String,
    body: String,
    bodyType: BodyType
  )
}

@Singleton
class MailServiceActor @Inject() (
  ws: WSClient,
  configuration: Configuration,
  futureHelpers: FutureHelpers,
  errorLogger: ErrorLogger,
  implicit val executionContext: ExecutionContext
) extends Actor with Logging {
  import MailServiceActor._

  override def receive: Receive = futureHelpers.logActorExceptions(log) {
    case SendEmail(to, cc, subject, body, bodyType) =>
      log.info(s"sending email to $to, cc $cc, '$subject'\n$body")
      futureHelpers.fireAndForgetFuture(log)(
        (for {
          domain <- configuration.getOptional[String]("mailgun.domain")
          key <- configuration.getOptional[String]("mailgun.key")
          sourceAddress <- configuration.getOptional[String]("mailgun.sourceAddress")
        } yield {
          ws.url(s"https://api.mailgun.net/v3/${domain}/messages")
            .withAuth("api", key, WSAuthScheme.BASIC)
            .post(Map(
              "from" -> Seq(sourceAddress),
              "to" -> Seq(to.mkString(",")),
              "cc" -> Seq(cc.mkString(",")).filter(_.nonEmpty),
              "subject" -> Seq(subject),
              bodyType.value -> Seq(body)
            ))
            .map { response =>
              if (response.status != 200) {
                log.error(s"Failed to send email to ${to}, response from mailgun: ${response.body}")
              }
              ()
            }
        }).getOrElse({
          log.warn("No Mailgun credentials found in config - unable to send email")
          Future.successful(())
        })
      )
  }
}

