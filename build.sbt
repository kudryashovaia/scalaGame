import sbtassembly.MergeStrategy

name := "scalaGame"

version := "1.0.0"

initialize := {
  val _ = initialize.value
  java.lang.System.setProperty("quill.macro.log", "false")
  java.lang.System.setProperty("http.port", "9010")
}

lazy val root = project.in(file("."))
  .enablePlugins(PlayScala, SbtWeb)
  .dependsOn(macros).aggregate(macros)

lazy val macros =
  project.in(file("macros"))
  .settings()

scalaVersion := "2.12.4"

scalacOptions ++= Seq(
  "-deprecation",
  "-unchecked",
  "-feature",
  "-language:implicitConversions",
  "-Xlint",
  "-Ywarn-value-discard",
  "-Ywarn-macros:after"
)

libraryDependencies ++= Seq(
  jdbc,
  ws,
  guice,

  "org.scalatest" %% "scalatest" % "3.0.5" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % "test",
  "com.typesafe.play" %% "play-test" % "2.6.12",

  "org.flywaydb" %% "flyway-play" % "4.0.0",
  "org.postgresql" % "postgresql" % "42.2.1",
  "org.mindrot" % "jbcrypt" % "0.4",
  "com.typesafe.play" %% "play-mailer" % "6.0.1",
  "commons-io" % "commons-io" % "2.6",
  "io.getquill" %% "quill-async-postgres" % "2.3.2",
  "com.typesafe.play" %% "play-json" % "2.6.9",
  "com.github.spullara.mustache.java" % "scala-extensions-2.12" % "0.9.5",
  "com.github.ben-manes.caffeine" % "caffeine" % "2.6.2",
  "org.apache.poi" % "poi-ooxml" % "3.17",
  "com.amazonaws" % "aws-java-sdk-s3" % "1.11.284",
  "net.coobird" % "thumbnailator" % "0.4.8",
  "com.enragedginger" %% "akka-quartz-scheduler" % "1.6.1-akka-2.5.x",
  "org.scala-lang.modules" %% "scala-async" % "0.9.7",

  "org.asynchttpclient" % "async-http-client" % "2.4.4",
  "io.netty" % "netty-all" % "4.1.22.Final"
)

pipelineStages := Seq(digest, gzip)

aggregate in test := false
aggregate in testOnly := false

assemblyJarName in assembly := "bitcluster.ru.jar"
mainClass in assembly := Some("play.core.server.ProdServerStart")
fullClasspath in assembly += Attributed.blank(PlayKeys.playPackageAssets.value)

val concatReversed = new MergeStrategy {
  val name = "concatReversed"
  def apply(tempDir: File, path: String, files: Seq[File]): Either[String, Seq[(File, String)]] = {
    MergeStrategy.concat.apply(tempDir, path, files.reverse)
  }
}

assemblyMergeStrategy in assembly := {
  case PathList("org", "apache", "commons", "logging", _*) => MergeStrategy.first
  case PathList("overview.html") => MergeStrategy.first
  case PathList("com", "zaxxer", "hikari", _*) => MergeStrategy.first
  case PathList("META-INF", "mailcap") => MergeStrategy.first
  case PathList("javax", "xml", _*) => MergeStrategy.first
  case PathList("META-INF", "io.netty.versions.properties") => MergeStrategy.first
  case PathList("play", "reference-overrides.conf") => MergeStrategy.concat
  case PathList("reference.conf") => concatReversed
  case PathList("ahc-default.properties") => MergeStrategy.filterDistinctLines
  case PathList("ahc-version.properties") => MergeStrategy.filterDistinctLines
  case x => (assemblyMergeStrategy in assembly).value.apply(x)
}

addCompilerPlugin("org.psywerx.hairyfotr" %% "linter" % "0.1.17")
scalacOptions += "-P:linter:disable:UseIfExpression+DuplicateIfBranches"

evictionWarningOptions in update :=
  EvictionWarningOptions.default.withGuessCompatible({ case (m1, m2, ivyScala) =>
    if (
      Set(
        "jsr305",
        "guava",
        "akka-stream_2.12",
        "akka-actor_2.12",
        "webjars-locator-core"
      ).contains(m1.name)
    ) {
      true
    } else {
      EvictionWarningOptions.default.guessCompatible(m1, m2, ivyScala)
    }
  })

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full)
