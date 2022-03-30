using FJT.IdentityServer.Data.Interface;
using FJT.IdentityServer.Helper;
using FJT.IdentityServer.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data.DataMapper
{
    /// <summary>
    /// Used for Mapping SP Results Set to Perticular model for get data from database.
    /// </summary>
    public class DataMapper : IDataMapper
    {
        public AgreementListDetails AgreementListDetailsMapper(DbDataReader reader)
        {
            var result = new AgreementListDetails
            {
                // Result Set 1 - Count
                SpCountVM = reader.Translate<SpCountVM>(),

                // Result Set 2 - SpResult
                agreementListVMs = reader.Translate<AgreementListVM>()
            };
            return result;
        }

        public GetAgreementDetailDetails GetAgreementDetailDetailsMapper(DbDataReader reader)
        {
            var result = new GetAgreementDetailDetails
            {
                GetAgreementDetails = reader.Translate<GetAgreementDetail>()
            };
            return result;
        }

        public UserSignUpAgreementListDetails UserSignUpAgreementListDetailsMapper(DbDataReader reader)
        {
            var result = new UserSignUpAgreementListDetails
            {
                // Result Set 1 - Count
                SpCountVM = reader.Translate<SpCountVM>(),

                // Result Set 2 - SpResult
                UserSignUpAgreementLists = reader.Translate<UserSignUpAgreementList>()
            };
            return result;
        }

        public ArchieveVersionDetailsListDetails ArchieveVersionDetailsListDetailsMapper(DbDataReader reader)
        {
            var result = new ArchieveVersionDetailsListDetails
            {
                // Result Set 1 - Count
                SpCountVM = reader.Translate<SpCountVM>(),

                // Result Set 2 - SpResult
                ArchieveVersionDetailsLists = reader.Translate<ArchieveVersionDetailsList>()
            };
            return result;
        }

        public GetAgreedUserListVMDetails GetAgreedUserListVMDetailsMapper(DbDataReader reader)
        {
            var result = new GetAgreedUserListVMDetails
            {
                // Result Set 1 - Count
                SpCountVM = reader.Translate<SpCountVM>(),

                // Result Set 2 - SpResult
                GetAgreedUserListVMs = reader.Translate<GetAgreedUserListVM>()
            };
            return result;
        }

        public DownloadAgreementDetailsVMDetails DownloadAgreementDetailsVMDetailsMapper(DbDataReader reader)
        {
            var result = new DownloadAgreementDetailsVMDetails
            {
                DownloadAgreementDetailsVMs = reader.Translate<DownloadAgreementDetailsVM>()
            };
            return result;
        }
    }
}
