using FJT.Reporting.Models;
using FJT.Reporting.Repository.Interface;
using FJT.Reporting.ViewModels;
using MySql.Data.MySqlClient;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace FJT.Reporting.Repository
{
    public class SystemConfigrationRepository : Repository<SystemConfigrations>, ISystemConfigrationRepository
    {
        public SystemConfigrationRepository(UnitOfWork unitOfWork)
            : base(unitOfWork.Context)
        {
        }

        public QuoteSummaryDet GetQuoteSummaryDetails(QuoteSummaryModel quoteSummaryModel, string APIProjectURL)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("prfqAssyID", quoteSummaryModel.RFQAssyID),
                  new MySqlParameter("pAssyQuoteSubmittedID", quoteSummaryModel.AssyQuoteSubmittedID)
              };

            QuoteSummaryDet model = new QuoteSummaryDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_GetQuoteSummaryDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.QuoteDetails = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<RFQ_Assy_Quote_Submitted_Assydetail>(reader).ToList();

                reader.NextResult();
                model.AssyDetail = ((IObjectContextAdapter)Context)
                .ObjectContext
                .Translate<RFQ_Assembly_Detail>(reader).ToList();

                reader.NextResult();
                model.RevisedQuoteDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Assemblies_Quotation_Submitted>(reader).ToList();

                reader.NextResult();
                model.RFQSelectedTermsAndConditions = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQSelectedTermsAndConditions>(reader).ToList();

                reader.NextResult();
                model.StandardClass = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Summary_StandardClass>(reader).ToList();

                reader.NextResult();
                model.LastSubmitedQuote = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Assemblies_Quotation_Submitted>(reader).ToList();

                reader.NextResult();
                model.CustomPartDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Assy_Quote_Custom_Part_Detail>(reader).ToList();

                reader.NextResult();
                model.NREDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Assy_Quote_NRE_Details>(reader).ToList();

                reader.NextResult();
                model.ToolingDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Assy_Quote_Tooling_Details>(reader).ToList();

                reader.NextResult();
                model.CompanyDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<Company_Detail>(reader).ToList();

                reader.NextResult();
                model.rfqPriceGroupDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<RFQ_Price_Group_Detail>(reader).ToList();

                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }

        public QuoteIsSubjectToFollowingDet GetQuoteisSubjectToFollowingDetails(QuoteSummaryModel quoteSummaryModel)
        {
            MySqlParameter[] parameters = new MySqlParameter[]
              {
                  new MySqlParameter("prfqAssyID", quoteSummaryModel.RFQAssyID),
                  new MySqlParameter("pAssyQuoteSubmittedID", quoteSummaryModel.AssyQuoteSubmittedID)
              };

            QuoteIsSubjectToFollowingDet model = new QuoteIsSubjectToFollowingDet();

            var cmd = this.Context.Database.Connection.CreateCommand();
            cmd.CommandText = "Sproc_getQuoteSubjectToFollowingDetails";
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddRange(parameters);
            try
            {
                cmd.Connection.Open();
                var reader = cmd.ExecuteReader();

                model.ExcessMaterialDetails = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.CustomerConsignedDetail = ((IObjectContextAdapter)Context)
                 .ObjectContext
                 .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.UnquotedItemDetail = ((IObjectContextAdapter)Context)
                .ObjectContext
                .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.UnquotedLaborDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.LowStockAlertDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.LongLeadTimeDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.QuoteObsoletePartDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.PartLOADetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.CustomerApprovalCommentDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                reader.NextResult();
                model.BOMIssueDetail = ((IObjectContextAdapter)Context)
                   .ObjectContext
                   .Translate<QuoteIsSubjectToFollowingCommonModel>(reader).ToList();

                return model;
            }
            finally
            {
                Context.Database.Connection.Close();
            }
        }
    }
}