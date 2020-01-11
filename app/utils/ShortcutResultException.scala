package utils

import play.api.mvc.Result

case class ShortcutResultException(result: Result) extends Exception()
