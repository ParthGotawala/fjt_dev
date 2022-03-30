using FJT.IdentityServer.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data.Interface
{
    public interface IDataMapper
    {
        AgreementListDetails AgreementListDetailsMapper(DbDataReader reader);
        GetAgreementDetailDetails GetAgreementDetailDetailsMapper(DbDataReader reader);
        UserSignUpAgreementListDetails UserSignUpAgreementListDetailsMapper(DbDataReader reader);
        ArchieveVersionDetailsListDetails ArchieveVersionDetailsListDetailsMapper(DbDataReader reader);
        GetAgreedUserListVMDetails GetAgreedUserListVMDetailsMapper(DbDataReader reader);
        DownloadAgreementDetailsVMDetails DownloadAgreementDetailsVMDetailsMapper(DbDataReader reader);
    }
}
