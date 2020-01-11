package utils

import javax.inject.Inject

import play.api.Configuration

class ErrorLogger @Inject() (
  configuration: Configuration,
  smsService: SmsService,
  mailService: MailService
) {

  def send(ex: Throwable) {
    sendMobileNotification(ex.getMessage)
    sendEmailNotification(ex.getMessage, formatException(ex))
  }

  def send(log: Logger, ex: Throwable) {
    log.error(ex)
    send(ex)
  }

  def send(msg: String) {
    sendMobileNotification(msg)
    sendEmailNotification(msg, msg)
  }

  def send(log: Logger, msg: String) {
    log.error(msg)
    send(msg)
  }

  def send(log: Logger, message: String, ex: Throwable) {
    log.error(ex, message)
    send(ex)
  }


  def sendEmail(log: Logger, msg: String) {
    log.error(msg)
    sendEmailNotification(msg, msg)
  }

  def sendEmail(log: Logger, subject: String, body: String) {
    log.error(subject + ":\n" + body)
    sendEmailNotification(subject, body)
  }

  def sendEmail(log: Logger, ex: Throwable) {
    sendEmail(log, ex.getMessage, ex)
  }

  def sendEmail(log: Logger, message: String, ex: Throwable) {
    log.error(message)
    sendEmailNotification(message, formatException(ex))
  }


  private def sendMobileNotification(msg: String) {
    configuration.getOptional[Seq[String]]("notifications.errors.mobile").getOrElse(Nil).foreach { mobile =>
      smsService.send(mobile, "Err: " + msg)
    }
  }

  private def sendEmailNotification(subject: String, body: String) {
    configuration.getOptional[Seq[String]]("notifications.errors.email").getOrElse(Nil).foreach { email =>
      mailService.sendText(email, "bitcluster.ru error: " + subject, body)
    }
  }

  private def formatException(ex: Throwable): String = {
    val thisException = s"${ex.getClass.getName}: ${ex.getMessage}\n" +
      ex.getStackTrace.map(st => s"    ${st.getClassName}.${st.getMethodName}(${st.getFileName}:${st.getLineNumber})").mkString("\n")
    if (ex.getCause != null) {
      thisException + "\ncaused by: " + formatException(ex.getCause)
    } else {
      thisException
    }
  }

}
