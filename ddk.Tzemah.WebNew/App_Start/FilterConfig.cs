using System.Web;
using System.Web.Mvc;

namespace ddk.Tzemah.WebNew
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
