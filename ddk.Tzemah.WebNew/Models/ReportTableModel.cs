using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ddk.Tzemah.WebNew.Models
{
    [Serializable]
    public class ReportTableModel
    {
        public List<string> Header { get; set; }
        public List<ReportTableRow> TableData{ get; set; }

    }
}