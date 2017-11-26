using System;
using System.Collections.Generic;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class MagikHeader
    {
        public readonly string[] ColumnNames;

        public MagikHeader(string header)
        {
            //string[] headerRows = header.Split(new string[] { "\r\n" }, StringSplitOptions.None);
            //string[] columnNames1 = headerRows[0].Split('\t');
            //string[] columnNames2 = headerRows[1].Split('\t');

            //List<string> columnNames = new List<string>(columnNames1.Length);
            //for (int i = 0; i < columnNames1.Length; i++)
            //{
            //    string columnName = columnNames1[i].Trim() + " " + columnNames2[i].Trim();
            //    columnName = columnName.Trim();
            //    columnNames.Add(columnName);
            //}

            //this.ColumnNames = columnNames.ToArray();
            List<string> columnNames = new List<string>();
            foreach (var c in header.Split(','))
            {
                columnNames.Add(c.Trim());
            }
            this.ColumnNames = columnNames.ToArray();

        }
    }
}
