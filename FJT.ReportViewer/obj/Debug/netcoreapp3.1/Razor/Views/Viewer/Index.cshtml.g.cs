#pragma checksum "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "211d1af39a0b09169fd8a821f8f25b46acb9118d"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Viewer_Index), @"mvc.1.0.view", @"/Views/Viewer/Index.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\_ViewImports.cshtml"
using FJT.ReportViewer;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\_ViewImports.cshtml"
using FJT.ReportViewer.Models;

#line default
#line hidden
#nullable disable
#nullable restore
#line 1 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml"
using Stimulsoft.Report.Mvc;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml"
using System.Security.Claims;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"211d1af39a0b09169fd8a821f8f25b46acb9118d", @"/Views/Viewer/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"f05d6c9b700e982a28bcf41a061173ed7126e127", @"/Views/_ViewImports.cshtml")]
    public class Views_Viewer_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
#nullable restore
#line 4 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml"
  
    ViewBag.Title = "Index";

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n");
#nullable restore
#line 8 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml"
Write(Html.StiNetCoreViewer(new StiNetCoreViewerOptions()
{
    Actions =
    {
        GetReport = "GetReport",
        ViewerEvent = "ViewerEvent"
    },
    Server =
    {
        RequestTimeout = 90
    },
    Appearance = {
        FullScreenMode  = false
    }
}));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n\r\n\r\n<script type=\"text/javascript\">\r\n    $(function () {\r\n          window.sessionStorage.setItem(\"urlParameter\", \'");
#nullable restore
#line 27 "D:\Development\FJT\FJT-DEV\FJT.ReportViewer\Views\Viewer\Index.cshtml"
                                                    Write(ViewBag.urlParameter);

#line default
#line hidden
#nullable disable
            WriteLiteral("\');\r\n    });\r\n</script>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
