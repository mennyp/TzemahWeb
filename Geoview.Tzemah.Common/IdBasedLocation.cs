//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public    class IdBasedLocation
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public SqlGeometry Geom { private get;  set; }

        public int X
        {
            get
            {
                if (Geom.STGeometryType().ToString().ToLower().Equals("Polygon".ToLower()))
                {
                    return (int) Geom.STCentroid().STX.ToSqlInt32();
                }
                if (Geom.STGeometryType().ToString().ToLower().Equals("LineString".ToLower()))
                {
                    return (int)Geom.STStartPoint().STX.ToSqlInt32();
                }
                return (int) Geom.STX;

            }
        }
        public int Y
        {
            get
            {
                if (Geom.STGeometryType().ToString().ToLower().Equals("Polygon".ToLower()))
                {
                    return (int)Geom.STCentroid().STY.ToSqlInt32();
                }
                if (Geom.STGeometryType().ToString().ToLower().Equals("LineString".ToLower()))
                {
                    return (int)Geom.STStartPoint().STY.ToSqlInt32();
                }
                return (int)Geom.STY;

            }
        }
        public IdBasedLocation(int id,string name,SqlGeometry geom)
        {
            Id = id;
            Name = name;
            Geom = geom;
        }
    }
}
