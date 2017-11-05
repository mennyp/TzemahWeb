using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using DDK.Inf.Log;

namespace Geoview.SoilManagement.ReportGenerator
{
    //[Log]
    public class PitsDesc
    {
        public string Header { get;private set; }
        public string Content { get;private set; }

        public PitsDesc(string header,string content )
        {
            Header = header;
            Content = content;
        }
    }
}
