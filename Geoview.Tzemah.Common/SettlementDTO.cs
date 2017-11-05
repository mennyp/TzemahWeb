//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class SettlementDTO :HistoricDataLocation
    {
        public SettlementDTO(int id, string name, SqlGeometry geom) : base(id, name, geom)
        {
        }
    }
}
