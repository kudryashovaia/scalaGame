package utils

import play.api.libs.json.{JsArray, JsNumber, JsObject, JsString}

object ConfigTemplateUtils {

  def applyWalletTemplate(originWallet: Option[JsObject], minerWallet: Option[JsObject], index: Int) = {
    applyConfigChange(originWallet, minerWallet)(
      applyWorkerNumberFieldChange(index, minerWallet),
      applyConfigFieldChange("pool", minerWallet),
      applyConfigFieldChange("wallet", minerWallet),
      c => {
        val minerPoolsOpt = minerWallet.flatMap(w => (w \ "pools").asOpt[Seq[JsObject]])
        (c \ "pools").asOpt[Seq[JsObject]].map { templatePools =>
          val minerPools = minerPoolsOpt.getOrElse(Nil)
          c + ((
            "pools",
            JsArray(
              (0 until math.max(minerPools.size, templatePools.size)).flatMap { poolIndex =>
                val templatePool = templatePools.lift(poolIndex)
                val minerPool = minerPools.lift(poolIndex)
                applyConfigChange(templatePool, minerPool)(
                  applyConfigFieldChange("url", minerPool),
                  applyConfigFieldChange("workerPrefix", minerPool),
                  applyWorkerNumberFieldChange(index, minerPool),
                  applyConfigFieldChange("pass", minerPool)
                )
              }
            )
          ))
        }.orElse(
          minerPoolsOpt.map { pools =>
            c + (("pools", JsArray(pools)))
          }
        ).getOrElse(c)
      }
    )
  }

  def applyConfigTemplate(templateConfig: Option[JsObject], minerConfig: Option[JsObject]) = applyConfigChange(templateConfig, minerConfig)(
    applyConfigFieldChange("additionalClaymoreOptions", minerConfig)
  )

  private def applyConfigChange(
    templateConfigOpt: Option[JsObject],
    minerConfigOpt: Option[JsObject]
  )(transforms: (JsObject => JsObject)*): Option[JsObject] = {
    templateConfigOpt.map { templateConfig =>
      transforms.foldLeft(templateConfig)((c, op) => op(c))
    }.orElse(minerConfigOpt)
  }

  private def applyConfigFieldChange(fieldName: String, minerConfig: Option[JsObject]): JsObject => JsObject = {
    (c: JsObject) => {
      (c \ fieldName).asOpt[String]
        .orElse(minerConfig.flatMap(c => (c \ fieldName).asOpt[String]))
        .map { options =>
          c + ((fieldName, JsString(options)))
        }.getOrElse(c)
    }
  }

  private def applyWorkerNumberFieldChange(index: Int, minerConfig: Option[JsObject]): JsObject => JsObject = {
    (c: JsObject) => {
      (c \ "workerNumberRangeStart").asOpt[Int].map { rangeStart =>
        (c + (("workerNumber", JsNumber(rangeStart + index)))
          - "workerNumberRangeStart"
          - "workerNumberRangeEnd")
      }.orElse(
        minerConfig.flatMap(c => (c \ "workerNumber").asOpt[Int]).map { workerNumber =>
          c + (("workerNumber", JsNumber(workerNumber)))
        }
      ).getOrElse(c)
    }
  }
}
