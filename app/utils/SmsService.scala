package utils

import akka.actor._
import javax.inject.{Inject, Named, Singleton}
import play.api.Configuration
import play.api.libs.ws.WSClient
import scala.concurrent.{ExecutionContext, Future}

class SmsService @Inject() (
  @Named("sms-service-actor") smsServiceActor: ActorRef
) extends Logging {

  def send(phoneNumber: String, text: String) {
    smsServiceActor ! SmsServiceActor.SendSms(phoneNumber, text)
  }

}

object SmsServiceActor {
  case class SendSms(phoneNumber: String, text: String)
}

@Singleton
class SmsServiceActor @Inject() (
  ws: WSClient,
  configuration: Configuration,
  futureHelpers: FutureHelpers,
  errorLogger: ErrorLogger,
  implicit val executionContext: ExecutionContext
) extends Actor with Logging {
  import SmsServiceActor._

  private var sentOutBalanceWarning = false
  private var sentOutBalanceError = false

  private val sentMessages = new scala.collection.mutable.HashMap[SendSms, Long]()

  override def receive = futureHelpers.logActorExceptions(log) {
    case snd @ SendSms(phoneNumber, text) =>
      if (sentMessages.get(snd).exists(_ > System.currentTimeMillis() - 600 * 1000)) {
        log.warn("not sending out duplicate sms to %s with text '%s'", phoneNumber, text)
      } else {
        log.info("sending message to %s with text '%s'", phoneNumber, text)
        sentMessages.put(snd, System.currentTimeMillis())

        futureHelpers.fireAndForgetFutureAnyType(log)(
          getSessionID().flatMap { sessionId =>
            checkBalance(sessionId).flatMap {
              case None =>
                log.error(s"can't determine sms service balance - can't send sms to $phoneNumber")
                Future.successful(())
              case Some(balance) =>
                if (balance > 2) {
                  sendMessage(sessionId, phoneNumber, text)
                } else {
                  log.error(s"insufficient sms service balance - can't send sms to $phoneNumber")
                  if (!sentOutBalanceError && !configuration.getOptional[Boolean]("sms.ignoreSendErrors").getOrElse(false)) {
                    errorLogger.sendEmail(log, s"Insufficient sms service balance: $balance RUB")
                    sentOutBalanceError = true
                  }
                  Future.successful(())
                }
            }
          }
          .recover {
            case ex: Throwable =>
              if (!configuration.getOptional[Boolean]("sms.ignoreSendErrors").getOrElse(false)) {
                errorLogger.sendEmail(log, ex)
              }
          }
        )
      }
  }

  private def getSessionID(): Future[String] = {
    (for {
      login <- configuration.getOptional[String]("sms.login")
      password <- configuration.getOptional[String]("sms.password")
    } yield {
      ws.url(s"https://integrationapi.net/rest/user/sessionid")
      .withQueryStringParameters(
        "login" -> login,
        "password" -> password
      )
      .get()
      .map { response =>
        log.debug(s"session id result: ${response.status}, ${response.statusText}")
        if (response.status == 200) {
          val sessionId = response.json.as[String]
          log.debug("session id: %s", sessionId)
          sessionId
        } else {
          throw new Exception(s"failed when getting session id, response from server: ${response.body}")
        }
      }
    }).getOrElse(Future.failed(new Exception("no sms service credentials found")))
  }



  private def checkBalance(sessionId: String): Future[Option[Double]] = {
    ws.url(s"https://integrationapi.net/rest/user/balance")
    .withQueryStringParameters(
      "SessionID" -> sessionId
    )
    .get()
    .map { response =>
      val balance = response.json.as[Double]
      log.debug(s"sms service balance: $balance")
      if (balance < 3000 && !configuration.getOptional[Boolean]("sms.ignoreSendErrors").getOrElse(false) && !sentOutBalanceWarning) {
        errorLogger.sendEmail(log, s"Impending insufficient balance for sms service: $balance RUB")
        sentOutBalanceWarning = true
      }
      Some(balance)
    }
    .recover {
      case ex: Throwable =>
        errorLogger.sendEmail(log, "Failed to get sms balance", ex)
        None
    }
  }


  private def sendMessage(sessionId: String, phoneNumber: String, text: String): Future[Unit] = {
    ws.url(s"https://integrationapi.net/rest/sms/send")
    .withQueryStringParameters(
      "SessionID" -> sessionId,
      "DestinationAddress" -> phoneNumber,
      "SourceAddress" -> "BitCluster",
      "Data" -> text
    )
    .post(Array[Byte]())
    .map { response =>
      log.debug(s"message send result: ${response.status}, ${response.statusText}")
      if (response.status == 200) {
        log.debug(s"successfully sent message to $phoneNumber")
        ()
      } else {
        val faultString = (response.json \\ "Desc").headOption.map(_.as[String]).getOrElse("")
        if (faultString.contains("Invalid destination address")) {
          log.debug(s"failed to send message to invalid address: $phoneNumber")
          ()
        } else {
          throw new Exception(s"failed to send message, response from server: ${response.body}")
        }
      }
    }
  }

}
