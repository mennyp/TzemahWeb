//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class HistoricDataLocation:IdBasedLocation
    {
        public int? HistoricId { get; set; }
        public string EnglishName { get; set; }
        public HistoricDataLocation(int id, string name, SqlGeometry geom) : base(id, name, geom)
        {
        }
    }
}
