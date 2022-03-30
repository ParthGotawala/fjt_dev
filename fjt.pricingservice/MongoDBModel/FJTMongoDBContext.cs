
using System.Configuration;

namespace fjt.pricingservice.MongoDBModel
{
    public  class FJTMongoDBContext : MongoDBAbstract
    {
        static string con = ConfigurationManager.AppSettings["MongoDBServer"];
        static string db = ConfigurationManager.AppSettings["MongoDBName"];
        public FJTMongoDBContext()
            : base(con, db)
        {

        }
    }
}
