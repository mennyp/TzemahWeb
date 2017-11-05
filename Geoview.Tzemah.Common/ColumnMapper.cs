using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
//using DDK.Inf.Log;
using Westwind.Utilities;

namespace Geoview.Tzemah.Common
{
    //[Log]
    public static class ColumnMapper
    {
        public static void MapColumnValues(Expando model, DataRow row, Dictionary<string, TzemahFieldType> fieldNames)
        {
            foreach (KeyValuePair<string, TzemahFieldType> fieldName in fieldNames)
            {
                try
                {
                    switch (fieldName.Value)
                    {
                        case TzemahFieldType.esriFieldTypeSmallInteger:
                            {
                                model[fieldName.Key] = row.Field<Int16?>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeInteger:
                            {
                                model[fieldName.Key] = row.Field<Int32?>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeString:
                            {
                                model[fieldName.Key] = row.Field<string>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeOID:
                            {
                                model[fieldName.Key] = row.Field<int>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeDate:
                            {
                                model[fieldName.Key] = row.Field<DateTime?>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeXML:
                            {
                                model[fieldName.Key] = row.Field<string>(fieldName.Key);
                                break;
                            }
                        case TzemahFieldType.esriFieldTypeSingle:
                            {
                                model[fieldName.Key] = row.Field<decimal?>(fieldName.Key);
                                break;
                            }
                        default:
                            {
                                {
                                    model[fieldName.Key] = row.Field<dynamic>(fieldName.Key);
                                    break;
                                    ;
                                }
                            }
                    }
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error,
                    //    string.Format(
                    //        "Problem mapping field name  {0} with defined type  {1} for row {2}  Exception:\r\n{3}",
                    //        fieldName.Key, fieldName.Value,row,e));
                }
            }
        }
    }
}
