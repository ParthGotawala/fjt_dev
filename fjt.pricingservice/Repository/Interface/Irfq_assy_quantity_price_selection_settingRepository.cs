using fjt.pricingservice.MySqlDBModel;
namespace fjt.pricingservice.Repository.Interface
{
    public interface Irfq_assy_quantity_price_selection_settingRepository : IRepository<rfq_assy_quantity_price_selection_setting>
    {
        rfq_assy_quantity_price_selection_setting GetPriceSelectionSetting(int QtyID);
    }
}
