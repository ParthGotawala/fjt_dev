using System;
using System.Collections.Generic;

namespace fjt.pricingservice.Model
{
    public  class AutoPricingSeller
    {
        public AutoPricingSeller ShallowCopy()
        {
            return (AutoPricingSeller)this.MemberwiseClone();
        }
        public string Sku { get; set; }
        public string SellerName { get; set; }
        public int? NoOfPosition { get; set; }
        public string HomePageUrl { get; set; }
        public string SellerUid { get; set; }
        public decimal InStockQuantity { get; set; }
        public decimal MinimumBuy { get; set; }
        public string ProductUrl { get; set; }
        public int? APILeadTime { get; set; }
        public string Packaging { get; set; }
        public bool? Authorized_Reseller { get; set; }
        public decimal Multiplier { get; set; }
        public DateTime? TimeStamp { get; set; }
        public Dictionary<int, string> PricesByReqQty { get; set; }
        public List<ComponentImages> ComponentImages { get; set; }
        public string OnOrderEta { get; set; }
        public string OnOrderQuantity { get; set; }
        public string RoHS { get; set; }
        public string NCNR { get; set; }
        public string Region { get; set; }
        public string Reeling { get; set; }
        public string Uom { get; set; }
        public string PricingType { get; set; }
        public string feature { get; set; }
        public string categoryText { get; set; }
        public string tolerance { get; set; }
        public double? minOperatingTemp { get; set; }
        public double? maxOperatingTemp { get; set; }
        public string dataSheetLink { get; set; }
        public DateTime? eolDate { get; set; }
        public string partPackage { get; set; }
        public string volatage { get; set; }
        public string partValue { get; set; }
        public string powerRating { get; set; }
        public int? noOfRows { get; set; }
        public string pitch { get; set; }
        public string pitchMating { get; set; }
        public string operatingTemp { get; set; }
        public string sizeDimension { get; set; }
        public string heightText { get; set; }
        public string weight { get; set; }
        public string mountingType { get; set; }
        public string connectorTypetext { get; set; }
        public double? tempratureCoefficientValue { get; set; }
        public string tempratureCoefficient { get; set; }
        public string color { get; set; }
        public string imageURL { get; set; }
        public string noOfPositionText { get; set; }
        public string noOfRowsText { get; set; }
        public string detailDescription { get; set; }
        public List<DataSheetURL> DataSheets { get; set; }
        public double? AdditionalValueFee { get; set; }

    }
}
