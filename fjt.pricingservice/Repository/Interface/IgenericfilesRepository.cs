using fjt.pricingservice.Model;
using fjt.pricingservice.MySqlDBModel;
using System.Collections.Generic;

namespace fjt.pricingservice.Repository.Interface
{
    public interface IgenericfilesRepository : IRepository<genericfiles>
    {
        void savePartPicture(GenericFileDetail gencFile);
    }
}
