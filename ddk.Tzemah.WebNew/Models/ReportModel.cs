using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ddk.Tzemah.WebNew.Models
{
    [Serializable]
    public class ReportModel
    {
        public ReportTableModel PitsTable { get; set; }
        public ReportTableModel LabDataTable { get; set; }
        public ReportTableModel FieldDataTable { get; set; }

        public string ImageUrl { get; set; }
        public List<string> AttachUrls { get; set; }
        
    }
}