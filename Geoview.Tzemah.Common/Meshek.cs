using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    [Serializable]
    public class Meshek 
    {
        [DataMember]
        public string ID { get; set; }
        [DataMember]
        public string HebName { get; set; }
        [DataMember]
        public string EngName { get; set; }

        public Meshek(string id, string hebName, string engName,SqlGeometry geom,SqlGeometry boundGeom)
        {
            ID = id;
            HebName = hebName;
            EngName = engName;
        }
    }
}
