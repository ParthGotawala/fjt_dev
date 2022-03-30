using fjt.pricingservice.Model;

namespace fjt.pricingservice.BOPricing.Interface
{
    public interface IPricingRequest
    {
        void Pricing(AutoPricingLineItemwiseStatus LineItem);
    }
}
