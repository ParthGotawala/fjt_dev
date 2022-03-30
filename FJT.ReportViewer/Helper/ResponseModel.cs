using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.ReportViewer.Helper
{
    public class ResponseModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is success.
        /// </summary>
        /// <value><c>true</c> if this instance is success; otherwise, <c>false</c>.</value>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>The message.</value>
        public string Message { get; set; }
        /// <summary>
        /// Gets or sets the model.
        /// </summary>
        /// <value>The model.</value>
        public object Model { get; set; }
        /// <summary>
        /// Gets or sets the List Count.
        /// </summary>
        /// <value>The model.</value>
        public int ListCount { get; set; }
        /// <summary>
        /// Gets or sets the Count of Active Employee.
        /// </summary>
        /// <value>The Active Employee.</value>
        public int ActiveEmpCount { get; set; }

        public int StatusCode { get; set; }
    }
}
