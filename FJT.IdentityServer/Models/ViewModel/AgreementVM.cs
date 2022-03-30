using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class AgreementVM
    {
        public int agreementID { get; set; }

        public int agreementTypeID { get; set; }

        public string agreementContent { get; set; }

        public int? version { get; set; }

        public string system_variables { get; set; }

        public bool? isPublished { get; set; }

        public DateTime? publishedDate { get; set; }

        //public string publishedDate { get; set; }

        public bool isDeleted { get; set; }

        public string createdBy { get; set; }

        public string updatedBy { get; set; }

        public string deletedBy { get; set; }

        public DateTime createdAt { get; set; }

        //public string createdAt { get; set; }

        public DateTime? updatedAt { get; set; }

        //public string updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        //public string deletedAt { get; set; }

        public string agreementSubject { get; set; }

        public string createByRole { get; set; }

        public string updateByRole { get; set; }
        public string deleteByRole { get; set; }
    }
}
