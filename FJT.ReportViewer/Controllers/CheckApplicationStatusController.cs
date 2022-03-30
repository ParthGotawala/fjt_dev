using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FJT.ReportViewer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckApplicationStatusController : ControllerBase
    {
        // GET: api/<CheckApplicationStatusController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
