using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.MySqlDBModel
{
    [Table("mfgcodemst")]
    public class Mfgcodemst
    {
        [Key]
        public int id { get; set; }

        [StringLength(255)]
        public string mfgCode { get; set; }  // foreign key

        [StringLength(5)]
        public string mfgType { get; set; }  // foreign key

        [StringLength(255)]
        public string mfgName { get; set; }

        public int? customerID { get; set; }    // foreign key

        public int? dateCodeFormatID { get; set; }  // foreign key

        public bool isPricingApi { get; set; }

        [StringLength(255)]
        public string primaryContactName { get; set; }

        [StringLength(255)]
        public string email { get; set; }

        [StringLength(255)]
        public string website { get; set; }

        [StringLength(255)]
        public string contact { get; set; }

        public string comments { get; set; }

        [StringLength(8)]
        public string phExtension { get; set; }

        [StringLength(5)]
        public string contactCountryCode { get; set; }

        [StringLength(255)]
        public string faxNumber { get; set; }

        [StringLength(5)]
        public string faxCountryCode { get; set; }

        public bool? isActive { get; set; }

        public bool isCustOrDisty { get; set; }

        public int? custTermsID { get; set; }  // foreign key

        public string acquisitionDetail { get; set; }  

        public int? paymentTermsID { get; set; }

        [StringLength(255)]
        public string territory { get; set; }

        public int? shippingMethodID { get; set; }

        public bool? isCompany { get; set; }

        [StringLength(2)]
        public string scanDocumentSide { get; set; }

        public int? authorizeType { get; set; }

        public bool? systemGenerated { get; set; }

        public bool? isOrderQtyRequiredInPackingSlip { get; set; }

        [StringLength(2)]
        public string customerType { get; set; }

        public decimal? displayOrder { get; set; }

        public int? salesCommissionTo { get; set; }   // foreign key

        public int? freeOnBoardId { get; set; }  // foreign key

        [StringLength(2)]
        public string supplierMFRMappingType { get; set; }

        [StringLength(20)]
        public string taxID { get; set; }

        [StringLength(50)]
        public string accountRef { get; set; }

        public int? paymentMethodID { get; set; }  // foreign key

        public int? bankID { get; set; }  // foreign key

        public int? carrierID { get; set; }  // foreign key

        public int? rmaCarrierID { get; set; }  // foreign key

        public int? rmashippingMethodId { get; set; }  // foreign key

        [StringLength(50)]
        public string carrierAccount { get; set; }

        [StringLength(50)]
        public string rmaCarrierAccount { get; set; }

        public Int16 shippingInsurence { get; set; }

        public Int16 rmaShippingInsurence { get; set; }

        public string poComment { get; set; }

        [StringLength(5000)]
        public string documentPath { get; set; }

        [StringLength(30)]
        public string systemID { get; set; }

        [StringLength(30)]
        public string customerSystemID { get; set; }

        public bool? invoicesRequireManagementApproval { get; set; }

        public int? acctId { get; set; }    // foreign key

        public DateTime unqDate { get; set; }

        public bool isSupplierEnable { get; set; }

        public decimal? externalSupplierOrder { get; set; }

        public bool? isDeleted { get; set; }

        [StringLength(255)]
        public string createdBy { get; set; }

        [StringLength(255)]
        public string updatedBy { get; set; }

        [StringLength(255)]
        public string deletedBy { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime? updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        public int? createByRoleId { get; set; }

        public int? updateByRoleId { get; set; }

        public int? deleteByRoleId { get; set; }
    }
}
