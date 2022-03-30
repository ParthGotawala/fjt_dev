using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Models.ViewModel
{
    public class UserAgreementVM
    {
        public int userAgreementID { get; set; }

        public string userID { get; set; }

        public int agreementID { get; set; }

        public DateTime? agreedDate { get; set; }

        public bool isDeleted { get; set; }

        public string createdBy { get; set; }

        public string updatedBy { get; set; }

        public string deletedBy { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime? updatedAt { get; set; }

        public DateTime? deletedAt { get; set; }

        public string createByRole { get; set; }

        public string updateByRole { get; set; }

        public string deleteByRole { get; set; }

        public string signaturevalue { get; set; }
    }
}
