using System.Collections.Generic;
//using DDK.Inf.Log;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public class SoilSurveyMaterialsTable : Dictionary<string, object>
    {

        public SoilSurveyMaterialsTable(MagikHeader header, MagikDataLine line, MagikToRowsDictionary magikToRowsDictionary)//:base(StringComparer.InvariantCultureIgnoreCase)
        {

            string[] cells = line.Cells;
            for (int i = 0; i < cells.Length; i++)
            {
                string columnName = header.ColumnNames[i];
                string cellValue = cells[i];

                // parse materials:
                if (magikToRowsDictionary.ContainsKey(columnName))
                {
                    // only parse the material if it's not empty:
                    if (string.IsNullOrEmpty(cellValue)) continue;
                    if (string.IsNullOrEmpty(cellValue.Trim())) continue;

                    string materialColName = magikToRowsDictionary[columnName];
                    this[materialColName] = cellValue;

                }
            }

        }
    }
}