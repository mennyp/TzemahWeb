using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Geoview.SoilManagement.ReportGenerator
{
    public class ReportDataSource
    {

        public string Date { get { return DateTime.Now.ToString(@"dd/MM/yyyy"); } }
    }
}
