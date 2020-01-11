scalaVersion := "2.12.4"

scalacOptions += "-deprecation"

libraryDependencies ++= Seq(
  "org.scala-lang" % "scala-compiler" % "2.12.4",
  "org.scala-lang" % "scala-reflect" % "2.12.4",
  "com.typesafe.play" %% "play-json" % "2.6.8",
  "ai.x" %% "play-json-extensions" % "0.10.0",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test",
  "io.getquill" %% "quill-async-postgres" % "2.3.2"
)

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full)
