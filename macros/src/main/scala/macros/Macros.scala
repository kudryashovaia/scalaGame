package macros

import scala.language.experimental.macros
import scala.reflect.macros.blackbox.Context

object Macros {

  def debug(fn: => Unit): Unit = macro _debug
  def _debug(c: Context)(fn: c.Expr[Any]): c.Expr[Unit] = {
    import c.universe._
    if (sys.env.get("ELIDE_DEBUG").map(_.toLowerCase) == Some("true")) {
      reify(())
    } else {
      c.Expr[Unit](fn.tree)
    }
  }


  def printd(expr: Any): Unit = macro _printd
  def _printd(c: Context)(expr: c.Expr[Any]): c.Expr[Unit] = {
    import c.universe._
    val rhs = expr.tree.toString.split("\n").mkString(" ")
    c.Expr[Unit](q""" println($rhs + " = " + $expr.toString) """)
  }

  def massert(expr: Boolean): Unit = macro _massert
  def _massert(c: Context)(expr: c.Expr[Boolean]): c.Expr[Unit] = {
    import c.universe._
    val rhs = expr.tree.toString.split("\n").mkString(" ")
    c.Expr[Unit](q""" (if (!$expr) { throw new AssertionError($rhs) }) """)
  }

  def ifdef(name: String, value: String)(fn: => Unit): Unit = macro _ifdef
  def _ifdef
    (c: Context)
    (name: c.Expr[String], value: c.Expr[String])
    (fn: c.Expr[Any])
    : c.Expr[Unit] = {
    import c.universe._

    val Literal(Constant(nm: String)) = name.tree
    val Literal(Constant(vl: String)) = value.tree
    if (sys.env.get(nm) == Some(vl)) {
      c.Expr[Unit](fn.tree)
    } else {
      reify(())
    }
  }

  def ifndef(name: String, value: String)(fn: => Unit): Unit = macro _ifndef
  def _ifndef
    (c: Context)
    (name: c.Expr[String], value: c.Expr[String])
    (fn: c.Expr[Any])
    : c.Expr[Unit] = {
    import c.universe._

    val Literal(Constant(nm: String)) = name.tree
    val Literal(Constant(vl: String)) = value.tree
    if (sys.env.get(nm) != Some(vl)) {
      c.Expr[Unit](fn.tree)
    } else {
      reify(())
    }
  }

}
