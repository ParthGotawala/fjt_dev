using fjt.pricingservice.BOPricing.Interface;
using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using fjt.pricingservice.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace fjt.pricingservice.PartPicture
{
    public class PartPictureUpdate : IPartPictureUpdate
    {
        private readonly IgenericfilesRepository _IgenericfilesRepository;
        private readonly ICommonApiPricing _ICommonApiPricing;

        public PartPictureUpdate(IgenericfilesRepository IgenericfilesRepository, ICommonApiPricing ICommonApiPricing)
        {
            _IgenericfilesRepository = IgenericfilesRepository;
            _ICommonApiPricing = ICommonApiPricing;

        }
        public void InsertPicture(GenericFileDetail gencFile)
        {
            _IgenericfilesRepository.savePartPicture(gencFile);

            GenericFileStatus objfile = new GenericFileStatus()
            {
                gencFileName = gencFile.gencFileName,
                tags = gencFile.tags,
                activityUUID = gencFile.activityUUID
            };

            _ICommonApiPricing.ApiCallforPartPictureStatus(objfile);


        }

    }
}
