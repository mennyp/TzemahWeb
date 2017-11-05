using System.Collections.Generic;
using System.Linq;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public static class ElementsQueryUpdater
    {
        public static string InsertQuery(string sqlQuery, List<string> elementsList)
        {
            string colList = string.Empty;
            string paramList = string.Empty;
            elementsList = elementsList.Select(element => element.Trim()).ToList();
            if (elementsList.Count > 0)
            {
                colList = "," + string.Join(",", elementsList);
                paramList = ",@" + string.Join(",@", elementsList);
            }
            return string.Format(sqlQuery,colList,paramList);
        }

        public static string UpdateQuery(string sqlQuery, List<string> elementsList)
        {
            string assignList = string.Empty;
            elementsList = elementsList.Select(element => element.Trim()).ToList();
            if (elementsList.Count > 0)
            {
                
                foreach (string element in elementsList)
                {
                    assignList +=","+ element + "=@" + element;    
                }
                
            }
            return string.Format(sqlQuery, assignList);
        }
    }
}
