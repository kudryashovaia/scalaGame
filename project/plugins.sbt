addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.12")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.3")

addSbtPlugin("com.typesafe.sbt" % "sbt-gzip" % "1.0.2")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.5")

evictionWarningOptions in update :=
  EvictionWarningOptions.default.withGuessCompatible({ case (m1, m2, ivyScala) =>
    if (
      Set(
        "org.eclipse.sisu.plexus",
        "org.eclipse.sisu.inject",
        "sisu-guice",
        "plexus-utils",
        "aopalliance",
        "guava",
        "webjars-locator-core"
      ).contains(m1.name)
    ) {
      true
    } else {
      EvictionWarningOptions.default.guessCompatible(m1, m2, ivyScala)
    }
  })
