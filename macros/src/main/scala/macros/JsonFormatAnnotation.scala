package macros

import scala.annotation.StaticAnnotation
import scala.language.experimental.macros
import scala.reflect.macros.whitebox.Context

class JsonFormatAnnotation extends StaticAnnotation {
  def macroTransform(annottees: Any*): Any = macro JsonFormatAnnotationMacro.impl
}
object JsonFormatAnnotationMacro {
  def impl(c: Context)(annottees: c.Expr[Any]*): c.Expr[Any] = {
    import c.universe._

    val inputs: List[c.universe.Tree] = annottees.map(_.tree).toList
    val outputs: List[c.universe.Tree] = inputs match {
     case (cd @ ClassDef(_, cName, _, _)) :: tail =>
       val mod0: ModuleDef = tail match {
         case (md @ ModuleDef(_, mName, mTemp)) :: Nil if cName.decodedName.toString == mName.decodedName.toString => md

         case Nil =>
           val cMod = cd.mods
           var mModF = NoFlags
           if (cMod hasFlag Flag.PRIVATE) {
             mModF |= Flag.PRIVATE
           }
           if (cMod hasFlag Flag.PROTECTED) {
             mModF |= Flag.PROTECTED
           }
           if (cMod hasFlag Flag.LOCAL) {
             mModF |= Flag.LOCAL
           }
           val mMod = Modifiers(mModF, cMod.privateWithin, Nil)

           val mkSuperSelect = Select(Super(This(typeNames.EMPTY), typeNames.EMPTY), termNames.CONSTRUCTOR)
           val superCall = Apply(mkSuperSelect, Nil)
           val constr = DefDef(NoMods, termNames.CONSTRUCTOR, Nil, List(Nil), TypeTree(), Block(List(superCall), Literal(Constant(()))))

           val mTemp = Template(parents = List(TypeTree(typeOf[AnyRef])), self = noSelfType, body = constr :: Nil)
           val mName = TermName(cName.decodedName.toString) // or encoded?

           ModuleDef(mMod, mName, mTemp)

         case _ => c.abort(c.enclosingPosition, "Expected a companion object")
       }

       val Template(mTempParents, mTempSelf, mTempBody0) = mod0.impl

       val cTpe = Ident(TypeName(cd.name.decodedName.toString))
       val jsonFormatVal = q"implicit val ${TermName("jsonFormat")} = _root_.ai.x.play.json.Jsonx.formatCaseClassUseDefaults[$cTpe]"
       val mTempBody1 = jsonFormatVal :: mTempBody0
       val mTemp1 = Template(mTempParents, mTempSelf, mTempBody1)
       val mod1 = ModuleDef(mod0.mods, mod0.name, mTemp1)

       cd :: mod1 :: Nil

     case _ => c.abort(c.enclosingPosition, "Must annotate a class or trait")

    }

    c.Expr[Any](Block(outputs, Literal(Constant(()))))
  }
}
