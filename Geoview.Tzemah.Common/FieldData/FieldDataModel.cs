using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
//using DDK.Inf.Log;
using Microsoft.SqlServer.Types;
using Newtonsoft.Json;
using Westwind.Utilities;

namespace Geoview.Tzemah.Common.FieldData
{
    //[Log]
    [Serializable]
    [JsonConverter(typeof(FieldDataSerializer))]
    public class FieldDataModel :  Expando
    {
        public FieldDataModel(int pitId, int depthFrom,int depthTo, int depthId)
        {
            PitId = pitId;
            DepthFrom = depthFrom;
            DepthTo = depthTo;
            DepthId = depthId;
        }


        public FieldDataModel(DataRow row, Dictionary<string,TzemahFieldType> fieldNames, DataColumnCollection columns)
        {
            PitId = row.Field<int>("PitId");
            FieldDataId = row.Field<int>("OBJECTID");
            DepthFrom = row.Field<Int16>("DepthFrom");
            DepthTo = row.Field<Int16>("DepthTo");
            DepthId = row.Field<Int16>("DepthId");
            SqlGeometry location = row.Field<SqlGeometry>("SHAPE");
            X = (int)location.STX;
            Y = (int)location.STY;

            ColumnMapper.MapColumnValues(this, row, fieldNames);
        }

  

        public FieldDataModel(NameValueCollection paramsCollection, List<string> fieldDataFieldNames)
        {
            PitId = Convert.ToInt32(paramsCollection["PitId"]);

            int fieldDataId;
            Int32.TryParse(paramsCollection["FieldDataId"],out fieldDataId) ;
            FieldDataId = fieldDataId;
            DepthFrom = Convert.ToInt32(paramsCollection["DepthFrom"]);
            DepthId = Convert.ToInt32(paramsCollection["DepthId"]);
            DepthTo = Convert.ToInt32(paramsCollection["DepthTo"]);
            Comment= paramsCollection["Comment"];

            foreach (string fieldName in fieldDataFieldNames)
            {
                object value = paramsCollection[fieldName];
                value = value ?? 0;
                value = value.ToString().ToLower().Equals("no") ? 0 : value;
                value = value.ToString().ToLower().Equals("yes") ? 1 : value;
                try
                {
                    this[fieldName] = value;
                }
                catch (Exception e)
                {
                    //Logger.LogMessage(LogInfo.Error, string.Format("Problem getting field {0} from pitId {1} depthFrom {2} Soil \r\n Exception:\r\n{3}", fieldName, PitId, DepthFrom, e));
                }
            }
            
        }

        public override string ToString()
        {
            string result = string.Empty;
            IEnumerable<KeyValuePair<string, object>> properties = GetProperties(true);
            result = properties.Aggregate(result, (current, property) => current + string.Format(@"{0}:{1},", property.Key, property.Value));
            result += "\r\n";
            return result;
        }
        [DataMember]
        public int DepthId { get; set; }
        [DataMember]
        public int DepthTo { get; set; }
        [DataMember]
        public int DepthFrom { get; set; }
        [DataMember]
        public int PitId { get; set; }
        [DataMember]
        public string Comment { get; set; }
        public int Y { get; set; }

        public int X { get; set; }

        public int FieldDataId { get; set; }
    }
}
