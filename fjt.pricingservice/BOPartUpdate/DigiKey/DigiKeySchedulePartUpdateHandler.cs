using fjt.pricingservice.Model;
using fjt.pricingservice.Repository.Interface;
using fjt.pricingservice.Helper;
using Unity;

namespace fjt.pricingservice.BOPartUpdate.DigiKey
{
    public class DigiKeySchedulePartUpdateHandler : IDigiKeySchedulePartUpdateHandler
    {
        private readonly IsystemconfigrationsRepository _IsystemconfigrationsRepository;
        public DigiKeySchedulePartUpdateHandler(IsystemconfigrationsRepository IsystemconfigrationsRepository)
        {
            _IsystemconfigrationsRepository = IsystemconfigrationsRepository;
        }
        public int updateScheduleComponent(ComponentScheduleViewModel componentModel)
        {
            //var systemConfig = _IsystemconfigrationsRepository.GetSystemConfiguration(ConstantHelper.DKVersion);
            var digiKeyConfiguration = _IsystemconfigrationsRepository.GetExternalApiConfig(-1,ConstantHelper.FJTSchedulePartUpdateV3);
            IPartUpdateHandler _IPartUpdateHandler = UnityConfig.Container.Resolve<IPartUpdateHandler>();
            ExternalPartVerificationRequestLog objExtVerification = new ExternalPartVerificationRequestLog()
            {
                partNumber = componentModel.mfgPN.ToUpper(),
                supplier = Helper.Helper.UpdateComponentSupplier.DigiKey.GetEnumStringValue(),
                partID= componentModel.id,
                type = ConstantHelper.FJTSchedulePartUpdateV3
            };
           return _IPartUpdateHandler.SavePartDetail(componentModel.mfgPN.ToUpper(), digiKeyConfiguration.accessToken, digiKeyConfiguration.clientID, objExtVerification, digiKeyConfiguration.perCallRecordCount);
        }
    }
}
