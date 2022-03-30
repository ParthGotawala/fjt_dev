using FJT.Reporting.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FJT.Reporting.Service.Interface
{
    public interface ICreditMemoService
    {

        CreditMemoResponseModel GetCreditMemoDetails(CreditMemoRequestModel creditMemoRequestModel);
        byte[] CreditMemoReportBytes(CreditMemoResponseModel creditMemoResponseModel, CreditMemoRequestModel creditMemoRequestModel);
    }
}