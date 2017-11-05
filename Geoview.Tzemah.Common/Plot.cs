//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class Plot :IdBasedLocation
    {
        public Plot(int id, string name, SqlGeometry geom) : base(id, name, geom)
        {
        }
    }
}
