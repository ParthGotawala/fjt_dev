using FJT.ReportViewer.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Enums
{
    /// <summary>
    /// Constant Report Variable.
    /// Here Name(attribute) = value of variable.
    /// </summary>
    public enum ConstantReportVariable
    {
        [Display(Name = "We declare that the product(s)/process(s) supplied (CHECK MARKED) under below listed manufactured by Flextron Circuit Assembly (FCA) are compliance withRoHS 2 Directive 2015/65/EU / RoHS 3 Directive 2015/863 of the European Parliament and of Council of June 4, 2015 on the restriction of the use of certainhazardous substances (Lead (Pb), Cadmium (Cd), Mercury (Hg), Hexavalent Chromium or their compounds, Flame retardants PolyBrominated Biphenyls (PBB)and PolyBrominated Diphenyl Ethers (PBDE)) in electrical and electronic equipment (RoHS Directives). Manufacturer part label should state RoHS status of thepart. <b>RoHS declaration does not apply to Non-RoHS items.</b>")]
        Para_DeclarationOfRoHSCompliance,

        [Display(Name = "THIS IS TO CERTIFY THAT THE MATERIAL SHIPPED FOR THIS ORDER IS MANUFACTURED IN COMPLIANCE WITH CUSTOMER SUPPLIED AND/OR STATED SPECIFICATIONS. CERTIFICATION DOES NOT APPLY TO CUSTOMER CONSIGNED ITEMS LACKING CERTIFICATION OF CONFORMANCE.")]
        Para_COFCReportDisclaimer,

        [Display(Name = "FLEXTRON CIRCUIT ASSEMBLY SHALL IN NO EVENT BE LIABLE FOR ANY LOSS OR DAMAGES, DIRECT OR INDIRECT, INCIDENTAL OR CONSEQUENTIAL, ARISING OUT OF USE OF, OR THE INABILITY TO USE THE PRODUCT(S). WRITTEN NOTIFICATION OF CLAIMS AGAINST THIS PRODUCT MUST BE MADE WITHIN 30 DAYS FROM RECEIPT. MAXIMUM LIABILITY LIMITED TO THE COST OF PRODUCTS AND/OR SERVICES PROVIDED.")]
        Para_PACKINGSLIPReportDisclaimer,

        [Display(Name = "Disclaimer: This RoHS compliance statement is, to the best of Flextron's knowledge, accurate as of the date indicated on this page. As some of the information is based upon data provided from sources outside of the Company, Flextron makes no representation or warranty as to the accuracy of such information. Flextron continues to work toward obtaining valid and certifiable third-party information, but has not necessarily conducted analytical or chemical analyses on all materials or purchased components.In no event shall Flextron's liability arising out of such information exceed the purchase price of the Flextron's item(s) sold to Customer.")]
        Para_RoHSReportDisclaimer
    }
}
