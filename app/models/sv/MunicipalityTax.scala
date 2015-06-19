package models.sv

import models.{SubTaxTrait, SubTaxObjectTrait, substractUntilZero}
import services.svKronaToEuro

import play.api.Logger
import play.api.libs.json.{Json, JsObject}

class MunicipalityTax(taxableIncome: Double, municipality: String, age: Int) extends SubTaxTrait {
  val municipalityPercents = Map[String, Double]("Stockholm" -> 0.1768)
  val countyPercents = Map[String, Double]("Stockholm" -> 0.1210)
  val churchPercents = Map[String, Double]("Adolf Fred." -> 0.0098)
  val churches = Map[String, List[String]]("Stockholm" -> List[String]("Adolf Fred."))
  val funeralPercents = Map[String, Double]("Stockholm" -> 0.00075)

  val municipalityPercent = this.municipalityPercents.get(this.municipality).get
  val countyPercent = this.countyPercents.get(this.municipality).get
  val church = "Adolf Fred."
  val churchPercent = this.churchPercents.get(this.church).get
  val funeralPercent = this.funeralPercents.get(this.municipality).get
  
  var municipalityTax: Double = -1
  var countyTax: Double = -1
  var churchPayment: Double = -1
  var funeralPayment: Double = -1
  var totalTax: Double = -1

  var municipalityTaxDeduction: Double = -1
  var countyTaxDeduction: Double = -1
  var churchPaymentDeduction: Double = -1
  var funeralPaymentDeduction: Double = -1
  var totalTaxDeduction: Double = -1

  def getMunicipalityTax: Double = {
    if (this.municipalityTax < 0) {
      this.municipalityTax = this.municipalityPercent * this.taxableIncome
    }
    this.municipalityTax
  }

  def getCountyTax: Double = {
    if (this.countyTax < 0) {
      this.countyTax = this.countyPercent * this.taxableIncome
    }
    this.countyTax
  }

  def getMunicipalityAndCountyTax: Double = {
    this.getMunicipalityTax + this.getCountyTax
  }

  def getChurchPayment: Double = {
    if (this.churchPayment < 0) {
      this.churchPayment = this.churchPercent * this.taxableIncome
    }
    this.churchPayment
  }

  def getFuneralPayment: Double = {
    if (this.funeralPayment < 0) {
      this.funeralPayment = this.funeralPercent * this.taxableIncome
    }
    this.funeralPayment
  }

  def getSum() = {
    this.getTotalTax
  }

  def getTotalTax: Double = {
    if (this.totalTax < 0) {
      this.totalTax = this.calculateTotalTax
    }

    this.totalTax
  }

  def calculateTotalTax: Double = {
    this.getMunicipalityTax + this.getCountyTax + this.getChurchPayment + this.getFuneralPayment
  }

  def updateTotalTax = {
    this.totalTax = this.calculateTotalTax
  }

  def getMunicipalityPercent: Double = {
    this.municipalityPercent
  }

  def getCountyPercent: Double = {
    this.countyPercent
  }

  def getMunicipalityAndCountyPercent: Double = {
    this.getMunicipalityPercent + this.getCountyPercent
  }
  
  def deductTaxCredit(totalTax: Double, taxCredit: Double, pensionContribution: Double) = {
    Logger.debug("deducting muni")
    Logger.debug(pensionContribution.toString)
    this.municipalityTaxDeduction = this.getMunicipalityTax / totalTax * taxCredit + this.getMunicipalityTax / this.getMunicipalityAndCountyTax * pensionContribution
    this.municipalityTax = substractUntilZero(this.municipalityTax, this.municipalityTaxDeduction)
    this.countyTaxDeduction = this.getCountyTax / totalTax * taxCredit + this.getCountyTax / this.getMunicipalityAndCountyTax * pensionContribution
    this.countyTax = substractUntilZero(this.countyTax, this.countyTaxDeduction)
    this.churchPaymentDeduction = (this.churchPayment / totalTax * taxCredit)
    this.churchPayment = substractUntilZero(this.churchPayment, this.churchPaymentDeduction)
    this.funeralPaymentDeduction = (this.funeralPayment / totalTax * taxCredit)
    this.funeralPayment = substractUntilZero(this.funeralPayment, this.funeralPaymentDeduction)
    this.updateTotalTax
  }

  def getJson: JsObject = {
    Json.obj(
      "municipalityTax" -> svKronaToEuro(this.getMunicipalityTax),
      "countyTax" -> svKronaToEuro(this.getCountyTax),
      "municipalityAndCountyTax" -> svKronaToEuro(this.getMunicipalityAndCountyTax),
      "municipalityAndCountyPercent" -> this.getMunicipalityAndCountyPercent,
      "churchPayment" -> svKronaToEuro(this.getChurchPayment),
      "funeralPayment" -> svKronaToEuro(this.getFuneralPayment),
      "totalTax" -> svKronaToEuro(this.getTotalTax)
    )
  }
}

object MunicipalityTax extends SubTaxObjectTrait {
  val name = "Kunnallisvero"
}
