using System.Data;
using System.Data.SqlClient;

namespace Geoview.Tzemah.Common.Interfaces
{
    public interface ICommandExecutor
    {
        DataTable Execute(SqlCommand cm);
        bool ExecuteNonQuery(SqlCommand cm);
        object ExecuteScalar(SqlCommand cm);
    }
}
