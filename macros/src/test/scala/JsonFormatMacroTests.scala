import macros.{JsonFormatAnnotation}
import org.scalatest.{FunSuite, Matchers}
import play.api.libs.json.Json

class JsonFormatMacroTests extends FunSuite with Matchers {

  @JsonFormatAnnotation case class T1(a: Int)
  test("read simple case class") {
    Json.parse(""" {"a":42} """).as[T1] shouldBe T1(42)
  }
  test("write simple case class") {
    Json.stringify(Json.toJson(T1(42))) shouldBe """ {"a":42} """.trim
  }

  @JsonFormatAnnotation case class T2(a: Int = 42)
  test("fill missing values with default values") {
    Json.parse(""" {} """).as[T2] shouldBe T2(42)
  }
//  test("use default if null is passed") {
//    Json.parse(""" {"a": null} """).as[T2] shouldBe T2(42)
//  }

  @JsonFormatAnnotation case class T3(a: Option[Int])
  test("use None if no value is provided for Option field") {
    Json.parse(""" {} """).as[T3] shouldBe T3(None)
  }

  @JsonFormatAnnotation case class T4(a: Seq[Int] = Nil)
  test("parse primitive sequence field") {
    Json.parse(""" {"a":[1,2,3]} """).as[T4] shouldBe T4(Seq(1,2,3))
  }
  test("use default empty sequence if field is not provided") {
    Json.parse(""" {} """).as[T4] shouldBe T4(Nil)
  }

  @JsonFormatAnnotation case class T5_1(b: Int = 42)
  @JsonFormatAnnotation case class T5(a: T5_1 = T5_1(45))
  test("parse nested case classes") {
    Json.parse(""" {"a":{"b":43}} """).as[T5] shouldBe T5(T5_1(43))
  }
  test("use default value for nested case class field") {
    Json.parse(""" {"a":{}} """).as[T5] shouldBe T5(T5_1(42))
  }
  test("use default case class value for enclosing case class") {
    Json.parse(""" {} """).as[T5] shouldBe T5(T5_1(45))
  }

  @JsonFormatAnnotation case class T6_1(b: Int)
  @JsonFormatAnnotation case class T6(a: Option[T6_1])
  test("parse optional nested case class") {
    Json.parse(""" {"a":{"b":43}} """).as[T6] shouldBe T6(Some(T6_1(43)))
  }
  test("use None when provided with missing optional nested case class") {
    Json.parse(""" {} """).as[T6] shouldBe T6(None)
  }

  @JsonFormatAnnotation case class T7_1(b: Int)
  @JsonFormatAnnotation case class T7(a: Seq[T7_1])
  test("parse sequence of nested case classes") {
    Json.parse(""" {"a":[{"b":43},{"b":44}]} """).as[T7] shouldBe T7(Seq(T7_1(43), T7_1(44)))
  }

}
