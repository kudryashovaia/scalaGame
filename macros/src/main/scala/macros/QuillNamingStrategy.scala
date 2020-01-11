package macros

import io.getquill.NamingStrategy

object QuillNamingStrategy extends NamingStrategy {

  override def default(s: String) = {
    (s.toList match {
      case c :: tail => c.toLower +: snakeCase(tail)
      case Nil       => Nil
    }).mkString
  }

  override def table(s: String) = {
    s match {
      case "PermissionFunctionality" => "permission_functionality"
      case "PermissionLocation" => "permission_location"
      case "MiningHistory" => "mining_history"
      case "MinerMonitoringHistory" => "miner_monitoring_history"
      case t if t.endsWith("s") => default(t)
      case t => default(t + "s")
    }
  }

  private def snakeCase(s: List[Char]): List[Char] = {
    val (upperCase, rest) = s.span(_.isUpper)
    if (upperCase.size > 1) {
      upperCase.map(_.toLower) ++ snakeCase(rest)
    } else if (upperCase.size == 1) {
      List('_', upperCase.head.toLower) ++ snakeCase(rest)
    } else {
      rest match {
        case c :: tail => c +: snakeCase(tail)
        case Nil => Nil
      }
    }
  }
}
