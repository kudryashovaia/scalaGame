package models.user

import macros.JsonFormatAnnotation
import org.mindrot.jbcrypt.BCrypt
import scala.util.Random

@JsonFormatAnnotation
case class User(
  id: Long = 0,
  login: String,
  password: String,
  isAdmin: Boolean = false
)

object User {

  def hashPassword(password: String): String = {
    BCrypt.hashpw(password, BCrypt.gensalt(8))
  }

  def checkPassword(password: String, user: User): Boolean =
    try {
      BCrypt.checkpw(password, user.password)
    } catch {
      case _: Throwable => false
    }

  def generatePassword(): String = {
    val chars = "abcdefghjkmnpqrstuvwxyzACDEFGHJKMNPRSTUVWXYZ"
    val digits = "0123456789"
    val r = new Random()
    List.fill(3)(digits(r.nextInt(digits.length))).mkString + List.fill(7)(chars(r.nextInt(chars.length))).mkString
  }
}

