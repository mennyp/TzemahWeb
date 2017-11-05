using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ddk.Tzemah.WebNew.Models
{
    [Serializable]
    public class ReportTableCell
    {
        public string Value { get; set; }
        public CellColor Color { get; set; }

    }
}