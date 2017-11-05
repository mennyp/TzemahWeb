using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
//using DDK.Inf.Log;

namespace Geoview.SoilManagement.ReportGenerator
{
    //[Log]
    public class DataCell
    {
        public string Value { get;private set; }
        public Color Color { get;private set; }


        public DataCell(string value, Color color)
        {
            Value = value;
            Color = color;
        }

        public DataCell(string value) : this(value, Color.Black )
        {
            
        }
    }
}
