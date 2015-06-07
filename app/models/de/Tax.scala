package models.de

import models.{AbstractTax, TaxTrait}
import play.api.libs.json.{Json, JsObject}
import services._

class Tax(earnedIncome: Double, municipality: String, age: Int) extends AbstractTax(earnedIncome) with models.TaxTrait {
  val basicAllowance = 1000
  val socialSecurity = new SocialSecurity(earnedIncome)
  val incomeTax = new IncomeTax(earnedIncome - (this.getIncomeTaxDeductions + this.basicAllowance))
  val solidaritySurcharge = new SolidaritySurcharge(this.getIncomeTax)
  val churchTax = new ChurchTax(this.getIncomeTax)

  def getIncomeTaxDeductions: Double = {
    this.socialSecurity.getSum
  }

  def getIncomeTax: Double = {
    this.incomeTax.getSum
  }

  def getSolidaritySurcharge: Double = {
    this.solidaritySurcharge.getSum
  }

  def getChurchTax: Double = {
    this.churchTax.getSum
  }

  def getSocialSecurity: Double = {
    this.socialSecurity.getSum
  }

  def getTotalTax: Double = {
    this.getIncomeTax + this.getSolidaritySurcharge + this.getChurchTax + this.getSocialSecurity
  }

  def getTotalTaxPercentage: Double = {
    this.getPercentage(this.getIncomeTax)
  }

  def getJson: JsObject = {
    Json.obj(
      "incomeTax" -> this.incomeTax.getJson,
      "solidaritySurcharge" -> this.solidaritySurcharge.getJson,
      "churchTax" -> this.churchTax.getJson,
      "socialSecurity" -> this.socialSecurity.getJson,
      "totalTax" -> this.getTotalTax,
      "totalTaxPercentage" -> this.getTotalTaxPercentage
    )
  }
}